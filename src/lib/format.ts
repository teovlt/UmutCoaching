// Display helpers shared by the public pages.
import type { Programme, ProgrammeFormat } from "./types";

export const formatLabels: Record<ProgrammeFormat, string> = {
  salle: "en salle",
  "en-ligne": "en ligne",
  hybride: "salle + en ligne",
};

const NBSP = " ";

/** "en salle · 45–75 min" */
export const programmeMeta = (p: Pick<Programme, "format" | "duration">): string =>
  [formatLabels[p.format], p.duration].filter(Boolean).join(" · ");

export type PriceParts =
  { kind: "amount"; amount: string; currency: string; unit: string } | { kind: "label"; text: string } | { kind: "unknown" };

/** A programme's price split for display: big figure, currency and unit apart */
export const priceParts = (p: Pick<Programme, "priceFrom" | "priceUnit" | "priceLabel" | "currency">): PriceParts => {
  if (p.priceLabel) return { kind: "label", text: p.priceLabel };
  if (p.priceFrom === undefined || p.priceFrom === null) return { kind: "unknown" };
  return {
    kind: "amount",
    amount: new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(p.priceFrom),
    currency: p.currency === "EUR" ? "€" : p.currency,
    unit: p.priceUnit,
  };
};

/** "dès 90 € / séance", "sur devis" or "dès [À CONFIRMER]", with non-breaking spaces */
export const priceText = (p: Pick<Programme, "priceFrom" | "priceUnit" | "priceLabel" | "currency">): string => {
  const parts = priceParts(p);
  if (parts.kind === "label") return parts.text;
  if (parts.kind === "unknown") return `dès${NBSP}[À CONFIRMER]`;
  return `dès${NBSP}${parts.amount}${NBSP}${parts.currency}${parts.unit ? `${NBSP}${parts.unit}` : ""}`;
};
