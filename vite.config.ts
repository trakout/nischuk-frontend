/// <reference types="vitest/config" />

import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { glslify } from "vite-plugin-glslify";
import svgr from "vite-plugin-svgr";
import wyw from "@wyw-in-js/vite";

export default defineConfig({
  plugins: [
    wyw({ ssrDevCss: true, include: /\.(tsx|ts)$/ }),
    react(),
    svgr(),
    ...glslify(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@asset": path.resolve(__dirname, "src/asset"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/test/setup.ts",
  },
});
