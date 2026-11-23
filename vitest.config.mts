// Test settings. The only thing needed: teach the test runner that "@/..."
// means "src/...", the same shortcut the app uses in its imports.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
