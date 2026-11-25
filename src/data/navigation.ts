// Main navigation, numbered as in the design (01 … 04). Each entry is a page,
// see docs/02-architecture.md. Labels are in src/i18n/ui.ts (`nav`); links
// get the language prefix with localePath().
import type { Dict } from "@/i18n/ui";

export type NavItem = { index: string; key: keyof Dict["nav"]; href: string };

export const mainNav: NavItem[] = [
  { index: "01", key: "methode", href: "/methode" },
  { index: "02", key: "programmes", href: "/programmes" },
  { index: "03", key: "tarifs", href: "/tarifs" },
  { index: "04", key: "aPropos", href: "/a-propos" },
];

export const bookingHref = "/reserver";

export const legalNav: { key: "legal" | "privacy"; href: string }[] = [
  { key: "legal", href: "/mentions-legales" },
  { key: "privacy", href: "/confidentialite" },
];

/** True when `path` (without language prefix) is `href` or one of its sub-pages */
export const isActive = (path: string, href: string): boolean => {
  const clean = path.replace(/\/$/, "") || "/";
  return clean === href || clean.startsWith(`${href}/`);
};
