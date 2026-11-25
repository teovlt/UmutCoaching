/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Language of the page, from its URL prefix (src/middleware.ts) */
    lang: import("./i18n/config").Lang;
    /** Path without the language prefix: "/methode" for "/en/methode" */
    path: string;
  }
}
