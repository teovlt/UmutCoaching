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
  city: `${PLACEHOLDER} ville`,
  country: `${PLACEHOLDER} pays`,
  currency: "CHF",
  gym: `${PLACEHOLDER} salle`,
  address: `${PLACEHOLDER} adresse salle`,
  phone: `${PLACEHOLDER} téléphone`,
  email: `${PLACEHOLDER} e-mail`,
  hours: `lun–ven 07:00–21:00 ${PLACEHOLDER}`,
  bookingUrl: "",
  socials: [{ label: "Instagram", url: "" }],
};
