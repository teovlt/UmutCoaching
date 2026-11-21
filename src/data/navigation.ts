// Main navigation, numbered as in the design (01 … 04). Each entry is a page,
// see docs/02-architecture.md.
export type NavItem = { index: string; label: string; href: string };

export const mainNav: NavItem[] = [
  { index: "01", label: "Méthode", href: "/methode" },
  { index: "02", label: "Programmes", href: "/programmes" },
  { index: "03", label: "Tarifs", href: "/tarifs" },
  { index: "04", label: "À propos", href: "/a-propos" },
];

export const bookingCta = { label: "Réserver une séance", href: "/reserver" };

export const legalNav: NavItem[] = [
  { index: "", label: "Mentions légales", href: "/mentions-legales" },
  { index: "", label: "Confidentialité", href: "/confidentialite" },
];

/** True when `path` is `href` or one of its sub-pages (/programmes/suivi-en-ligne) */
export const isActive = (path: string, href: string): boolean => {
  const clean = path.replace(/\/$/, "") || "/";
  return clean === href || clean.startsWith(`${href}/`);
};
