import { useRef } from "react";
import type { Mesh } from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Skybox } from "./Skybox";
import { AnimatedGrid } from "./AnimatedGrid";
import { Effect } from "./Effect";
import { HexGrid } from "./HexGrid";

const Scene = () => {
  const { camera } = useThree();
  const sunRef = useRef<Mesh>(null!);

  return (
    <>
      <Skybox />
      <AnimatedGrid />
      <primitive object={camera}>
        <HexGrid
          pattern={[
            ["x", "", "", ""],
            ["x", "", "", ""],
            ["x", "x", "", ""],
            ["x", "", "", ""],
            ["x", "x", "", ""],
            ["x", "x", "", ""],
            ["x", "x", "", ""],
            ["x", "x", "", ""],
            ["", "x", "", ""],
          ]}
          rotation={[(Math.PI / 10) * -1, Math.PI / 6, 0]}
          centerPosition={[1.6, 2, -6]}
          positionType="bottomLeft"
          scale={0.25}
        />
        <HexGrid
          pattern={[
            ["", "", "", "x"],
            ["", "", "x", ""],
            ["", "", "x", "x"],
            ["", "", "x", ""],
            ["", "", "x", "x"],
            ["", "x", "x", ""],
            ["", "", "x", "x"],
            ["", "x", "x", ""],
            ["", "", "x", ""],
          ]}
          rotation={[(Math.PI / 10) * -1, (Math.PI / 6) * -1, 0]}
          centerPosition={[-1.6, 2, -6]}
          positionType="bottomRight"
          scale={0.25}
        />
      </primitive>
      <mesh ref={sunRef} position={[0, 80, -360]}>
        <sphereGeometry args={[20, 16, 16]} />
        <meshBasicMaterial color={0xffff00} transparent opacity={0} />
      </mesh>
      <Effect sun={sunRef} />
      <directionalLight position={[0, 7, 100]} intensity={1} />
    </>
  );
};

export const ScenePrimary = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#130b2e",
      }}
    >
      <Canvas
        camera={{ position: [0, 7, 200], fov: 75 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", background: "#130b2e" }}
        gl={{ antialias: true }}
      >
        <Scene />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
