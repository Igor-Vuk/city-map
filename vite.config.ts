import react from "@vitejs/plugin-react"
import glsl from "vite-plugin-glsl"
import path from "path"
import { defineConfig } from "vitest/config"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  plugins: [react(), glsl(), visualizer()],
  root: "src/",
  publicDir: "../public/",
  base: "./",
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1600, // remove 500kb warning
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    coverage: {
      reporter: ["text", "html"],
    },
  },
})
