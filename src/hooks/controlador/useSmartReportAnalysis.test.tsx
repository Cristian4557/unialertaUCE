import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSmartReportAnalysis, type UseSmartReportAnalysisReturn } from './useSmartReportAnalysis';

const invoke = vi.hoisted(() => vi.fn());
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke } } }));

afterEach(() => { vi.useRealTimers(); invoke.mockReset(); });

async function mountAnalysis() {
  let hook: UseSmartReportAnalysisReturn | undefined;
  const container = document.createElement('div');
  const root = createRoot(container);
  function Harness() {
    hook = useSmartReportAnalysis();
    return null;
  }
  await act(async () => { root.render(createElement(Harness)); });
  return {
    getHook: () => {
      if (!hook) throw new Error('Hook not mounted');
      return hook;
    },
    dispose: async () => { await act(async () => root.unmount()); },
  };
}

describe('smart image analysis recovery', () => {
  it.each([
    { stage: 'upload', duration: 30000 },
    { stage: 'analysis', duration: 45000 },
  ])('clears loading when $stage never responds', async ({ stage, duration }) => {
    vi.useFakeTimers();
    if (stage === 'analysis') invoke.mockResolvedValueOnce({ data: { secure_url: 'https://example.invalid/mock.jpg' } });
    invoke.mockImplementation(() => new Promise(() => {}));
    const harness = await mountAnalysis();
    let request: Promise<unknown> | undefined;
    await act(async () => { request = harness.getHook().analyzeImage('mock-image'); });
    expect(harness.getHook().isAnalyzing).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(duration); });
    expect(await request).toBeNull();
    expect(harness.getHook().isAnalyzing).toBe(false);
    expect(harness.getHook().error).toContain('tardó demasiado');
    const signal = invoke.mock.calls.at(-1)?.[1].signal as AbortSignal;
    expect(signal.aborted).toBe(true);
    await harness.dispose();
  });

  it('returns a successful analysis after uploading the simulated image', async () => {
    const result = { titulo: 'Incidente simulado', descripcion: 'Prueba', prioridad: 'medio', categoriaKeywords: [], tipoKeywords: [], infoAdicional: '' };
    invoke.mockResolvedValueOnce({ data: { secure_url: 'https://example.invalid/mock.jpg' } });
    invoke.mockResolvedValueOnce({ data: result });
    const harness = await mountAnalysis();
    await act(async () => { expect(await harness.getHook().analyzeImage('mock-image')).toEqual(result); });
    expect(harness.getHook().isAnalyzing).toBe(false);
    expect(harness.getHook().error).toBeNull();
    await harness.dispose();
  });
});