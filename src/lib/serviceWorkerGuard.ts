/**
 * The offline service worker precaches the app bundle. Inside the editor preview
 * (iframe / preview hosts) that makes the preview keep running outdated code,
 * so the worker is only allowed on the published app.
 */
export function isServiceWorkerAllowed(): boolean {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  let inIframe = false;
  try {
    inIframe = window.self !== window.top;
  } catch {
    inIframe = true;
  }
  const host = window.location.hostname;
  const isPreviewHost =
    host.includes('id-preview--') ||
    host.includes('lovableproject.com') ||
    host === 'localhost' ||
    host === '127.0.0.1';
  return !inIframe && !isPreviewHost;
}

/** Remove any service worker and cached bundles left in a preview context. */
export async function cleanupPreviewServiceWorkers(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((r) => r.unregister()));
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (error) {
    console.warn('[App] No se pudo limpiar el Service Worker de vista previa:', error);
  }
}
