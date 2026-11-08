import { createContext } from 'react';
import type { UseUserLocationReturn } from '@/hooks/controlador/useUserLocation';

export interface LocationContextValue extends UseUserLocationReturn {
  clearUserLocation: () => Promise<void>;
}

// Keep context identity independent of provider/hook hot updates.
export const LocationContext = createContext<LocationContextValue | null>(null);