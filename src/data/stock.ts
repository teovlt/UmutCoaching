// Stock photos from Unsplash (free licence, https://unsplash.com/license),
// self-hosted in src/assets/images/stock so visitors never call Unsplash.
// Only objects and anonymous body parts: nothing that could pass for
// Umut or for a client (no invented result). Shown in black and white (the
// "labo" treatment of docs/03-design-system.md §7). Credits on
// /mentions-legales.
import type { ImageMetadata } from "astro";
import methodeAjuster from "@/assets/images/stock/methode-ajuster.jpg";
import methodeMesurer from "@/assets/images/stock/methode-mesurer.jpg";
import methodeProgresser from "@/assets/images/stock/methode-progresser.jpg";

export type StockPhoto = {
  src: ImageMetadata;
  alt: string;
  author: string;
  /** Photo page on Unsplash */
  url: string;
};

const unsplash = (id: string) => `https://unsplash.com/photos/${id}`;

export const stock = {
  mesurer: {
    src: methodeMesurer,
    alt: "Mètre ruban de couturière enroulé sur une table",
    author: "Siora Photography",
    url: unsplash("cixohzDpNIo"),
  },
  ajuster: {
    src: methodeAjuster,
    alt: "Carnet ouvert avec un tableau manuscrit, un stylo et une règle",
    author: "Isaac Smith",
    url: unsplash("dkpWRI_4J40"),
  },
  progresser: {
    src: methodeProgresser,
    alt: "Jambes d'un athlète au départ d'un soulevé de terre, barre chargée au sol",
    author: "Victor Freitas",
    url: unsplash("vqDAUejnwKw"),
  },
} satisfies Record<string, StockPhoto>;
