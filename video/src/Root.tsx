import { Composition } from "remotion";
import { ProHeadshotVideo } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ProHeadshotVideo"
      component={ProHeadshotVideo}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
