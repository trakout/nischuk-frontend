import { create } from 'zustand';

interface AppState {
  glSupported: boolean;
  setGLSupported: (value: boolean) => void;
}

// Default false to avoid flash of GL canvas on non-GL devices; useGLSupport sets true when WebGL/WebGPU is available.
export const useAppStore = create<AppState>((set) => ({
  glSupported: false,
  setGLSupported: (value) => set({ glSupported: value }),
}));
