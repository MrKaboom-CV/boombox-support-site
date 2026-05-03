import { fileURLToPath } from "url";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import config from "./src/config/config.json";
import { social as socialLinks } from "./src/config/social.json";
import locals from "./src/config/locals.json";
import sidebar from "./src/config/sidebar.json";

const { site } = config;
const { title, logo, logo_darkmode } = site;

export const locales = locals;

export default defineConfig({
  site: "https://boomboxcv.com",
  trailingSlash: 'always',

  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },

  integrations: [
    starlight({
      title,
      logo: {
        light: logo,
        dark: logo_darkmode,
        alt: "BooMBox Logo",
      },
      sitemap: false, // The "Safety Catch" to prevent the sitemap from running.
      social: socialLinks,
      locales: {
        root: { label: 'English', lang: 'en' },
      },
      sidebar: sidebar.main || [],
      customCss: ["./src/styles/global.css"],
      components: {
        Head: "./src/components/override-components/Head.astro",
      },
    }),
  ],

  output: "static",

  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});