import { useRef, useMemo, useLayoutEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import vertGrid from "@/asset/shader/vertGrid.glsl";
import fragGrid from "@/asset/shader/fragGrid.glsl";

function planeGeometryToGrid(geometry: THREE.PlaneGeometry): THREE.PlaneGeometry {
  const segmentsX = geometry.parameters.widthSegments ?? 1;
  const segmentsY = geometry.parameters.heightSegments ?? 1;
  const indices: number[] = [];
  const maxIndex = (segmentsX + 1) * (segmentsY + 1) - 1;
  for (let i = 0; i < segmentsY + 1; i++) {
    let index11: number;
    let index12 = 0;
    for (let j = 0; j < segmentsX; j++) {
      index11 = (segmentsX + 1) * i + j;
      index12 = index11 + 1;
      const index21 = index11;
      const index22 = index11 + (segmentsX + 1);
      indices.push(index11, index12);
      if (index22 < maxIndex) {
        indices.push(index21, index22);
      }
    }
    if (index12 + segmentsX + 1 <= maxIndex) {
      indices.push(index12, index12 + segmentsX + 1);
    }
  }
  geometry.setIndex(indices);
  return geometry;
}

const planeData = {
  width: 400,
  height: 400,
  segmentsX: 50,
  segmentsY: 50,
  speed: 30,
  waveAmplitude: 64,
  colorSolid: 0x490c4f,
  color: 0x5ebcc6,
};

export const AnimatedGrid = () => {
  const { camera } = useThree();
  const sunWidth = 160;

  useLayoutEffect(() => {
    camera.position.set(0, 7, planeData.height / 2);
  }, [camera]);

  const planeGeom = useMemo(() => {
    const geom = planeGeometryToGrid(
      new THREE.PlaneGeometry(
        planeData.width,
        planeData.height,
        planeData.segmentsX,
        planeData.segmentsY,
      ),
    );
    const moveable: number[] = [];
    for (let i = 0, iLen = geom.attributes.normal.count + 1; i <= iLen; i++) {
      moveable.push(1, 1, 1, 1);
    }
    geom.setAttribute(
      "moveable",
      new THREE.BufferAttribute(new Uint8Array(moveable), 1),
    );
    geom.rotateX(-Math.PI * 0.5);
    return geom;
  }, []);

  const limit = planeData.height / 2;

  const underGrid = useMemo(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(
        planeData.width,
        planeData.height,
        planeData.segmentsX,
        planeData.segmentsY,
      ),
      new THREE.MeshBasicMaterial({ color: planeData.colorSolid }),
    );
    mesh.rotateX(-Math.PI * 0.5);
    mesh.position.y -= 1;
    mesh.frustumCulled = false;
    return mesh;
  }, []);

  const gridUniforms = useMemo(() => {
    type UniformsSet = { [uniform: string]: { value: unknown } };
    const uniformsLib = THREE.UniformsLib as Record<string, UniformsSet>;
    return Object.assign(
      THREE.UniformsUtils.merge([
        uniformsLib["ambient"],
        uniformsLib["lights"],
      ]),
      {
        color: {
          value: new THREE.Color(planeData.color),
        },
        opacity: { value: 0.75 },
        time: { value: 0 },
        amplitude: { value: planeData.waveAmplitude },
        waveLength: { value: Math.PI * 10 },
        tWidth: { value: planeGeom.parameters.width },
        tHeight: { value: planeGeom.parameters.height },
        limits: { value: new THREE.Vector2(-limit, limit) },
        speed: { value: planeData.speed },
      },
    );
  }, [planeGeom, limit]);

  const grid = useMemo(
    () =>
      new THREE.LineSegments(
        planeGeom,
        new THREE.ShaderMaterial({
          uniforms: gridUniforms,
          vertexShader: vertGrid,
          fragmentShader: fragGrid,
          lights: true,
        }),
      ),
    [planeGeom, gridUniforms],
  );

  const gridTimeUniformRef = useRef<{ value: number } | null>(null);

  useLayoutEffect(() => {
    gridTimeUniformRef.current = (grid.material as THREE.ShaderMaterial)
      .uniforms.time as { value: number };
    return () => {
      gridTimeUniformRef.current = null;
    };
  }, [grid]);

  useFrame((state) => {
    const timeUniform = gridTimeUniformRef.current;
    if (timeUniform) timeUniform.value = state.clock.getElapsedTime();
  });

  return (
    <group>
      <pointLight
        position={[0, 30, -2]}
        intensity={0.3}
        distance={600}
        color={0xffffff}
      />
      <hemisphereLight
        position={[0, 60, 0]}
        color={0xf4b949}
        groundColor={0xf65bcb}
        intensity={0.9}
      />
      <mesh position={[0, 80, -(planeData.height / 2) - sunWidth]}>
        <sphereGeometry args={[sunWidth, 32, 32]} />
        <meshPhongMaterial color={0xffffff} />
      </mesh>
      <primitive object={underGrid} />
      <primitive object={grid} />
    </group>
  );
};
