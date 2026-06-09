import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { FONT_FACE_CSS } from "./font-faces";

export const ORBITRON = "Orbitron";
export const TAJAWAL = "Tajawal";

/**
 * Injects the embedded @font-face rules and blocks rendering (via delayRender)
 * until both brand fonts are actually loaded, so no frame is captured with a
 * fallback font. Render once near the root of every composition.
 */
export const BrandFonts: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading brand fonts"));

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      document.fonts.load(`700 64px "${ORBITRON}"`),
      document.fonts.load(`800 64px "${ORBITRON}"`),
      document.fonts.load(`400 64px "${ORBITRON}"`),
      document.fonts.load(`700 64px "${TAJAWAL}"`),
      document.fonts.load(`400 64px "${TAJAWAL}"`),
    ])
      .then(() => document.fonts.ready)
      .then(() => {
        if (!cancelled) continueRender(handle);
      })
      .catch(() => {
        // Never hang the render on a font hiccup — fall back gracefully.
        if (!cancelled) continueRender(handle);
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return <style>{FONT_FACE_CSS}</style>;
};
