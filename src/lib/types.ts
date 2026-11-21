// Shapes returned by the API (server/src/models). Keep in sync with the
// Mongoose schemas.

export type Image = { url: string; alt: string };

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
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  pages: string[];
  order: number;
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
};
