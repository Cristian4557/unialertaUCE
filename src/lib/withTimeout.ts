/** Bound asynchronous work even when a transport does not honor cancellation. */
export async function withTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  milliseconds: number,
  message: string,
  parentSignal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  const deadline = new Promise<never>((_, reject) => {
    const fail = () => {
      reject(new Error(message));
      controller.abort();
    };
    timer = setTimeout(fail, milliseconds);
    onAbort = fail;
    parentSignal?.addEventListener('abort', fail, { once: true });
    if (parentSignal?.aborted) fail();
  });
  try {
    return await Promise.race([deadline, operation(controller.signal)]);
  } finally {
    clearTimeout(timer);
    if (onAbort) parentSignal?.removeEventListener('abort', onAbort);
  }
}