// Centralized feature flags for optional product features.
export const CHATBOT_ENABLED = false;

// Analytics (Umami). Enabled only when both URL and website ID are set.
export const ANALYTICS_CONFIG = {
  enabled: false,
  scriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "",
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "",
};