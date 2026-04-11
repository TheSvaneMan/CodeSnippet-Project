import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve("./app"),
    },
  },
  plugins: [remix()],
  ssr: {
    // 1. Treat web-push as external to keep it out of the Vite transformation
    external: ["web-push"],
    // 2. Continue bundling Material components
    noExternal: [/^@material\/web.*/, /^lit.*/, /^@lit.*/],
  },
});
