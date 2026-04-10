import type { GLProps } from "@react-three/fiber";
import { WebGLRenderer } from "three";
import { WebGPURenderer } from "three/webgpu";

type GlAsyncFactory = Extract<GLProps, (props: never) => Promise<unknown>>;
export type R3fGlDefaultProps = Parameters<GlAsyncFactory>[0];

/**
 * Canvas `gl` factory: prefer WebGPU via {@link WebGPURenderer}. Three.js switches to a
 * WebGL2 backend inside the same class when WebGPU is unavailable. If that still fails,
 * fall back to a classic {@link WebGLRenderer} (postprocessing-friendly).
 */
export async function createR3fGl(
  props: R3fGlDefaultProps,
): Promise<InstanceType<typeof WebGLRenderer> | InstanceType<typeof WebGPURenderer>> {
  const { canvas, antialias = true, alpha = true } = props;

  const webGpuParams = {
    canvas: canvas as HTMLCanvasElement,
    antialias,
    alpha,
    depth: true,
    stencil: false,
  };

  try {
    const renderer = new WebGPURenderer(webGpuParams);
    await renderer.init();
    return renderer;
  } catch {
    return new WebGLRenderer(props);
  }
}
