import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { NeonBackground } from "./components/NeonBackground";
import { BeamSweep } from "./components/BeamSweep";
import { BRAND, BUSINESS } from "./constants";
import { BrandFonts, ORBITRON as orbitron, TAJAWAL as tajawal } from "./fonts";

/** Fade + rise helper driven by a spring, for clean text entrances. */
const useEnter = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping },
  });
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
  };
};

const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const brand = useEnter(6);
  const ar = useEnter(20);

  // Neon glow flickers in as the name lands.
  const glow = interpolate(frame, [10, 28, 34, 40], [0, 28, 14, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 14 }}
    >
      <BeamSweep delay={8} duration={50} />
      <div
        style={{
          ...brand,
          fontFamily: orbitron,
          fontSize: 132,
          fontWeight: 800,
          letterSpacing: 6,
          color: BRAND.textPrimary,
          textShadow: `0 0 ${glow}px ${BRAND.cyanIntense}, 0 0 ${glow * 2}px ${BRAND.cyanGlow}`,
          textTransform: "uppercase",
        }}
      >
        Abdulkareem
      </div>
      <div
        style={{
          ...brand,
          fontFamily: orbitron,
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: 28,
          color: BRAND.cyan,
          textShadow: `0 0 ${glow}px ${BRAND.cyanIntense}`,
          textTransform: "uppercase",
        }}
      >
        Auto
      </div>
      <div
        style={{
          ...ar,
          fontFamily: tajawal,
          fontSize: 44,
          color: BRAND.textSecondary,
          marginTop: 12,
        }}
      >
        {BUSINESS.nameAr}
      </div>
    </AbsoluteFill>
  );
};

const ServiceRow: React.FC<{ label: string; delay: number }> = ({
  label,
  delay,
}) => {
  const s = useEnter(delay, 160);
  return (
    <div
      style={{
        ...s,
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: orbitron,
        fontSize: 52,
        color: BRAND.textPrimary,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          background: BRAND.cyan,
          boxShadow: `0 0 18px ${BRAND.cyanIntense}`,
        }}
      />
      {label}
    </div>
  );
};

const SceneServices: React.FC = () => {
  const title = useEnter(4);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 36,
      }}
    >
      <BeamSweep delay={2} duration={60} />
      <div
        style={{
          ...title,
          fontFamily: tajawal,
          fontSize: 40,
          letterSpacing: 8,
          color: BRAND.cyan,
          textTransform: "uppercase",
        }}
      >
        {BUSINESS.tagline}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <ServiceRow label="Headlight Retrofits" delay={16} />
        <ServiceRow label="Custom LED & Laser" delay={26} />
        <ServiceRow label="Color & Tint Styling" delay={36} />
      </div>
    </AbsoluteFill>
  );
};

const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const heading = useEnter(6);
  const info = useEnter(20);

  const pulse = interpolate(
    Math.sin(frame / 6),
    [-1, 1],
    [0.9, 1.04],
  );

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 30 }}
    >
      <div
        style={{
          ...heading,
          fontFamily: orbitron,
          fontSize: 88,
          fontWeight: 800,
          color: BRAND.textPrimary,
          letterSpacing: 4,
          textShadow: `0 0 24px ${BRAND.cyanGlow}`,
          transform: `${heading.transform} scale(${pulse})`,
          textTransform: "uppercase",
        }}
      >
        Light Up Your Drive
      </div>

      <div
        style={{
          ...info,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          fontFamily: orbitron,
          color: BRAND.textSecondary,
          fontSize: 42,
        }}
      >
        <div style={{ color: BRAND.cyan, fontSize: 48 }}>
          {BUSINESS.phoneDisplay}
        </div>
        <div>{BUSINESS.instagram}</div>
        <div style={{ fontSize: 34 }}>{BUSINESS.location}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Cross-fades between two scenes over `overlap` frames. */
const Fade: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({
  children,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      <BrandFonts />
      <NeonBackground />

      <Sequence durationInFrames={120}>
        <Fade durationInFrames={120}>
          <SceneIntro />
        </Fade>
      </Sequence>

      <Sequence from={110} durationInFrames={120}>
        <Fade durationInFrames={120}>
          <SceneServices />
        </Fade>
      </Sequence>

      <Sequence from={220} durationInFrames={140}>
        <Fade durationInFrames={140}>
          <SceneCTA />
        </Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
