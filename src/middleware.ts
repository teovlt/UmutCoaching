// Language routing (src/i18n/config.ts): "/en/…" and "/tr/…" are served by
// the same pages as the French ones. The prefix is stripped and the page
// reads the language from Astro.locals.lang, the unprefixed path from
// Astro.locals.path. Admin, API and assets are French-only / untouched.
import { defineMiddleware } from "astro:middleware";
import { splitLocale } from "@/i18n/config";

const UNTRANSLATED = /^\/(admin|api|styleguide|_astro|_image)(\/|$)/;

export const onRequest = defineMiddleware((context, next) => {
  const { lang, path } = splitLocale(context.url.pathname);
  context.locals.lang = lang;
  context.locals.path = path;
  if (lang === "fr") return next();
  // /en/admin and the like do not exist
  if (UNTRANSLATED.test(path)) return next("/404");
  return next(`${path}${context.url.search}`);
});
