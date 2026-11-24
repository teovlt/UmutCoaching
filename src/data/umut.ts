// Umut's own photos, sent by him (24/11/2026) and bundled with the site as
// defaults: a photo uploaded in /admin › Photos always takes their place.
// Cropped, resized to 1600 px max and stripped of metadata (EXIF/GPS) before
// being committed. Shown in colour, like the photos uploaded in /admin; only
// the stock illustrations are black and white (docs/05-decisions.md D23).
import type { ImageMetadata } from "astro";
import bilanPhoto from "@/assets/images/umut/bilan-photo.jpg";
import dosSalle from "@/assets/images/umut/dos-salle.jpg";
import heroPose from "@/assets/images/umut/hero-pose-salle.jpg";
import portrait from "@/assets/images/umut/portrait.jpg";
import poseProfil from "@/assets/images/umut/pose-profil.jpg";
import poseProjecteur from "@/assets/images/umut/pose-projecteur.jpg";
import seancePoulie from "@/assets/images/umut/seance-poulie.jpg";
import type { ProgrammeFormat } from "@/lib/types";

export type UmutPhoto = {
  src: ImageMetadata;
  alt: string;
};

export const umut = {
  hero: { src: heroPose, alt: "Umut torse nu, biceps contracté, dans une salle aux murs blancs et à la charpente métallique" },
  portrait: { src: portrait, alt: "Portrait d'Umut, souriant, bras croisés devant un mur en béton" },
  seance: { src: seancePoulie, alt: "Umut à l'entraînement, tirage à la poulie assis sur un banc" },
  bilan: { src: bilanPhoto, alt: "Umut se prenant en photo dans le miroir de la salle, téléphone en main" },
  projecteur: { src: poseProjecteur, alt: "Umut posant de trois quarts sous un projecteur, salle dans la pénombre" },
  profil: { src: poseProfil, alt: "Umut en pose de profil à côté d'un sac de frappe" },
  dos: { src: dosSalle, alt: "Umut de dos, sweat « XXXL Inc Bodybuilder », dans une grande salle d'entraînement" },
} satisfies Record<string, UmutPhoto>;

/** "En salle" strip on /a-propos */
export const umutGallery: UmutPhoto[] = [umut.projecteur, umut.profil, umut.dos];

/** Default picture of a programme without its own photo, by format */
export const programmeDefault: Record<ProgrammeFormat, UmutPhoto> = {
  salle: umut.seance,
  "en-ligne": umut.bilan,
  hybride: umut.seance,
};
