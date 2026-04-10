let initialized = false;

/**
 * Initialize analytics (e.g. GA4). Call once at app boot.
 * Replace with gtag('config', measurementId) or similar when integrating a real provider.
 */
export const init = (measurementId?: string): void => {
  if (initialized) return;
  initialized = true;
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
    console.log('[analytics] init', measurementId ?? '(no id)');
  }
};

/**
 * Send a page view. Call on initial load and on route change.
 */
export const pageview = (path: string): void => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
    console.log('[analytics] pageview', path);
  }
};

/**
 * Send an event (e.g. outbound click). Replaces React-GA event().
 */
export const trackEvent = (category: string, action: string, label?: string): void => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
    console.log('[analytics] event', { category, action, label });
  }
};
