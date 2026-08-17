import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// vite-plugin-monkey emits the installable userscript bundle.
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "Bangumi Score",
        namespace: "https://github.com/LJ-works/Bangumi-Score",
        match: ["https://bangumi.tv/calendar"],
      },
    }),
  ],
});
