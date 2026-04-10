import { useGLSupport } from '../hook/useGLSupport';
import { ScenePrimary } from '../component/gl';
import { HexBackgroundFallback } from '../component/fallback/HexBackgroundFallback';
import { useAppStore } from '../store/useAppStore';

export const PortfolioContainer = () => {
  useGLSupport();
  const glSupported = useAppStore((s) => s.glSupported);
  return glSupported ? <ScenePrimary /> : <HexBackgroundFallback />;
};
