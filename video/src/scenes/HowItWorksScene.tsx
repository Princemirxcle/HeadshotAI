import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

const steps = [
  {
    number: "01",
    title: "Upload Selfie",
    desc: "Take a casual photo in good lighting",
    icon: "📸",
  },
  {
    number: "02",
    title: "Select Style",
    desc: "Corporate, Studio, Creative, or Custom",
    icon: "✨",
  },
  {
    number: "03",
    title: "Download HD",
    desc: "Get professional headshots instantly",
    icon: "⬇️",
  },
];

export const HowItWorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section title
  const titleSpring = spring({ frame, fps, config: { damping: 14 } });

  // Exit
  const exitOpacity = interpolate(frame, [140, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#222222",
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
        {/* Section header */}
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
            Simple Process
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
            Create in 3 Steps
          </h2>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            gap: 40,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {steps.map((step, idx) => {
            const delay = 25 + idx * 20;
            const stepSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12 },
            });
            const stepY = interpolate(stepSpring, [0, 1], [80, 0]);

            // Connector line animation
            const lineWidth = interpolate(
              frame,
              [delay + 15, delay + 35],
              [0, 100],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <React.Fragment key={idx}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                    flex: 1,
                    opacity: stepSpring,
                    transform: `translateY(${stepY}px)`,
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      backgroundColor: "rgba(99,102,241,0.1)",
                      border: "2px solid rgba(99,102,241,0.3)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 44,
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Step number */}
                  <span
                    style={{
                      fontSize: 60,
                      fontFamily: "Georgia, 'Playfair Display', serif",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.06)",
                    }}
                  >
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: 30,
                      fontFamily: "Georgia, 'Playfair Display', serif",
                      fontWeight: 500,
                      color: "#ffffff",
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 18,
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 300,
                      color: "#a1a1aa",
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>

                {/* Connector arrow */}
                {idx < steps.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 40,
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 2,
                        background: `linear-gradient(90deg, #818cf8 ${lineWidth}%, transparent ${lineWidth}%)`,
                        borderRadius: 1,
                      }}
                    />
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                        borderLeft: "10px solid #818cf8",
                        opacity: lineWidth / 100,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
