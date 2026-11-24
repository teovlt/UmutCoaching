import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Faq } from "../models/Faq.js";
import { Programme } from "../models/Programme.js";
import { getSettings } from "../models/Settings.js";

// Starting content from docs/04-contenu.md. Anything Umut has not confirmed
// stays a visible placeholder or is left empty (the site then shows its
// [À CONFIRMER] default): never replace one with an invented value.
// No testimonials: they need a real client's written consent.
//
// Safe to run again: existing programmes (by slug) and FAQ entries (by
// question) are left untouched, so edits made in /admin are never overwritten.
// In production: `docker compose exec api node dist/seed/seedContent.js`

const programmes = [
  {
    slug: "coaching-individuel",
    title: "Coaching individuel",
    summary: "Séances 1:1 en salle : technique, charges et progression suivies de près.",
    audience: "Perte ou prise de poids, prise de muscle, gain de force, posture.",
    format: "salle",
    duration: "45–75 min",
    includes: ["Première séance : mensurations détaillées et objectifs", "Programme écrit et ajusté chaque semaine"],
    order: 0,
  },
  {
    slug: "coaching-en-ligne",
    title: "Coaching en ligne",
    summary: "Programme personnalisé, bilan chaque dimanche, ajustements à distance.",
    audience: "Débutants et sportifs amateurs.",
    format: "hybride",
    duration: "bilan hebdo",
    includes: ["Programme dans un Google Sheets", "Échanges sur WhatsApp, réponse sous 24 h", "Bilan chaque dimanche"],
    order: 1,
  },
  {
    slug: "nutrition",
    title: "Nutrition",
    summary: "Accompagnement alimentaire avec Manon, nutritionniste. [À CONFIRMER]",
    audience: "Personnes qui s'entraînent sans savoir comment adapter leur alimentation.",
    format: "en-ligne",
    order: 2,
    // Hidden until Manon's qualification and the offer are confirmed (Q15)
    visible: false,
  },
  {
    slug: "pre-post-natal",
    title: "Pré / post-natal",
    summary: "Entraînement pendant et après la grossesse. [À CONFIRMER]",
    audience: "[À CONFIRMER]",
    format: "hybride",
    order: 3,
    // Health-sensitive: hidden until the qualification and format are confirmed (Q18)
    visible: false,
  },
];

const faqs = [
  {
    question: "Je débute complètement, c'est pour moi ?",
    answer: "Oui. La première séance sert justement à partir de votre niveau réel.",
  },
  {
    question: "Combien de séances par semaine ?",
    answer: "En général 1 à 2 séances avec moi, selon votre objectif et votre emploi du temps.",
  },
  {
    question: "Comment se passe le coaching en ligne ?",
    answer: "Votre programme est dans un Google Sheets, on échange sur WhatsApp, bilan chaque dimanche, réponse sous 24 h.",
  },
  {
    question: "Faut-il un abonnement à une salle ?",
    answer: "[À CONFIRMER : salle partenaire / accès inclus ?]",
  },
  {
    question: "Puis-je annuler une séance ?",
    answer: "Oui, gratuitement jusqu'à 24 h avant. Au-delà, la séance est due.",
  },
  {
    question: "Comment se passe la première séance ?",
    answer: "Mensurations détaillées, échange sur vos objectifs et votre historique, photo de départ si vous le souhaitez.",
  },
];

// Values left empty are hidden on the site until Umut gives them (D18: no
// "years of experience", he is a new coach)
const metrics = [{ value: "24", unit: "h", label: "délai de réponse" }];

// Confirmed by Umut on 23/11/2026; city, gym and address are still open (Q14)
const confirmedSettings = {
  country: "France",
  phone: "06 31 76 49 99",
  email: "umut.coachsportif@gmail.com",
  hours: "lun–ven 09:00–18:00 · sam 09:00–15:00",
};

const socials = [
  { label: "Instagram", url: "https://www.instagram.com/umut.coachsportif" },
  { label: "TikTok", url: "https://www.tiktok.com/@umut.coachsportif" },
];

const aboutTags = ["force", "prise-de-masse", "sèche"];

// Confirmed on 23/11/2026; VAT depends on his legal status (Q16), shown on the
// site as [À CONFIRMER] until set in /admin › Mentions légales
const pricingTerms = [
  "Bilan de départ inclus dans les offres",
  "Annulation gratuite jusqu'à 24 h avant, sinon la séance est due",
  "Paiement en espèces ou par virement",
];

const run = async () => {
  await connectDB();

  let created = 0;
  for (const programme of programmes) {
    const result = await Programme.updateOne({ slug: programme.slug }, { $setOnInsert: programme }, { upsert: true });
    created += result.upsertedCount;
  }
  console.log(`Programmes: ${created} created, ${programmes.length - created} already there`);

  created = 0;
  for (const [order, faq] of faqs.entries()) {
    const result = await Faq.updateOne(
      { question: faq.question },
      { $setOnInsert: { ...faq, order, pages: ["accueil"] } },
      { upsert: true },
    );
    created += result.upsertedCount;
  }
  console.log(`FAQ: ${created} created, ${faqs.length - created} already there`);

  // Only empty fields are filled: a value set in /admin is never replaced
  const settings = await getSettings();
  const filled: string[] = [];
  for (const [field, value] of Object.entries(confirmedSettings)) {
    if (!settings.get(field)) {
      settings.set(field, value);
      filled.push(field);
    }
  }
  if (settings.metrics.length === 0) {
    settings.set("metrics", metrics);
    filled.push("metrics");
  }
  if (settings.socials.every((s) => !s.url)) {
    settings.set("socials", socials);
    filled.push("socials");
  }
  if (!settings.about?.tags.length) {
    settings.set("about.tags", aboutTags);
    filled.push("about.tags");
  }
  if (!settings.pricingTerms?.length) {
    settings.set("pricingTerms", pricingTerms);
    filled.push("pricingTerms");
  }
  await settings.save();
  console.log(filled.length ? `Settings: filled ${filled.join(", ")}` : "Settings: already filled in");

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
