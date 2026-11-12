/**
 * Registers the offline service worker from the original StrayAssist app.
 * Production only: in the dev preview a cached navigation shell could serve
 * stale pages after edits.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  });
}
