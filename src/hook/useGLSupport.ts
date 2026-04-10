import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useGLSupport = () => {
  const setGLSupported = useAppStore((state) => state.setGLSupported);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    setGLSupported(!!gl);
  }, [setGLSupported]);
};
