"site": {
  "title": "BooMBox",
  "logo": "src/assets/your-new-logo.svg",
  "logo_darkmode": "src/assets/your-new-logo.svg"
}
// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { viewTransitions } from "astro-vtbot/starlight-view-transitions";

import tailwindcss from "@tailwindcss/vite";
import config from "./src/config/config.json";
import social from "./src/config/social.json";
import locals from "./src/config/locals.json";
import sidebar from "./src/config/sidebar.json";

import { fileURLToPath } from "url";

const { site } = config;
const { title, logo, logo_darkmode } = site;

export const locales = locals;

// https://astro.build/config
export default defineConfig({
  // 1. Set the primary domain for SEO and metadata
  site: "https://boomboxcv.com",

  // 2. Vercel and Starlight work best with 'always' or 'ignore' 
  // to prevent 404s on sub-pages.
  trailingSlash: 'always',

 // astro.config.mjs
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
      // @ts-ignore
      social: social.main || [],
      locales,
      sidebar: sidebar.main || [],
      customCss: ["./src/styles/global.css"],
      components: {
        Head: "./src/components/override-components/Head.astro",
        Header: "./src/components/override-components/Header.astro",
        Hero: "./src/components/override-components/Hero.astro",
        PageFrame: "./src/components/override-components/PageFrame.astro",
        PageSidebar: "./src/components/override-components/PageSidebar.astro",
        TwoColumnContent: "./src/components/override-components/TwoColumnContent.astro",
        ContentPanel: "./src/components/override-components/ContentPanel.astro",
        Pagination: "./src/components/override-components/Pagination.astro",
        Sidebar: "./src/components/override-components/Sidebar.astro",
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss(), viewTransitions()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});