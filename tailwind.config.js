import themePlugin from "./src/tailwind-plugin/tw-theme.js";
import gridPlugin from "./src/tailwind-plugin/tw-bs-grid.js";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [themePlugin, gridPlugin],
};
