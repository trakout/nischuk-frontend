import React from "react";
import { render } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("three", () => {
  const uniform = (v: number) => ({ value: v });
  function ShaderMaterial(opts?: {
    uniforms?: Record<string, { value: unknown }>;
  }) {
    return {
      uniforms: opts?.uniforms ?? {
        time: uniform(0),
        hover: uniform(0),
        explode: uniform(0),
      },
    };
  }
  return {
    CylinderGeometry: function () {
      return {};
    },
    PlaneGeometry: function () {
      return {};
    },
    ShaderMaterial,
    Color: function () {},
    EdgesGeometry: function () {
      return {};
    },
    MeshBasicMaterial: function () {
      return {};
    },
    CubeTextureLoader: function () {
      return {
        setPath: function () {
          return this;
        },
        load: function (_urls: string[], onLoad?: (t: unknown) => void) {
          onLoad?.({});
        },
      };
    },
    DoubleSide: 2,
    BackSide: 1,
    NoToneMapping: 0,
  };
});

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useThree: () => ({
    scene: {},
    camera: {},
    viewport: { width: 20, height: 20 },
    size: { width: 800, height: 600 },
    gl: {
      toneMapping: 0,
      autoClear: true,
      getDrawingBufferSize: (v: { set: (w: number, h: number) => void }) => v.set(800, 600),
      getSize: (v: { set: (w: number, h: number) => void }) => v.set(800, 600),
      getContext: () => ({ getContextAttributes: () => ({ alpha: true }) }),
      outputColorSpace: "",
    },
  }),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/postprocessing", () => ({
  EffectComposer: () => null,
  Bloom: () => null,
  Vignette: () => null,
}));

vi.mock("../../src/service/analyticsService", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("../../src/service/glService", () => ({
  getShaders: () => ({ vertex: "", fragment: "" }),
}));

vi.mock("@/service/createR3fGl", () => ({
  createR3fGl: vi.fn(async () => ({})),
}));

vi.mock("../../src/component/gl/Skybox", () => ({ Skybox: () => null }));
vi.mock("../../src/component/gl/AnimatedGrid", () => ({ AnimatedGrid: () => null }));
vi.mock("../../src/component/gl/HexGrid", () => ({ HexGrid: () => null }));
vi.mock("../../src/component/gl/Effect", () => ({ Effect: () => null }));

import { ScenePrimary } from "../../src/component/gl/ScenePrimary";

test("renders", () => {
  const { container } = render(<ScenePrimary />);
  expect(container).toMatchSnapshot();
});
