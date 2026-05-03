import { fileURLToPath } from "url";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { viewTransitions } from "astro-vtbot/starlight-view-transitions";
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
      social: socialLinks,
      locales,
      sidebar: sidebar.main || [],
      customCss: ["./src/styles/global.css"],
      components: {
        Head: "./src/components/override-components/Head.astro",
      },
    }),
    {
      name: 'disable-sitemap',
      hooks: {
        'astro:config:setup': (options) => {
          // Disable sitemap generation
          options.config.integrations = options.config.integrations.filter(
            (i) => i.name !== 'astro:sitemap'
          );
        },
      },
    },
  ],

  output: "static",

  vite: {
    plugins: [viewTransitions()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});