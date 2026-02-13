import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

const features = [
  {
    icon: "⚡",
    title: "Instant Results",
    desc: "Generate in seconds, not days",
  },
  {
    icon: "🎯",
    title: "Identity Preserved",
    desc: "Your face stays 100% authentic",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Images deleted after generation",
  },
  {
    icon: "💎",
    title: "HD Quality",
    desc: "Download-ready for LinkedIn & more",
  },
];

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });

  const exitOpacity = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#181818",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      {/* Subtle background gradient */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            opacity: titleSpring,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#818cf8",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Why Choose Us
          </span>
          <h2
            style={{
              fontSize: 64,
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontWeight: 500,
              color: "#ffffff",
              margin: 0,
            }}
          >
            The Pro Advantage
          </h2>
        </div>

        {/* Feature grid */}
        <div
          style={{
            display: "flex",
            gap: 40,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1200,
          }}
        >
          {features.map((feature, idx) => {
            const delay = 15 + idx * 12;
            const fSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12 },
            });

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  width: 240,
                  padding: "40px 30px",
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  opacity: fSpring,
                  transform: `scale(${interpolate(fSpring, [0, 1], [0.85, 1])})`,
                }}
              >
                <span style={{ fontSize: 48 }}>{feature.icon}</span>
                <h3
                  style={{
                    fontSize: 22,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    color: "#ffffff",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    color: "#71717a",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
