import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Enter
  const enterOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Strike-through on "expensive photographer"
  const strikeWidth = interpolate(frame, [30, 50], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Solution text appears
  const solutionSpring = spring({ frame: frame - 55, fps, config: { damping: 12 } });
  const solutionScale = interpolate(solutionSpring, [0, 1], [0.8, 1]);
  const solutionOpacity = solutionSpring;

  // Animated cost comparison
  const costSpring = spring({ frame: frame - 20, fps, config: { damping: 14 } });

  // Exit
  const exitOpacity = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1c1c1c",
        justifyContent: "center",
        alignItems: "center",
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        {/* Cost comparison */}
        <div
          style={{
            display: "flex",
            gap: 80,
            alignItems: "center",
            opacity: costSpring,
            transform: `translateY(${interpolate(costSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Traditional */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                color: "#71717a",
                textTransform: "uppercase",
                letterSpacing: 3,
              }}
            >
              Traditional
            </span>
            <span
              style={{
                fontSize: 72,
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                color: "#ef4444",
                position: "relative",
              }}
            >
              $300+
              {/* Strike-through line */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  height: 4,
                  width: `${strikeWidth}%`,
                  backgroundColor: "#ef4444",
                  borderRadius: 2,
                }}
              />
            </span>
            <span
              style={{
                fontSize: 16,
                fontFamily: "Inter, sans-serif",
                color: "#52525b",
              }}
            >
              Photographer + Studio
            </span>
          </div>

          {/* VS */}
          <span
            style={{
              fontSize: 28,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              color: "#3f3f46",
            }}
          >
            vs
          </span>

          {/* AI */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                color: "#818cf8",
                textTransform: "uppercase",
                letterSpacing: 3,
              }}
            >
              ProHeadshot AI
            </span>
            <span
              style={{
                fontSize: 72,
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                color: "#22c55e",
              }}
            >
              Free
            </span>
            <span
              style={{
                fontSize: 16,
                fontFamily: "Inter, sans-serif",
                color: "#52525b",
              }}
            >
              AI-Powered • Instant
            </span>
          </div>
        </div>

        {/* Solution tagline */}
        <div
          style={{
            opacity: solutionOpacity,
            transform: `scale(${solutionScale})`,
          }}
        >
          <p
            style={{
              fontSize: 36,
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontWeight: 400,
              color: "#e4e4e7",
              margin: 0,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Skip the expensive photographer.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
