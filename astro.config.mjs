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

// Helper function to remove the default sitemap integration from Starlight
const removeSitemap = (integrations) => {
  const sitemapIndex = integrations.findIndex(i => i.name === '@astrojs/sitemap');
  if (sitemapIndex > -1) integrations.splice(sitemapIndex, 1);
  return integrations;
}

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
    { name: 'sitemap-remover', hooks: { 'astro:config:setup': ({ updateConfig }) => updateConfig({ integrations: removeSitemap([]) }) } },
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