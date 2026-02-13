import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

const styles = [
  {
    label: "Studio Headshot",
    desc: "Clean dark background, soft studio lighting",
    color: "#818cf8",
  },
  {
    label: "Corporate Office",
    desc: "Modern office setting, business suit",
    color: "#6366f1",
  },
  {
    label: "Tech Founder",
    desc: "Bright, airy background, smart casual",
    color: "#a5b4fc",
  },
  {
    label: "Creative B&W",
    desc: "High contrast, dramatic monochrome",
    color: "#c7d2fe",
  },
];

export const StylesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });

  const exitOpacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
          width: "100%",
          maxWidth: 1400,
          padding: "0 80px",
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
            transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
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
            Choose Your Look
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
            4 Pro Styles
          </h2>
        </div>

        {/* Style cards */}
        <div
          style={{
            display: "flex",
            gap: 30,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {styles.map((style, idx) => {
            const delay = 20 + idx * 15;
            const cardSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12 },
            });
            const cardY = interpolate(cardSpring, [0, 1], [60, 0]);

            // Shimmer effect across the card
            const shimmerX = interpolate(
              frame,
              [delay + 30, delay + 60],
              [-100, 400],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  padding: 36,
                  borderRadius: 20,
                  backgroundColor: "rgba(30,30,30,0.8)",
                  border: `1px solid rgba(255,255,255,0.08)`,
                  opacity: cardSpring,
                  transform: `translateY(${cardY}px)`,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Shimmer overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: shimmerX,
                    width: 100,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                    pointerEvents: "none",
                  }}
                />

                {/* Color accent bar */}
                <div
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: style.color,
                  }}
                />

                {/* Label */}
                <h3
                  style={{
                    fontSize: 26,
                    fontFamily: "Georgia, 'Playfair Display', serif",
                    fontWeight: 500,
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {style.label}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 16,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    color: "#a1a1aa",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {style.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
