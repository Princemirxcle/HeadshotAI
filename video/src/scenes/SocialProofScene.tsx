import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

export const SocialProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Counter animation (0 to 10000)
  const counterValue = Math.min(
    10000,
    Math.round(
      interpolate(frame, [10, 60], [0, 10000], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  const titleSpring = spring({ frame, fps, config: { damping: 14 } });

  // Stars animation
  const starsSpring = spring({ frame: frame - 40, fps, config: { damping: 12 } });

  // Testimonial
  const quoteSpring = spring({ frame: frame - 55, fps, config: { damping: 14 } });

  const exitOpacity = interpolate(frame, [90, 110], [1, 0], {
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
          gap: 50,
        }}
      >
        {/* Counter */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: titleSpring,
          }}
        >
          <span
            style={{
              fontSize: 120,
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -3,
            }}
          >
            {counterValue.toLocaleString()}+
          </span>
          <span
            style={{
              fontSize: 28,
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              color: "#a1a1aa",
            }}
          >
            Professionals trust ProHeadshot AI
          </span>
        </div>

        {/* Star rating */}
        <div
          style={{
            display: "flex",
            gap: 8,
            opacity: starsSpring,
            transform: `scale(${interpolate(starsSpring, [0, 1], [0.5, 1])})`,
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                fontSize: 36,
                color: "#facc15",
              }}
            >
              ★
            </span>
          ))}
          <span
            style={{
              fontSize: 24,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#d4d4d8",
              marginLeft: 12,
              alignSelf: "center",
            }}
          >
            4.9 / 5
          </span>
        </div>

        {/* Quote */}
        <div
          style={{
            opacity: quoteSpring,
            transform: `translateY(${interpolate(quoteSpring, [0, 1], [20, 0])}px)`,
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 28,
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#d4d4d8",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            "I landed my dream job interview after updating my LinkedIn with a
            ProHeadshot. The quality is indistinguishable from a real studio
            shoot."
          </p>
          <p
            style={{
              fontSize: 18,
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              color: "#71717a",
              marginTop: 20,
            }}
          >
            — Software Engineer, Lagos
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
