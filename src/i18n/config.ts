// Languages of the public site (docs/05-decisions.md D15, D25). French is the
// default and lives at the root ("/methode"); the others get a prefix
// ("/en/methode", "/tr/methode"). Same slugs in every language.

export const locales = ["fr", "en", "tr"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "fr";

export const languages: Record<Lang, { name: string; short: string; htmlLang: string; ogLocale: string; intl: string }> = {
  fr: { name: "Français", short: "FR", htmlLang: "fr", ogLocale: "fr_FR", intl: "fr-FR" },
  en: { name: "English", short: "EN", htmlLang: "en", ogLocale: "en_GB", intl: "en-GB" },
  tr: { name: "Türkçe", short: "TR", htmlLang: "tr", ogLocale: "tr_TR", intl: "tr-TR" },
};

export const isLang = (value: string | undefined): value is Lang => (locales as readonly string[]).includes(value ?? "");

/** "/methode" in `lang`: "/methode", "/en/methode", "/tr" for the home page */
export const localePath = (lang: Lang, path: string): string => {
  if (lang === defaultLang) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
};

/** "/en/methode" → { lang: "en", path: "/methode" } */
export const splitLocale = (pathname: string): { lang: Lang; path: string } => {
  const [, first, ...rest] = pathname.split("/");
  if (first && first !== defaultLang && isLang(first)) {
    return { lang: first, path: `/${rest.join("/")}`.replace(/\/$/, "") || "/" };
  }
  return { lang: defaultLang, path: pathname.replace(/\/$/, "") || "/" };
};
