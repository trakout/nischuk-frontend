import { useGLSupport } from "@/hook/useGLSupport";
import { ScenePrimary } from "@/component/gl";
import { HexBackgroundFallback } from "@/component/fallback/HexBackgroundFallback";
import { useAppStore } from "@/store/useAppStore";
import { css } from "@linaria/core";

// Colors from old-site var.styl
const WHITE = "#FFFCE2";
const RED = "#E63531";

function generateGlitchKeyframes(
  steps: number,
  topMin: number,
  topMax: number,
  bottomMin: number,
  bottomMax: number,
): string {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const pct = (i / steps) * 100;
    const top = Math.floor(Math.random() * (topMax - topMin + 1)) + topMin;
    const bottom =
      Math.floor(Math.random() * (bottomMax - bottomMin + 1)) + bottomMin;
    return `${pct}% { clip: rect(${top}px, 500px, ${bottom}px, 0); }`;
  }).join("\n");
}

const homeWrapper = css`
  position: relative;
  width: 100%;
  min-height: 100vh;
`;

const centerOverlay = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: exclusion;
  margin: -100px 0 0 0;

  @media (max-width: 768px) {
    margin: -160px 0 0 0;
  }

  @media (max-height: 568px) {
    margin: -120px 0 0 0;
  }

  @keyframes glitch-anim {
    ${generateGlitchKeyframes(10, 0, 100, 50, 100)}
  }
  @keyframes glitch-anim-two {
    ${generateGlitchKeyframes(20, 0, 100, 4, 100)}
  }

  h1,
  h2 {
    position: relative;
    font-size: 60px;
    color: ${WHITE};
    text-align: center;
    line-height: 0.9em;

    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      background: black;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &::before {
      left: -1px;
      clip: rect(0px, 450px, 66px, 0px);
      text-shadow: -1px 0 blue;
      animation: glitch-anim 5s infinite linear alternate-reverse;
    }

    &::after {
      left: 0;
      clip: rect(0px, 450px, 46px, 0px);
      text-shadow: 1px 0 ${RED};
      animation: glitch-anim-two 2s infinite linear;
    }
  }

  h2 {
    font-size: 26px;
    line-height: 1.2em;
    margin-top: -14px;

    &::before {
      animation: glitch-anim 8s infinite linear alternate-reverse;
    }
    &::after {
      animation: glitch-anim-two 4s infinite linear;
    }
  }
`;

export const HomeContainer = () => {
  useGLSupport();
  const glSupported = useAppStore((s) => s.glSupported);

  return (
    <div className={homeWrapper}>
      {glSupported ? <ScenePrimary /> : <HexBackgroundFallback />}
      <div className={centerOverlay}>
        <h1 data-text="Travis Nischuk">Travis Nischuk</h1>
        <h2 data-text="Full Stack Developer">Full Stack Developer</h2>
      </div>
    </div>
  );
};
