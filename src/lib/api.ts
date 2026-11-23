// Server-side access to the API's public content. Pages call these at request
// time, so what Umut edits in /admin shows up on the next page load.
//
// If the API is slow or down, every function falls back (empty lists, the
// [À CONFIRMER] defaults of src/data/site.ts) and logs the error: the site
// keeps rendering instead of failing.
import { type SiteSettings, site } from "@/data/site";
import type { ApiSettings, Faq, Metric, Programme, Temoignage } from "./types";

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

export const getProgrammes = () => withFallback<Programme[]>("/programmes", []);

/** One visible programme, or undefined (the page then answers 404) */
export const getProgramme = (slug: string) =>
  withFallback<Programme | undefined>(`/programmes/slug/${encodeURIComponent(slug)}`, undefined);

/** FAQ entries shown on `page` ("accueil", "tarifs", a programme slug…) */
export const getFaqs = async (page?: string) => {
  const faqs = await withFallback<Faq[]>("/faqs", []);
  return page ? faqs.filter((faq) => faq.pages.includes(page)) : faqs;
};

export const getTemoignages = () => withFallback<Temoignage[]>("/temoignages", []);

export type Settings = SiteSettings & Pick<ApiSettings, "metrics" | "about" | "photos">;

const emptyImage = { url: "", alt: "" };

/** Site details: the API's values, with site.ts placeholders for empty ones */
export const getSettings = async (): Promise<Settings> => {
  const api = await withFallback<Partial<ApiSettings>>("/settings", {});
  const pick = (value: string | undefined, fallback: string) => (value && value.trim() ? value : fallback);
  return {
    ...site,
    city: pick(api.city, site.city),
    country: pick(api.country, site.country),
    currency: api.currency ?? site.currency,
    gym: pick(api.gym, site.gym),
    address: pick(api.address, site.address),
    phone: pick(api.phone, site.phone),
    email: pick(api.email, site.email),
    hours: pick(api.hours, site.hours),
    bookingUrl: pick(api.bookingUrl, site.bookingUrl),
    socials: api.socials?.length ? api.socials : site.socials,
    metrics: (api.metrics ?? []).filter((m: Metric) => m.value.trim() !== ""),
    about: api.about ?? { title: "", text: "", tags: [] },
    photos: { hero: api.photos?.hero ?? emptyImage, about: api.photos?.about ?? emptyImage },
  };
};

/** "dès 90 € / mois", "sur devis", or the placeholder while no price is set */
export const formatPrice = (p: Pick<Programme, "priceFrom" | "priceUnit" | "priceLabel" | "currency">): string => {
  if (p.priceLabel) return p.priceLabel;
  if (p.priceFrom === undefined || p.priceFrom === null) return "dès [À CONFIRMER]";
  const amount = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(p.priceFrom);
  const symbol = p.currency === "EUR" ? "€" : p.currency;
  return `dès ${amount} ${symbol}${p.priceUnit ? ` ${p.priceUnit}` : ""}`;
};
