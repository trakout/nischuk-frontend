import type { ComponentProps } from "react";
import { Bloom, EffectComposer, GodRays, Vignette } from "@react-three/postprocessing";

/**
 * Bloom + vignette, matching old-site Effect.js (postprocessing BloomEffect + VignetteEffect).
 */
type EffectProps = {
  sun: NonNullable<ComponentProps<typeof GodRays>["sun"]>;
};

export const Effect = ({ sun }: EffectProps) => (
  <EffectComposer multisampling={0}>
    <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
    <GodRays
      sun={sun}
      samples={40}
      density={0.92}
      decay={0.95}
      weight={0.4}
      exposure={0.35}
      blur
    />
    <Vignette eskil={false} offset={0.1} darkness={0.8} />
  </EffectComposer>
);
