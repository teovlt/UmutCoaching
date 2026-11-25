// Global site details. Every value Umut has not confirmed stays a visible
// `[À CONFIRMER]` placeholder: never replace one with an invented value.
//
// These are the defaults. From Phase 3 on, the same fields are editable from
// /admin and served by the API (`/api/settings`); the pages merge the API's
// values over these, so the site still renders if the API is unreachable.

export const PLACEHOLDER = "[À CONFIRMER]";

export const isPlaceholder = (value: string | undefined | null): boolean =>
  !value || value.includes("À CONFIRMER") || /^\[.*\]$/.test(value.trim());

export type SiteSettings = {
  name: string;
  brand: string;
  descriptor: string;
  tagline: string;
  city: string;
  country: string;
  currency: "CHF" | "EUR";
  gym: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  bookingUrl: string;
  socials: { label: string; url: string }[];
  /** Coaching formats and languages (/a-propos) */
  formats: string;
  languages: string;
  /** Shown under the prices; edited in /admin › Infos du site */
  pricingTerms: string[];
};

import type { Lang } from "@/i18n/config";

export const site: SiteSettings = {
  name: "Umut",
  brand: "umut.",
  descriptor: "coach / bodybuilding / data",
  tagline: "Mesurer. Ajuster. Progresser.",
  // Confirmed by Umut on 23/11/2026 (docs/05-decisions.md); city and gym are
  // still open (Q14)
  city: `${PLACEHOLDER} ville`,
  country: "France",
  currency: "EUR",
  gym: `${PLACEHOLDER} salle`,
  address: `${PLACEHOLDER} adresse salle`,
  phone: "06 31 76 49 99",
  email: "umut.coachsportif@gmail.com",
  hours: "lun–ven 09:00–18:00 · sam 09:00–15:00",
  // No booking tool yet: /reserver uses the contact form (D16)
  bookingUrl: "",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/umut.coachsportif" },
    { label: "TikTok", url: "https://www.tiktok.com/@umut.coachsportif" },
  ],
  // Confirmed on 23/11/2026 (docs/05-decisions.md Q3, Q8)
  formats: "en salle · en ligne",
  languages: "français · turc · anglais",
  // Confirmed on 23/11/2026 (docs/04-contenu.md § Tarifs)
  pricingTerms: [
    "Bilan de départ inclus dans les offres",
    "Annulation gratuite jusqu'à 24 h avant, sinon la séance est due",
    "Paiement en espèces ou par virement",
  ],
};

/** The defaults above that are worded, in each language */
export const siteTexts: Record<Lang, Pick<SiteSettings, "descriptor" | "tagline" | "hours" | "formats" | "languages" | "pricingTerms">> = {
  fr: site,
  en: {
    descriptor: "coach / bodybuilding / data",
    tagline: "Measure. Adjust. Progress.",
    hours: "Mon–Fri 09:00–18:00 · Sat 09:00–15:00",
    formats: "at the gym · online",
    languages: "French · Turkish · English",
    pricingTerms: [
      "Starting assessment included in every offer",
      "Free cancellation up to 24 h before, otherwise the session is due",
      "Payment in cash or by bank transfer",
    ],
  },
  tr: {
    descriptor: "koç / vücut geliştirme / veri",
    tagline: "Ölç. Ayarla. İlerle.",
    hours: "Pzt–Cum 09:00–18:00 · Cmt 09:00–15:00",
    formats: "salonda · online",
    languages: "Fransızca · Türkçe · İngilizce",
    pricingTerms: [
      "Başlangıç değerlendirmesi tüm tekliflere dahil",
      "24 saat öncesine kadar ücretsiz iptal, sonrasında seans ücreti alınır",
      "Nakit veya banka havalesiyle ödeme",
    ],
  },
};
