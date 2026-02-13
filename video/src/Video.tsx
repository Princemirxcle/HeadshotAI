import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { HowItWorksScene } from "./scenes/HowItWorksScene";
import { StylesScene } from "./scenes/StylesScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { SocialProofScene } from "./scenes/SocialProofScene";
import { CTAScene } from "./scenes/CTAScene";

/**
 * ProHeadshot AI — Promotional Video
 *
 * Timeline (20s @ 30fps = 600 frames):
 *   0–130   Intro (brand reveal + tagline)
 *   120–240 Problem (cost comparison)
 *   230–390 How It Works (3 steps)
 *   380–530 Styles (4 preset cards)
 *   400–520 Features (advantage grid)       — overlaps slightly with styles exit
 *   500–610 Social Proof (counter + quote)   — overlaps slightly
 *   520–600 CTA (final call to action)
 */
export const ProHeadshotVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#222222" }}>
      {/* Scene 1 — Intro */}
      <Sequence from={0} durationInFrames={135}>
        <IntroScene />
      </Sequence>

      {/* Scene 2 — Problem / Cost comparison */}
      <Sequence from={120} durationInFrames={125}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3 — How It Works */}
      <Sequence from={230} durationInFrames={165}>
        <HowItWorksScene />
      </Sequence>

      {/* Scene 4 — Styles showcase */}
      <Sequence from={380} durationInFrames={155}>
        <StylesScene />
      </Sequence>

      {/* Scene 5 — Features / Advantages */}
      <Sequence from={400} durationInFrames={125}>
        <FeaturesScene />
      </Sequence>

      {/* Scene 6 — Social Proof */}
      <Sequence from={500} durationInFrames={115}>
        <SocialProofScene />
      </Sequence>

      {/* Scene 7 — CTA (final) */}
      <Sequence from={510} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
