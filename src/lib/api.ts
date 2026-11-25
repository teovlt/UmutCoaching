// Server-side access to the API's public content. Pages call these at request
// time, so what Umut edits in /admin shows up on the next page load.
//
// If the API is slow or down, every function falls back (empty lists, the
// [À CONFIRMER] defaults of src/data/site.ts) and logs the error: the site
// keeps rendering instead of failing.
import { PLACEHOLDER, type SiteSettings, site, siteTexts } from "@/data/site";
import { defaultLang, type Lang } from "@/i18n/config";
import type { ApiSettings, Faq, Legal, Metric, Programme, Temoignage, Translations } from "./types";

// Internal address of the API: http://api:4000 in Docker, see .env.example
const API_URL = (process.env.API_URL ?? import.meta.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const TIMEOUT_MS = 3000;
// Several components of one page ask for the same data: keep it a few
// seconds so a page load costs one request per resource
const CACHE_MS = 5000;

const cache = new Map<string, { at: number; value: Promise<unknown> }>();

const get = async <T>(path: string): Promise<T> => {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value as Promise<T>;

  const value = fetch(`${API_URL}/api${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) }).then(async (res) => {
    if (res.status === 404) throw new NotFoundError(path);
    if (!res.ok) throw new Error(`API ${path} answered ${res.status}`);
    return (await res.json()) as T;
  });
  cache.set(path, { at: Date.now(), value });
  // A failed request must not stay cached
  value.catch(() => cache.delete(path));
  return value;
};

export class NotFoundError extends Error {}

const withFallback = async <T>(path: string, fallback: T): Promise<T> => {
  try {
    return await get<T>(path);
  } catch (err) {
    if (!(err instanceof NotFoundError))
      console.error(`[api] ${path} unavailable, using fallback:`, err instanceof Error ? err.message : err);
    return fallback;
  }
};

/** A document with its English or Turkish texts laid over the French ones
 *  (empty translated fields keep the French text) */
const localize = <T extends { i18n?: Translations<object> }>(doc: T, lang: Lang): T => {
  if (lang === "fr") return doc;
  const texts = doc.i18n?.[lang] ?? {};
  const filled = Object.fromEntries(
    Object.entries(texts).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim() !== "",
    ),
  );
  return { ...doc, ...filled };
};

export const getProgrammes = async (lang: Lang = defaultLang) =>
  (await withFallback<Programme[]>("/programmes", [])).map((p) => localize(p, lang));

/** One visible programme, or undefined (the page then answers 404) */
export const getProgramme = async (slug: string, lang: Lang = defaultLang) => {
  const programme = await withFallback<Programme | undefined>(`/programmes/slug/${encodeURIComponent(slug)}`, undefined);
  return programme && localize(programme, lang);
};

/** FAQ entries shown on `page` ("accueil", "tarifs", a programme slug…) */
export const getFaqs = async (page?: string, lang: Lang = defaultLang) => {
  const faqs = (await withFallback<Faq[]>("/faqs", [])).map((faq) => localize(faq, lang));
  return page ? faqs.filter((faq) => faq.pages.includes(page)) : faqs;
};

export const getTemoignages = () => withFallback<Temoignage[]>("/temoignages", []);

export type Settings = SiteSettings & Pick<ApiSettings, "metrics" | "about" | "photos" | "pricingTerms" | "legal">;

const emptyImage = { url: "", alt: "" };
const emptyLegal: Legal = { name: "", status: "", siret: "", address: "", vat: "", qualification: "", insurance: "", host: "" };

/** Site details: the API's values, with site.ts placeholders for empty ones */
export const getSettings = async (lang: Lang = defaultLang): Promise<Settings> => {
  const api = await withFallback<Partial<ApiSettings>>("/settings", {});
  const pick = (value: string | undefined, fallback: string) => (value && value.trim() ? value : fallback);
  const texts = siteTexts[lang];
  // English / Turkish texts edited in /admin, else the French ones (but never
  // French default wording on a translated page: the translated default wins)
  const tr = lang === "fr" ? {} : (api.i18n?.[lang] ?? {});
  const nonEmpty = (list: string[] | undefined) => (list ?? []).filter((t) => t.trim() !== "");
  const terms = lang === "fr" ? nonEmpty(api.pricingTerms) : nonEmpty(tr.pricingTerms);
  const metrics = (lang !== "fr" && tr.metrics?.length ? tr.metrics : (api.metrics ?? [])).filter((m: Metric) => m.value.trim() !== "");
  const about = api.about ?? { title: "", text: "", tags: [] };
  return {
    ...site,
    ...texts,
    city: pick(api.city, site.city),
    country: pick(api.country, site.country),
    currency: api.currency ?? site.currency,
    gym: pick(api.gym, site.gym),
    address: pick(api.address, site.address),
    phone: pick(api.phone, site.phone),
    email: pick(api.email, site.email),
    hours: lang === "fr" ? pick(api.hours, site.hours) : pick(tr.hours, texts.hours),
    bookingUrl: pick(api.bookingUrl, site.bookingUrl),
    socials: api.socials?.length ? api.socials : site.socials,
    metrics,
    about: {
      title: lang === "fr" ? about.title : pick(tr.aboutTitle, about.title),
      text: lang === "fr" ? about.text : pick(tr.aboutText, about.text),
      tags: lang !== "fr" && tr.aboutTags?.length ? tr.aboutTags : about.tags,
    },
    photos: { hero: api.photos?.hero ?? emptyImage, about: api.photos?.about ?? emptyImage },
    pricingTerms: terms.length ? terms : texts.pricingTerms,
    // Every legal field Umut has not filled in shows as [À CONFIRMER]
    legal: Object.fromEntries(
      (Object.keys(emptyLegal) as (keyof Legal)[]).map((key) => [key, pick(api.legal?.[key], PLACEHOLDER)]),
    ) as Legal,
  };
};
