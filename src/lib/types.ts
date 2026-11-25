// Shapes returned by the API (server/src/models). Keep in sync with the
// Mongoose schemas.

import type { Lang } from "@/i18n/config";

export type Image = { url: string; alt: string };

/** English and Turkish versions of a document's texts, edited in /admin;
 *  an empty field falls back to the French one */
export type Translations<T> = Partial<Record<Exclude<Lang, "fr">, Partial<T>>>;

type ProgrammeTexts = Pick<Programme, "title" | "summary" | "audience" | "duration" | "priceUnit" | "priceLabel" | "includes" | "steps">;

export type ProgrammeFormat = "salle" | "en-ligne" | "hybride";
export type ProgrammeStatus = "new" | "available" | "few" | "full" | "";

export type Programme = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  audience: string;
  format: ProgrammeFormat;
  duration: string;
  priceFrom?: number;
  priceUnit: string;
  priceLabel: string;
  currency: "CHF" | "EUR";
  includes: string[];
  steps: { label: string; text: string }[];
  featured: boolean;
  status: ProgrammeStatus;
  image: Image;
  visible: boolean;
  order: number;
  i18n?: Translations<ProgrammeTexts>;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  pages: string[];
  order: number;
  i18n?: Translations<Pick<Faq, "question" | "answer">>;
};

export type Temoignage = {
  id: string;
  name: string;
  context: string;
  quote: string;
  metric: string;
  photo: Image;
  order: number;
};

export type Metric = { value: string; unit: string; label: string };

export type ApiSettings = {
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
  metrics: Metric[];
  about: { title: string; text: string; tags: string[] };
  photos: { hero: Image; about: Image };
  pricingTerms: string[];
  legal: Legal;
  i18n?: Translations<{
    hours: string;
    aboutTitle: string;
    aboutText: string;
    aboutTags: string[];
    pricingTerms: string[];
    metrics: Metric[];
  }>;
};

export type Legal = {
  name: string;
  status: string;
  siret: string;
  address: string;
  vat: string;
  qualification: string;
  insurance: string;
  host: string;
};
