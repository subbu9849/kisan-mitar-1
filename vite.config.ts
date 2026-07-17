import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { netlifyFunctionsDevPlugin } from "./vite-dev-api-plugin.mjs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load every var from .env (no prefix filter) and copy it onto process.env
  // so the Netlify function modules — which read process.env.GEMINI_API_KEY,
  // process.env.DATA_GOV_IN_API_KEY, etc. directly, the same way they do
  // once deployed — see them during `npm run dev` too.
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), netlifyFunctionsDevPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Expose both VITE_* (Vite default) and EXPO_PUBLIC_* (Rork's cross-platform
    // public-env convention, written by tools like getOrCreateAuthConfig).
    envPrefix: ["VITE_", "EXPO_PUBLIC_"],
  };
});
