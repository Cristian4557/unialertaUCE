import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { LocationProvider, useGlobalLocation } from './LocationContext';
import { LocationContext } from './location-context';

vi.mock('@/hooks/controlador/useSessionPersistence', () => ({
  useSessionPersistence: () => ({ isAuthenticated: false, loading: false, user: null }),
}));
vi.mock('@/hooks/controlador/useLocationSync', () => ({
  useLocationSync: () => ({ syncLocation: vi.fn(), clearUserLocation: vi.fn() }),
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {} }));

describe('location context identity', () => {
  it('shares the provider with consumers when there is no session or location', async () => {
    const root = createRoot(document.createElement('div'));
    let observed: ReturnType<typeof useGlobalLocation> | undefined;
    function Consumer() {
      observed = useGlobalLocation();
      return null;
    }
    await act(async () => {
      root.render(createElement(LocationProvider, null, createElement(Consumer)));
    });
    expect(observed?.location).toBeNull();
    expect(observed?.isTracking).toBe(false);
    expect(typeof observed?.clearUserLocation).toBe('function');
    await act(async () => root.unmount());
  });

  it('reads the same context object from an independently imported provider', async () => {
    const root = createRoot(document.createElement('div'));
    const value = {
      location: null, error: null, isSupported: false, isTracking: false,
      startTracking: vi.fn(), stopTracking: vi.fn(), clearUserLocation: vi.fn(),
    };
    let observed: ReturnType<typeof useGlobalLocation> | undefined;
    function Consumer() { observed = useGlobalLocation(); return null; }
    await act(async () => root.render(createElement(LocationContext.Provider, { value }, createElement(Consumer))));
    expect(observed).toBe(value);
    await act(async () => root.unmount());
  });
});