import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { loadEnv, type PluginOption } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, type UserConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ["REACT_APP_"]); //TODO: remove after migration, change necessary places to VITE_

  return {
    envPrefix: "REACT_APP_", //TODO: remove after migration, change necessary places to VITE_
    build: {
      outDir: "build", // folder for production build
    },
    plugins: [
      react({
        babel: {
          plugins: [
            [
              "formatjs",
              {
                idInterpolationPattern: "[sha512:contenthash:base64:6]",
                ast: true,
              },
            ],
          ],
        },
      }),
      svgr(), // load SVG's as React components
      tsconfigPaths(), // allows Vite to resolve imports mapped by ts
      legacy(), // loads polyfills using @babel/preset-env and browserslist
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}" --debug',
        },
        overlay: false,
      }),
      (env.ANALYZE &&
        visualizer({
          open: true,
          gzipSize: true,
          filename: "bundle-analysis/stats.html",
        })) as unknown as PluginOption, // shows build bundle graph
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: process.env.DEV_SW === "true",
        },
        manifest,
      }),
    ],
    esbuild: {
      logOverride: { "this-is-undefined-in-esm": "silent" }, // prevents "Top-level this warning" https://github.com/vitejs/vite/issues/8644
    },
    server: {
      port: 3101,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/setupTests.ts"],
    },
  } satisfies UserConfig;
});

const manifest: Partial<VitePWAOptions>["manifest"] = {
  short_name: "Ascend",
  name: "Ascend",
  icons: [
    {
      src: "favicon.ico",
      sizes: "32x32",
      type: "image/x-icon",
    },
    {
      src: "logo192.png",
      type: "image/png",
      sizes: "192x192",
    },
    {
      src: "logo512.png",
      type: "image/png",
      sizes: "512x512",
    },
  ],
  start_url: "/",
  display: "standalone",
  theme_color: "#3E7BFA",
  background_color: "#1B1C28",
};
