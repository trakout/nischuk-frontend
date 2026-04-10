import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/**
 * Hook for GSAP-based animations in containers.
 * Ports animation usage from old site (e.g. HexGenerator mouse in/out, delayed tweens).
 * GL/Three.js animations (hex hover, explode) are handled in R3F useFrame; this hook
 * is for DOM/React element animations (overlay entrance, page transitions, etc.).
 */
export const useAnimation = () => {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {});
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  const from = useCallback(
    (target: gsap.TweenTarget, vars: gsap.TweenVars) => gsap.from(target, vars),
    []
  );

  const to = useCallback(
    (target: gsap.TweenTarget, vars: gsap.TweenVars) => gsap.to(target, vars),
    []
  );

  const fromTo = useCallback(
    (target: gsap.TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars) =>
      gsap.fromTo(target, fromVars, toVars),
    []
  );

  const timeline = useCallback((vars?: gsap.TimelineVars) => gsap.timeline(vars), []);

  return {
    gsap,
    from,
    to,
    fromTo,
    timeline,
    context: ctxRef,
  };
};
