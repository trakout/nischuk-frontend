import { useMemo, useState, useCallback, useEffect } from "react";
import { css } from "@linaria/core";
import { trackEvent } from "@/service/analyticsService";

import IconEmail from "@asset/social/email.svg?react";
import IconGithub from "@asset/social/github.svg?react";
import IconTwitter from "@asset/social/twitter.svg?react";
import IconLinkedin from "@asset/social/linkedin.svg?react";

// Colors from old-site src/style/var.styl
const BLACK = "#122430";
const OFF_BLACK = "#273E45";
const WHITE = "#FFFCE2";
const OFF_WHITE = "#EBD2B5";
const RED = "#E63531";

const OFFSET = { x: 75, y: 29 };

const gridContainer = css`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: ${WHITE};
  overflow: hidden;
`;

const grid = css`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const single = css`
  position: absolute;
  width: 60px;
  height: 52px;
`;

const iconPlaceholder = css`
  color: ${OFF_WHITE};
  pointer-events: none;
  position: absolute;
  font-size: 12px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const icon = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  height: 22px;
  width: 22px;

  &.email {
    margin-left: -3px;
    margin-top: -1px;
  }
  &.linkedin {
    height: 21px;
    width: 21px;
    margin-left: -4px;
    margin-top: -3px;
  }
  &.twitter {
    height: 22px;
    width: 22px;
    margin-left: -3px;
    margin-top: -2px;
  }
  &.github {
    height: 22px;
    width: 22px;
    margin-left: -4px;
    margin-top: -2px;
  }
`;

const blockLink = css`
  position: relative;
  display: block;

  path,
  polygon {
    transition: fill 0.2s ease-in-out 6s;
  }

  .${iconPlaceholder} {
    transition: color 0.2s ease-in-out 6s;
  }

  &:hover {
    path,
    polygon {
      transition-delay: 0s;
      fill: ${BLACK} !important;
    }

    .${iconPlaceholder} {
      transition-delay: 0s;
      color: ${BLACK};
    }
  }
`;

// HexSingle styles (from HexSingle.styl)
const hexSvg = css`
  transform: translateZ(0);

  path {
    transition:
      fill 0.2s ease-in-out 0.35s,
      opacity 0.2s ease-in-out 6s;
    stroke-width: 1px;
    fill: ${OFF_BLACK};
    stroke: ${BLACK};
    pointer-events: none;
  }

  path.side {
    opacity: 0;
  }

  &.active:hover path,
  &:hover path {
    transition-delay: 0s;
    opacity: 0.5;
    fill: ${RED};
  }

  &.active:hover path.side,
  &:hover path.side {
    opacity: 0.4;
    animation: pulse 2s infinite;
  }

  &.active path {
    fill: ${OFF_WHITE};
  }

  &.active path.top {
    opacity: 0.5;
  }

  &.active path.side {
    opacity: 0.3;
  }

  &.back path.top {
    opacity: 1;
    animation: opac-top 6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  &.back path.side {
    opacity: 0;
    animation: opac-side 6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  &.button {
    cursor: pointer;
  }

  &.button path {
    fill: ${RED} !important;
    animation: none !important;
  }
`;

const gridFadeAppearActive = css``;

const gridFadeAppear = css`
  opacity: 0;
  transform: translateY(10px) translateZ(10px) rotateX(-50deg);

  &.${gridFadeAppearActive} {
    transition: all 0.5s ease-in 1s;
    perspective: 250px;
    opacity: 1;
    transform: translateY(0) translateZ(0) rotateX(0deg);
  }
`;

// Keyframes from HexSingle.styl (Linaria uses keyframes in global or same file)
const globalStyles = css`
  :global() {
    @keyframes pulse {
      50% {
        opacity: 0.6;
      }
    }

    @keyframes opac-top {
      0% {
        fill: ${OFF_WHITE};
        opacity: 0.5;
      }
      90% {
        fill: ${OFF_WHITE};
        opacity: 0.5;
      }
      100% {
        fill: ${OFF_BLACK};
        opacity: 1;
      }
    }

    @keyframes opac-side {
      0% {
        fill: ${OFF_WHITE};
        opacity: 0.3;
      }
      90% {
        fill: ${OFF_WHITE};
        opacity: 0.3;
      }
      100% {
        fill: ${OFF_BLACK};
        opacity: 0;
      }
    }
  }
`;

interface HexCell {
  key: string;
  style: { top: string; left: string };
  button?: boolean;
  href?: string;
  type?: "twitter" | "linkedin" | "email" | "github";
}

function getGridSizes(windowX: number, windowY: number) {
  const rowCount = Math.ceil((windowX * 1.2) / OFFSET.x);
  const colCount = Math.ceil((windowY * 1.4) / OFFSET.y + 1);
  return {
    rowCount,
    colCount,
    widthPx: rowCount * 75,
    heightPx: colCount * 21.75,
  };
}

function generateHexGrid(windowX: number, windowY: number): HexCell[] {
  const { rowCount, colCount } = getGridSizes(windowX, windowY);
  const middle = {
    x: Math.floor(rowCount / 2),
    y: Math.floor(colCount / 2) + 5,
  };
  if (windowX <= 360) {
    middle.x--;
  }

  const cells: HexCell[] = [];
  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      const isLinkedin = col === middle.y + 2 && row === middle.x;
      const isEmail = col === middle.y && row === middle.x - 1;
      const isGithub = col === middle.y - 2 && row === middle.x + 1;
      const isTwitter = col === middle.y + 4 && row === middle.x - 1;
      const button = isLinkedin || isEmail || isGithub || isTwitter;

      const cell: HexCell = {
        key: `k${col}k${row}`,
        style: {
          top: `${OFFSET.y * col * 0.75}px`,
          left: `${(row + (col % 2 ? 0.5 : 0)) * OFFSET.x}px`,
        },
      };

      if (button) {
        cell.button = true;
        if (isLinkedin) {
          cell.href = "https://www.linkedin.com/in/nischuk/";
          cell.type = "linkedin";
        }
        if (isEmail) {
          cell.href = "mailto:trakout@gmail.com";
          cell.type = "email";
        }
        if (isGithub) {
          cell.href = "https://github.com/trakout";
          cell.type = "github";
        }
        if (isTwitter) {
          cell.href = "https://twitter.com/trakout";
          cell.type = "twitter";
        }
      }

      cells.push(cell);
    }
  }
  return cells;
}

// SVG hex paths from old-site HexSingle.js
const HexSingleSvg = ({
  isButton,
  hexClass,
  onMouseEnter,
  onMouseLeave,
}: {
  isButton: boolean;
  hexClass: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => (
  <svg
    version="1.1"
    baseProfile="full"
    width="60"
    height="52"
    className={`${hexSvg} ${hexClass}${isButton ? " button" : ""}`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        className="side side-one"
        d="M 39.062,3.842 47.697,9.069 22.969,9.069 14.334,3.842 z"
      />
      <path
        className="side side-two"
        d="M 39.062,3.842 47.697,9.069 59.666,30.693 51.031,25.467 z"
      />
      <path
        className="side side-three"
        d="M 51.031,25.467 59.666,30.693 46.908,52.318 38.273,47.092 z"
      />
      <path
        className="side side-four"
        d="M 38.273,47.092 46.908,52.318 22.18,52.318 13.544,47.092 z"
      />
      <path
        className="side side-five"
        d="M 1.575,25.467 10.21,30.693 22.18,52.318 13.544,47.092 z"
      />
      <path
        className="side side-six"
        d="M 14.334,3.842 22.969,9.069 10.21,30.693 1.575,25.467 z"
      />
      <path
        className="top"
        d="M39.209,3.6L14.196,3.6,1.292,25.467,13.398,47.343,38.411,47.343,51.315,25.466z"
      />
    </g>
  </svg>
);

function HexCellContent({ cell }: { cell: HexCell }) {
  const [hexClass, setHexClass] = useState("hex");

  const handleMouseEnter = useCallback(
    () => setHexClass("hex active visible"),
    [],
  );
  const handleMouseLeave = useCallback(
    () => setHexClass("hex back visible"),
    [],
  );

  const hex = (
    <HexSingleSvg
      isButton={!!cell.button}
      hexClass={hexClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );

  if (cell.button && cell.href && cell.type) {
    return (
      <a
        href={cell.href}
        target="_blank"
        rel="noopener noreferrer"
        className={blockLink}
        aria-label={cell.type}
        onClick={() => trackEvent("Click", "Outbound Click", cell.type)}
      >
        {hex}
        <span className={iconPlaceholder} aria-hidden>
          {cell.type === "linkedin" && (
            <IconLinkedin className={`${icon} linkedin`} aria-hidden />
          )}
          {cell.type === "twitter" && (
            <IconTwitter className={`${icon} twitter`} aria-hidden />
          )}
          {cell.type === "email" && (
            <IconEmail className={`${icon} email`} aria-hidden />
          )}
          {cell.type === "github" && (
            <IconGithub className={`${icon} github`} aria-hidden />
          )}
        </span>
      </a>
    );
  }

  return hex;
}

export const HexBackgroundFallback = () => {
  const [windowSize, setWindowSize] = useState(() =>
    typeof window !== "undefined"
      ? { x: window.innerWidth, y: window.innerHeight }
      : { x: 1024, y: 768 },
  );

  useEffect(() => {
    const onResize = () =>
      setWindowSize({ x: window.innerWidth, y: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const gridSize = useMemo(
    () => getGridSizes(windowSize.x, windowSize.y),
    [windowSize.x, windowSize.y],
  );

  const cells = useMemo(
    () => generateHexGrid(windowSize.x, windowSize.y),
    [windowSize.x, windowSize.y],
  );

  const gridStyle = useMemo(
    () => ({
      width: `${gridSize.widthPx}px`,
      height: `${gridSize.heightPx}px`,
    }),
    [gridSize.widthPx, gridSize.heightPx],
  );

  return (
    <>
      <div className={globalStyles} aria-hidden />
      <div
        className={`${gridContainer} ${gridFadeAppear} ${gridFadeAppearActive}`}
      >
        <div className={grid} style={gridStyle}>
          {cells.map((cell) => (
            <div key={cell.key} style={cell.style} className={single}>
              <HexCellContent cell={cell} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
