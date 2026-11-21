// @ts-check
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Content (prices, photos, FAQ…) comes from the API so Umut can edit it from
// /admin without a redeploy: pages are rendered on the server at request time.
// A page that never changes can opt back into static output with
// `export const prerender = true`.
export default defineConfig({
  site: process.env.SITE_URL ?? "https://umut.example",
  output: "server",
  adapter: node({ mode: "standalone" }),
  trailingSlash: "never",
  integrations: [
    sitemap({
      filter: (page) => !/\/(styleguide|admin)(\/|$)/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
