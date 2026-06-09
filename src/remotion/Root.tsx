import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";
import { VIDEO } from "./constants";

/**
 * Registers all video compositions. Add new <Composition /> entries here to
 * make them available in the Remotion Studio (`npm run video`).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
