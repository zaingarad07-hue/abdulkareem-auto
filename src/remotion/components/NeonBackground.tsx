import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BRAND } from "../constants";

/**
 * Dark automotive backdrop: layered radial glows plus a slowly drifting
 * perspective grid, matching the site's cyan-on-near-black neon aesthetic.
 */
export const NeonBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Glow pulses gently across the whole clip.
  const pulse = interpolate(
    Math.sin((frame / durationInFrames) * Math.PI * 4),
    [-1, 1],
    [0.25, 0.5],
  );

  // Grid scrolls toward the viewer.
  const gridShift = (frame * 1.4) % 80;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, overflow: "hidden" }}>
      {/* Base vertical gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${BRAND.bg} 0%, ${BRAND.bgSecondary} 55%, ${BRAND.bg} 100%)`,
        }}
      />

      {/* Drifting perspective grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${BRAND.cyanGlow} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.cyanGlow} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `center ${gridShift}px`,
          opacity: 0.12,
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 45%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 45%, black 10%, transparent 75%)",
        }}
      />

      {/* Central cyan halo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, rgba(53,184,255,${pulse}) 0%, transparent 45%)`,
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
