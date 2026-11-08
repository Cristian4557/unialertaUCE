import { describe, it, expect, vi, afterEach } from 'vitest';
import { withTimeout } from './withTimeout';

afterEach(() => vi.useRealTimers());

describe('withTimeout', () => {
  it('rejects a stalled request and aborts its transport', async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    const request = withTimeout((s) => {
      signal = s;
      return new Promise<string>(() => {});
    }, 5000, 'Tiempo agotado');
    const assertion = expect(request).rejects.toThrow('Tiempo agotado');
    await vi.advanceTimersByTimeAsync(5000);
    await assertion;
    expect(signal?.aborted).toBe(true);
  });

  it('returns successful data without leaving a deadline active', async () => {
    vi.useFakeTimers();
    expect(await withTimeout(async () => 'resultado', 5000, 'Tiempo agotado')).toBe('resultado');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('settles when the caller cancels an unresponsive transport', async () => {
    const controller = new AbortController();
    const request = withTimeout(() => new Promise(() => {}), 5000, 'Cancelado', controller.signal);
    controller.abort();
    await expect(request).rejects.toThrow('Cancelado');
  });
});