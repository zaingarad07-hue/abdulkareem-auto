/**
 * Shared brand constants for the Remotion video, kept in sync with the
 * website theme (tailwind.config.js) and business config (src/config.ts).
 */

export const BRAND = {
  cyan: "#35B8FF",
  cyanGlow: "rgba(53, 184, 255, 0.35)",
  cyanIntense: "rgba(53, 184, 255, 0.6)",
  bg: "#05060B",
  bgSecondary: "#0B0E1A",
  textPrimary: "#F4F6FF",
  textSecondary: "#A7A9B5",
} as const;

export const BUSINESS = {
  name: "Abdulkareem Auto",
  nameAr: "عبدالكريم أوتو",
  tagline: "Premium Car Lighting Customization",
  taglineAr: "تخصيص إضاءة السيارات الاحترافي",
  location: "Dubai, UAE",
  phoneDisplay: "+971 50 734 3330",
  instagram: "@abdulkareemauto",
} as const;

/** Video timing — 30 fps, 1080p, ~12s promo. */
export const VIDEO = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 12 * 30, // 12 seconds
} as const;
