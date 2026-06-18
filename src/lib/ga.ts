/**
 * Lightweight GA4 event helper. Safe to call from client components — no-ops
 * if gtag isn't loaded (e.g. no GA id, ad-blockers, SSR).
 */
type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: GtagParams) => void;
  }
}

export function trackEvent(name: string, params: GtagParams = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}
