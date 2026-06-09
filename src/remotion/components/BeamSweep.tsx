import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * A single headlight-style light beam that sweeps across the frame once,
 * evoking the product (custom car lighting). `delay` offsets the sweep so
 * multiple beams can be layered.
 */
export const BeamSweep: React.FC<{ delay?: number; duration?: number }> = ({
  delay = 0,
  duration = 45,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;

  const x = interpolate(local, [0, duration], [-60, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const opacity = interpolate(
    local,
    [0, duration * 0.25, duration * 0.75, duration],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: `${x}%`,
          width: "18%",
          height: "140%",
          transform: "rotate(18deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(53,184,255,0.55), rgba(244,246,255,0.9), rgba(53,184,255,0.55), transparent)",
          filter: "blur(14px)",
        }}
      />
    </AbsoluteFill>
  );
};
