import { useMemo, useCallback, useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
// import gsap from "gsap";
// import { getShaders } from "@/service/glService";
import { trackEvent } from "@/service/analyticsService";

// const hexShaders = getShaders();

const COLOR_RED = "#e63531";
const COLOR_OFFBLACK = "#273E45";
const COLOR_BLACK = "#122430";

interface HexData {
  x: number;
  y: number;
  button?: boolean;
  type?: "twitter" | "linkedin" | "email" | "github";
}

interface HexGridProps {
  /**
   * 2D array pattern defining hex positions
   * - falsy ('', null, undefined, false): empty space
   * - 'x' or other truthy string: regular hex
   * - 'twitter' | 'linkedin' | 'email' | 'github': social button hex
   */
  pattern: (string | boolean | null | undefined)[][];
  /** Euler rotation [x, y, z] applied to the grid group */
  rotation?: [number, number, number];
  /**
   * Position offset [x, y, z] from the calculated anchor point.
   * When positionType is 'center': offset from viewport center.
   * When positionType is 'bottomLeft'/'bottomRight': offset from that corner.
   * The z value is the distance from camera.
   */
  centerPosition: [number, number, number];
  /** Optional scale factor for the entire grid (default: 1) */
  scale?: number;
  /**
   * How to position the grid relative to the viewport.
   * - 'center': Center of viewport (default)
   * - 'bottomLeft': Bottom-left corner of viewport
   * - 'bottomRight': Bottom-right corner of viewport
   */
  positionType?: "center" | "bottomLeft" | "bottomRight";
}

const HexGeometry = () => {
  const sizeMultiplier = 2;
  return useMemo(
    () =>
      new THREE.CylinderGeometry(
        1 * sizeMultiplier,
        1 * sizeMultiplier,
        0.5,
        6,
      ),
    [],
  );
};

const HexMesh = ({ hexData }: { hexData: HexData }) => {
  const geometry = HexGeometry();
  const sizeMultiplier = 2;
  const mainMeshRef = useRef<THREE.Mesh>(null);
  const outlineMeshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // Original ShaderMaterial (commented out for positioning visibility)
  // const material = useMemo(
  //   () =>
  //     new THREE.ShaderMaterial({
  //       vertexShader: hexShaders.vertex,
  //       fragmentShader: hexShaders.fragment,
  //       uniforms: {
  //         color: {
  //           value: new THREE.Color(hexData.button ? COLOR_RED : COLOR_OFFBLACK),
  //         },
  //         opacity: { value: 1.0 },
  //         hover: { value: 0.0 },
  //         explode: { value: 0.0 },
  //       },
  //       transparent: true,
  //       side: THREE.DoubleSide,
  //     }),
  //   [hexData.button],
  // );

  // Temporary MeshStandardMaterial for positioning visibility (responds to lights)
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: hexData.button ? COLOR_RED : COLOR_OFFBLACK,
        roughness: 0.5,
        metalness: 0.1,
      }),
    [hexData.button],
  );

  // Animation disabled for positioning focus
  // useEffect(() => {
  //   const tween = gsap.to(material.uniforms.explode, {
  //     value: 4,
  //     duration: 2,
  //     delay: 2,
  //     ease: "power2.out",
  //   });
  //   return () => {
  //     tween.kill();
  //   };
  // }, [material]);

  const handlePointerOver = useCallback(() => {
    // gsap.killTweensOf(material.uniforms.hover);
    // gsap.to(material.uniforms.hover, {
    //   value: 0.5,
    //   duration: 0.2,
    //   ease: "power2.out",
    // });
    document.body.style.cursor = hexData.button ? "pointer" : "auto";
  }, [hexData.button]);

  const handlePointerOut = useCallback(() => {
    // gsap.killTweensOf(material.uniforms.hover);
    // gsap.to(material.uniforms.hover, {
    //   value: 0,
    //   duration: 0.2,
    //   ease: "power2.out",
    // });
    document.body.style.cursor = "auto";
  }, []);

  const handleClick = useCallback(() => {
    if (hexData.button && hexData.type) {
      trackEvent("Click", "Outbound Click", hexData.type);
      const links: Record<string, string> = {
        twitter: "https://twitter.com/trakout",
        linkedin: "https://www.linkedin.com/in/nischuk/",
        email: "mailto:trakout@gmail.com",
        github: "https://github.com/trakout",
      };
      window.location.href = links[hexData.type!];
    }
  }, [hexData.button, hexData.type]);

  // Outline mesh matching old HexGenerator implementation
  // Uses full CylinderGeometry (not EdgesGeometry) with BackSide material
  const outlineGeometry = HexGeometry();
  const outlineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: COLOR_BLACK,
        side: THREE.BackSide,
      }),
    [],
  );

  const hexPosition: [number, number, number] = [
    hexData.x * sizeMultiplier,
    hexData.y * sizeMultiplier,
    0,
  ];

  // Soft billboard effect - hexes rotate toward camera with damping
  // Lower damping = more pronounced effect (faster rotation), higher = more subtle
  const DAMPING = 0.05;

  useFrame(() => {
    if (!mainMeshRef.current || !outlineMeshRef.current) return;

    // Get camera's world-space forward direction and negate it ("behind" the camera).
    // Using the world direction in camera-local space intentionally creates the
    // inverse rotation effect as the camera orbits.
    const cameraForward = new THREE.Vector3();
    camera.getWorldDirection(cameraForward);

    const lookTarget = mainMeshRef.current.position
      .clone()
      .addScaledVector(cameraForward, 200);

    const dummy = new THREE.Object3D();
    dummy.position.copy(mainMeshRef.current.position);
    dummy.lookAt(lookTarget);

    // Negate the X rotation from lookAt to invert the tilt direction
    const euler = new THREE.Euler().setFromQuaternion(dummy.quaternion);
    euler.y = -euler.y;
    euler.x = -euler.x;
    dummy.quaternion.setFromEuler(euler);

    dummy.rotateX(-Math.PI / 2); // Adjust for flat face
    dummy.rotateY(Math.PI / -2); // Orient hex points correctly (flat top/bottom)
    dummy.updateMatrix();

    const targetQuaternion = new THREE.Quaternion();
    targetQuaternion.setFromRotationMatrix(dummy.matrix);

    // Slerp main mesh toward target (soft interpolation)
    mainMeshRef.current.quaternion.slerp(targetQuaternion, DAMPING);

    // Apply same rotation to outline
    outlineMeshRef.current.quaternion.copy(mainMeshRef.current.quaternion);
  });

  return (
    <group>
      {/* Main hex mesh */}
      <mesh
        ref={mainMeshRef}
        position={hexPosition}
        geometry={geometry}
        material={material}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      {/* Outline mesh - sibling at same position, scaled 1.06 */}
      <mesh
        ref={outlineMeshRef}
        position={hexPosition}
        geometry={outlineGeometry}
        material={outlineMaterial}
        scale={1.06}
      />
    </group>
  );
};

const SOCIAL_TYPES = ["twitter", "linkedin", "email", "github"] as const;
type SocialType = (typeof SOCIAL_TYPES)[number];

/**
 * Generate hex positions from a pattern array with staggered offset
 * Pattern cells can be:
 *   - falsy ('', null, undefined, false): empty space
 *   - 'x' or other truthy string: regular hex
 *   - 'twitter' | 'linkedin' | 'email' | 'github': social button hex
 */
function generateHexPositionsFromPattern(
  pattern: (string | boolean | null | undefined)[][],
): HexData[] {
  const positions: HexData[] = [];

  // Generate positions from pattern
  // pattern[row][col] where row is outer array index, col is inner
  pattern.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      // Skip empty cells (falsy values)
      if (!cell) return;

      // Calculate hex position with staggered offset for odd rows
      // x: columns go horizontally, y: rows go vertically (negated so row 0 is at top)
      const x = (colIndex + (rowIndex % 2 ? 0.5 : 0)) * 3.1;
      const y = -rowIndex * 0.45 * 2;

      const hex: HexData = { x, y };

      // Check if cell value is a social type
      const cellStr = String(cell).toLowerCase();
      if (SOCIAL_TYPES.includes(cellStr as SocialType)) {
        hex.type = cellStr as SocialType;
        hex.button = true;
      }

      positions.push(hex);
    });
  });

  return positions;
}

/**
 * HexGrid - Renders a pattern of hexagonal meshes based on a 2D array pattern.
 *
 * The hex pattern is automatically centered at the local group origin, making it
 * easy to position the entire grid by specifying where its center should be.
 *
 * When attached to the camera as a child, the grid will move with the camera like a HUD.
 *
 * @param {HexGridProps} props - Component props
 * @param {Array<Array<string|boolean|null|undefined>>} props.pattern - 2D array defining hex positions.
 *   Each cell can be:
 *   - falsy ('', null, undefined, false): empty space (no hex)
 *   - 'x' or any truthy string: regular hex
 *   - 'twitter' | 'linkedin' | 'email' | 'github': social button hex
 * @param {[number, number, number]} props.centerPosition - Offset from the anchor point [x, y, z].
 *   The z value determines distance from camera. x/y are additional offsets.
 * @param {number} [props.scale=1] - Optional scale factor for the entire grid.
 * @param {'center' | 'bottomLeft' | 'bottomRight'} [props.positionType='center'] - Viewport anchor point.
 *
 * @example
 * // Center of viewport (default)
 * <HexGrid pattern={[['x', 'x']]} centerPosition={[0, 0, -20]} />
 *
 * @example
 * // Bottom-left corner of viewport
 * <HexGrid pattern={[['x', 'x']]} centerPosition={[5, 5, -20]} positionType="bottomLeft" />
 *
 * @example
 * // Bottom-right corner with scale
 * <HexGrid pattern={[['x', 'x']]} centerPosition={[-5, 5, -20]} positionType="bottomRight" scale={0.8} />
 */
export const HexGrid = ({
  pattern,
  centerPosition,
  rotation = [0, 0, 0],
  scale = 1,
  positionType = "center",
}: HexGridProps) => {
  const { camera, viewport } = useThree();
  // Generate positions and center them around local origin
  const centeredHexData = useMemo(() => {
    const positions = generateHexPositionsFromPattern(pattern);

    if (positions.length === 0) return [];

    // Calculate center of the pattern
    const minX = Math.min(...positions.map((p) => p.x));
    const maxX = Math.max(...positions.map((p) => p.x));
    const minY = Math.min(...positions.map((p) => p.y));
    const maxY = Math.max(...positions.map((p) => p.y));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Offset all positions so the center is at [0, 0]
    return positions.map((hex) => ({
      ...hex,
      x: hex.x - centerX,
      y: hex.y - centerY,
    }));
  }, [pattern]);

  if (centeredHexData.length === 0) return null;

  // Calculate position based on viewport and positionType
  // Only works with PerspectiveCamera (has fov), not OrthographicCamera
  const distance = centerPosition[2];
  const vFOV =
    camera instanceof THREE.PerspectiveCamera
      ? (camera.fov * Math.PI) / 180
      : (75 * Math.PI) / 180; // Default fallback
  const viewportHeight = 2 * Math.tan(vFOV / 2) * Math.abs(distance);
  const viewportWidth = viewportHeight * viewport.aspect;

  let basePosition: [number, number, number];
  switch (positionType) {
    case "bottomLeft":
      basePosition = [-viewportWidth / 2, -viewportHeight / 2, distance];
      break;
    case "bottomRight":
      basePosition = [viewportWidth / 2, -viewportHeight / 2, distance];
      break;
    case "center":
    default:
      basePosition = [0, 0, distance];
      break;
  }

  // Add the offset from centerPosition
  const finalPosition: [number, number, number] = [
    basePosition[0] + centerPosition[0],
    basePosition[1] + centerPosition[1],
    basePosition[2],
  ];

  return (
    <group position={finalPosition} scale={scale} rotation={rotation}>
      {/* Temporary lighting for visibility */}
      {/* <ambientLight intensity={0.8} /> */}
      <pointLight
        position={[0, -1, 30]}
        intensity={10}
        distance={20}
        decay={1}
        // color={0x7a65ec}
      />
      <pointLight
        position={[0, -1, 10]}
        intensity={5}
        distance={20}
        decay={1}
        color={0x7a65ec}
      />
      {/* <hemisphereLight
        position={[0, -1, 10]}
        intensity={1}
        color={0x7a65ec}
        groundColor={0x370043}
      /> */}
      {/* Center point marker sphere at local origin */}
      {/* <mesh position={[0, 0, 2]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={0xffff00} />
      </mesh> */}
      {centeredHexData.map((hex, i) => (
        <HexMesh key={`${hex.x}-${hex.y}-${i}`} hexData={hex} />
      ))}
    </group>
  );
};

/**
 * Legacy wall of hexagons based on fixed window size
 */
export const HexGridLegacy = () => {
  const FIXED_WINDOW = { x: 700, y: 394 };

  const getGridSizes = (windowX: number, windowY: number) => {
    const rowCount = Math.ceil((windowX * 1.2) / 75);
    const colCount = Math.ceil((windowY * 1.4) / 29 + 1);
    return { row: rowCount, col: colCount };
  };

  const gridSizes = useMemo(
    () => getGridSizes(FIXED_WINDOW.x, FIXED_WINDOW.y),
    [FIXED_WINDOW.x, FIXED_WINDOW.y],
  );

  const hexData = useMemo(() => {
    const data: HexData[] = [];
    const middle = {
      x: Math.floor(gridSizes.row / 2),
      y: Math.floor(gridSizes.col / 2) + 5,
    };

    for (let col = 0; col < gridSizes.col; col++) {
      for (let row = 0; row < gridSizes.row; row++) {
        const hex: HexData = {
          x: (row + (col % 2 ? 0.5 : 0)) * 3.1,
          y: col * 0.45 * 2,
        };

        const isButton =
          (col === middle.y - 8 && row === middle.x) ||
          (col === middle.y - 10 && row === middle.x - 1) ||
          (col === middle.y - 12 && row === middle.x) ||
          (col === middle.y - 6 && row === middle.x - 1);

        if (isButton) {
          if (col === middle.y - 8 && row === middle.x) hex.type = "linkedin";
          if (col === middle.y - 10 && row === middle.x - 1) hex.type = "email";
          if (col === middle.y - 12 && row === middle.x) hex.type = "github";
          if (col === middle.y - 6 && row === middle.x - 1)
            hex.type = "twitter";
          hex.button = true;
        }

        data.push(hex);
      }
    }
    return data;
  }, [gridSizes.row, gridSizes.col]);

  const groupPosition: [number, number, number] = useMemo(
    () => [-gridSizes.col * 1.7, -gridSizes.row, -18],
    [gridSizes.col, gridSizes.row],
  );

  return (
    <group position={groupPosition}>
      {hexData.map((hex, i) => (
        <HexMesh key={`${hex.x}-${hex.y}-${i}`} hexData={hex} />
      ))}
    </group>
  );
};
