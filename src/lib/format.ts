// Display helpers shared by the public pages, in the page's language.
import { isPlaceholder } from "@/data/site";
import { type Lang, languages } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import type { Legal, Programme } from "./types";

const NBSP = "\u00a0";

/** "en salle · 45–75 min" */
export const programmeMeta = (p: Pick<Programme, "format" | "duration">, lang: Lang): string =>
  [ui[lang].formats[p.format], p.duration].filter(Boolean).join(" · ");

export type PriceParts =
  { kind: "amount"; amount: string; currency: string; unit: string } | { kind: "label"; text: string } | { kind: "unknown" };

/** A programme's price split for display: big figure, currency and unit apart */
export const priceParts = (p: Pick<Programme, "priceFrom" | "priceUnit" | "priceLabel" | "currency">, lang: Lang): PriceParts => {
  if (p.priceLabel) return { kind: "label", text: p.priceLabel };
  if (p.priceFrom === undefined || p.priceFrom === null) return { kind: "unknown" };
  return {
    kind: "amount",
    amount: new Intl.NumberFormat(languages[lang].intl, { maximumFractionDigits: 2 }).format(p.priceFrom),
    currency: p.currency === "EUR" ? "€" : p.currency,
    unit: p.priceUnit,
  };
};

/** "dès 90 € séance", "sur devis" or "dès [À CONFIRMER]", with non-breaking spaces */
export const priceText = (p: Pick<Programme, "priceFrom" | "priceUnit" | "priceLabel" | "currency">, lang: Lang): string => {
  const parts = priceParts(p, lang);
  const { from, unknown } = ui[lang].price;
  if (parts.kind === "label") return parts.text;
  if (parts.kind === "unknown") return `${from}${NBSP}${unknown}`;
  return `${from}${NBSP}${parts.amount}${NBSP}${parts.currency}${parts.unit ? `${NBSP}${parts.unit}` : ""}`;
};

/** Conditions under the prices, VAT last: "TVA : [À CONFIRMER]" until the legal status is known (Q16) */
export const pricingConditions = (s: { pricingTerms: string[]; legal: Pick<Legal, "vat"> }, lang: Lang): string[] => [
  ...s.pricingTerms,
  isPlaceholder(s.legal.vat) ? `${ui[lang].price.vat}${lang === "fr" ? NBSP : ""}: [À CONFIRMER]` : s.legal.vat,
];
