// Umut's own photos, sent by him (24/11/2026) and bundled with the site as
// defaults: a photo uploaded in /admin › Photos always takes their place.
// Cropped, resized to 1600 px max and stripped of metadata (EXIF/GPS) before
// being committed. Shown in colour, like the photos uploaded in /admin; only
// the stock illustrations are black and white (docs/05-decisions.md D23).
import type { ImageMetadata } from "astro";
import type { Lang } from "@/i18n/config";
import bilanPhoto from "@/assets/images/umut/bilan-photo.jpg";
import dosSalle from "@/assets/images/umut/dos-salle.jpg";
import heroMontagne from "@/assets/images/umut/hero-montagne.jpg";
import poseSalle from "@/assets/images/umut/hero-pose-salle.jpg";
import portrait from "@/assets/images/umut/portrait.jpg";
import poseProfil from "@/assets/images/umut/pose-profil.jpg";
import poseProjecteur from "@/assets/images/umut/pose-projecteur.jpg";
import seancePoulie from "@/assets/images/umut/seance-poulie.jpg";

export type UmutPhoto = {
  src: ImageMetadata;
  /** Alt text in each language */
  alt: Record<Lang, string>;
};

export const umut = {
  hero: {
    src: heroMontagne,
    alt: {
      fr: "Umut souriant en randonnée, sac au dos, au-dessus d'un lac de montagne",
      en: "Umut smiling on a hike, backpack on, above a mountain lake",
      tr: "Umut sırt çantasıyla dağ yürüyüşünde, bir dağ gölünün üzerinde gülümsüyor",
    },
  },
  poseSalle: {
    src: poseSalle,
    alt: {
      fr: "Umut torse nu, biceps contracté, dans une salle aux murs blancs et à la charpente métallique",
      en: "Umut shirtless, flexing his biceps in a white-walled gym with a steel roof",
      tr: "Umut çıplak gövdeyle, beyaz duvarlı ve çelik çatılı bir salonda pazusunu kasıyor",
    },
  },
  portrait: {
    src: portrait,
    alt: {
      fr: "Portrait d'Umut, souriant, bras croisés devant un mur en béton",
      en: "Portrait of Umut, smiling, arms crossed in front of a concrete wall",
      tr: "Umut'un portresi, gülümsüyor, beton bir duvarın önünde kollarını kavuşturmuş",
    },
  },
  seance: {
    src: seancePoulie,
    alt: {
      fr: "Umut à l'entraînement, tirage à la poulie assis sur un banc",
      en: "Umut training, a seated cable pull on a bench",
      tr: "Umut antrenmanda, bankta oturarak kablo çekişi yapıyor",
    },
  },
  bilan: {
    src: bilanPhoto,
    alt: {
      fr: "Umut se prenant en photo dans le miroir de la salle, téléphone en main",
      en: "Umut taking a mirror photo at the gym, phone in hand",
      tr: "Umut salondaki aynada elinde telefonla fotoğraf çekiyor",
    },
  },
  projecteur: {
    src: poseProjecteur,
    alt: {
      fr: "Umut posant de trois quarts sous un projecteur, salle dans la pénombre",
      en: "Umut posing three-quarter under a spotlight in a dim gym",
      tr: "Umut loş bir salonda spot ışığı altında yarı profilden poz veriyor",
    },
  },
  profil: {
    src: poseProfil,
    alt: {
      fr: "Umut en pose de profil à côté d'un sac de frappe",
      en: "Umut in a side pose next to a punching bag",
      tr: "Umut bir kum torbasının yanında profilden poz veriyor",
    },
  },
  dos: {
    src: dosSalle,
    alt: {
      fr: "Umut de dos, sweat « XXXL Inc Bodybuilder », dans une grande salle d'entraînement",
      en: 'Umut from behind, "XXXL Inc Bodybuilder" hoodie, in a large training hall',
      tr: 'Umut arkadan, "XXXL Inc Bodybuilder" sweatshirt\'üyle büyük bir antrenman salonunda',
    },
  },
} satisfies Record<string, UmutPhoto>;

/** "En salle" strip on /a-propos */
export const umutGallery: UmutPhoto[] = [umut.projecteur, umut.profil, umut.dos];

/** Default picture of each seeded programme: one photo per offer */
const programmeBySlug: Record<string, UmutPhoto> = {
  "coaching-individuel": umut.seance,
  "coaching-en-ligne": umut.bilan,
  nutrition: umut.poseSalle,
  "pre-post-natal": umut.profil,
};

/** Photos for programmes created later in /admin without their own photo */
const programmePool: UmutPhoto[] = [umut.projecteur, umut.dos, umut.poseSalle, umut.profil, umut.seance, umut.bilan];

/** Default picture of a programme without its own photo: by offer, else
 *  picked from the pool by its slug, so it stays the same on every page */
export const programmeDefault = (slug: string): UmutPhoto => {
  const known = programmeBySlug[slug];
  if (known) return known;
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return programmePool[hash % programmePool.length] ?? umut.seance;
};
