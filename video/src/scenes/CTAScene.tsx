import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background pulse
  const pulseScale = interpolate(
    frame % 90,
    [0, 45, 90],
    [1, 1.15, 1],
  );

  // Title
  const titleSpring = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);

  // Button
  const btnSpring = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const btnScale = interpolate(btnSpring, [0, 1], [0.7, 1]);

  // Subtle button glow pulse
  const glowOpacity = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.3, 0.7, 0.3],
  );

  // Bullets
  const bullet1Spring = spring({ frame: frame - 50, fps, config: { damping: 14 } });
  const bullet2Spring = spring({ frame: frame - 58, fps, config: { damping: 14 } });

  // Logo at the end
  const logoSpring = spring({ frame: frame - 70, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#222222",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)",
          transform: `scale(${pulseScale})`,
          top: "50%",
          left: "50%",
          marginTop: -350,
          marginLeft: -350,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          zIndex: 1,
        }}
      >
        {/* Main CTA text */}
        <div
          style={{
            opacity: titleSpring,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 72,
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontWeight: 500,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            Ready to upgrade your
            <br />
            <span style={{ color: "#a5b4fc", fontStyle: "italic" }}>
              professional image?
            </span>
          </h2>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: btnSpring,
            transform: `scale(${btnScale})`,
            position: "relative",
          }}
        >
          {/* Glow behind button */}
          <div
            style={{
              position: "absolute",
              inset: -15,
              borderRadius: 60,
              background: "rgba(99,102,241,0.3)",
              filter: "blur(20px)",
              opacity: glowOpacity,
            }}
          />
          <div
            style={{
              padding: "20px 60px",
              borderRadius: 50,
              backgroundColor: "#ffffff",
              fontSize: 28,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              color: "#111111",
              position: "relative",
            }}
          >
            Get Started for Free
          </div>
        </div>

        {/* Bullets */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: bullet1Spring,
            }}
          >
            <span style={{ color: "#22c55e", fontSize: 20 }}>✓</span>
            <span
              style={{
                fontSize: 18,
                fontFamily: "Inter, sans-serif",
                color: "#71717a",
              }}
            >
              No credit card required
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: bullet2Spring,
            }}
          >
            <span style={{ color: "#22c55e", fontSize: 20 }}>✓</span>
            <span
              style={{
                fontSize: 18,
                fontFamily: "Inter, sans-serif",
                color: "#71717a",
              }}
            >
              100% Satisfaction
            </span>
          </div>
        </div>

        {/* Logo/brand at the end */}
        <div
          style={{
            opacity: logoSpring,
            marginTop: 30,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontFamily: "Georgia, 'Playfair Display', serif",
              fontWeight: 500,
              color: "#52525b",
              letterSpacing: 2,
            }}
          >
            ProHeadshot AI
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
