import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export const Skybox = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath("/skybox/");
    loader.load(
      [
        "1right.png",
        "2left.png",
        "3top.png",
        "4bottom.png",
        "5front.png",
        "6back.png",
      ],
      (cubeTexture) => {
        cubeTexture.rotation = Math.PI / 2;
        scene.background = cubeTexture;
      },
      undefined,
      () => {
        scene.background = new THREE.Color(0x130b2e);
      },
    );
    return () => {
      scene.background = new THREE.Color(0x130b2e);
    };
  }, [scene]);

  return null;
};
