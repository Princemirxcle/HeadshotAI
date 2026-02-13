import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glowing orb pulse
  const orbScale = interpolate(frame, [0, 120], [0.8, 1.2], {
    extrapolateRight: "clamp",
  });
  const orbOpacity = interpolate(frame, [0, 30], [0, 0.4], {
    extrapolateRight: "clamp",
  });

  // Logo badge entrance
  const badgeSpring = spring({ frame: frame - 10, fps, config: { damping: 15 } });

  // Title entrance
  const titleSpring = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOpacity = titleSpring;

  // Tagline entrance
  const taglineSpring = spring({ frame: frame - 45, fps, config: { damping: 14 } });
  const taglineY = interpolate(taglineSpring, [0, 1], [40, 0]);
  const taglineOpacity = taglineSpring;

  // Subtitle entrance
  const subtitleSpring = spring({ frame: frame - 60, fps, config: { damping: 14 } });
  const subtitleOpacity = subtitleSpring;

  // Exit fade
  const exitOpacity = interpolate(frame, [110, 130], [1, 0], {
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
      {/* Background glow orb */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0) 70%)",
          transform: `scale(${orbScale})`,
          opacity: orbOpacity,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          zIndex: 1,
        }}
      >
        {/* Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 20px",
            borderRadius: 50,
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            transform: `scale(${badgeSpring})`,
            opacity: badgeSpring,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 12px rgba(34,197,94,0.6)",
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#d4d4d8",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            AI Model v2.5 Online
          </span>
        </div>

        {/* App Name */}
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
        >
          <h1
            style={{
              fontSize: 110,
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontWeight: 500,
              color: "#ffffff",
              margin: 0,
              letterSpacing: -2,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            Pro
            <span style={{ color: "#818cf8" }}>Headshot</span> AI
          </h1>
        </div>

        {/* Tagline */}
        <div
          style={{
            transform: `translateY(${taglineY}px)`,
            opacity: taglineOpacity,
          }}
        >
          <p
            style={{
              fontSize: 44,
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#a5b4fc",
              margin: 0,
              textAlign: "center",
            }}
          >
            Headshots that mean business.
          </p>
        </div>

        {/* Subtitle */}
        <div style={{ opacity: subtitleOpacity }}>
          <p
            style={{
              fontSize: 24,
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              color: "#a1a1aa",
              margin: 0,
              textAlign: "center",
              maxWidth: 700,
            }}
          >
            Studio-quality professional headshots in seconds.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
