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
};

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
};
