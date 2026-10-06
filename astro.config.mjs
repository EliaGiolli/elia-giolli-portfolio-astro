// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Production origin: canonical URLs, Open Graph, sitemap, robots.txt and the RSS feed
  // are all built from it. Update it to the real Vercel URL after the first deploy.
  site: "https://elia-giolli-portfolio.vercel.app",

  // Prefetches internal links on hover, so navigating between pages feels instant.
  prefetch: true,

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({ filter: (page) => !page.includes("/404") }),
  ],
});
