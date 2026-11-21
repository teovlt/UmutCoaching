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
    summary: "Séances 1:1 en salle, technique et charges sous contrôle.",
    audience: "[À CONFIRMER]",
    format: "salle",
    duration: "60 min",
    order: 0,
  },
  {
    slug: "suivi-en-ligne",
    title: "Suivi en ligne",
    summary: "Programme personnalisé, bilan hebdo, ajustements à distance.",
    audience: "[À CONFIRMER]",
    format: "en-ligne",
    duration: "12 sem.",
    priceUnit: "/ mois",
    order: 1,
  },
  {
    slug: "preparation-competition",
    title: "Préparation compétition",
    summary: "Prépa scène : diète, peak week, posing.",
    audience: "[À CONFIRMER]",
    format: "hybride",
    duration: "16–24 sem.",
    priceLabel: "sur devis",
    order: 2,
  },
  {
    slug: "nutrition",
    title: "Nutrition",
    summary: "Plan alimentaire chiffré, ajusté à tes données.",
    audience: "[À CONFIRMER]",
    format: "en-ligne",
    order: 3,
    // Hidden until Umut's nutrition qualification is confirmed (Q4)
    visible: false,
  },
];

const faqs = [
  {
    question: "Je débute complètement, c'est pour moi ?",
    answer: "Oui. Le bilan initial sert justement à partir de ton niveau réel.",
  },
  {
    question: "Combien de séances par semaine ?",
    answer: "[À CONFIRMER], en général 2 à 4 selon ton objectif et ton emploi du temps.",
  },
  {
    question: "Comment se passe le suivi en ligne ?",
    answer: "Programme dans [outil], bilan chaque [jour], réponse sous 24 h.",
  },
  {
    question: "Faut-il un abonnement à une salle ?",
    answer: "[À CONFIRMER : salle partenaire / accès inclus ?]",
  },
  {
    question: "Puis-je annuler une séance ?",
    answer: "[politique d'annulation]",
  },
  {
    question: "Comment se passe la première séance ?",
    answer: "Bilan, tests, objectifs chiffrés, puis premier entraînement.",
  },
];

// Values left empty are hidden on the site until Umut gives them
const metrics = [
  { value: "", unit: "ans", label: "d'expérience" },
  { value: "", unit: "+", label: "athlètes accompagnés" },
  { value: "", unit: "", label: "compétitions / titres" },
  { value: "24", unit: "h", label: "délai de réponse" },
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

  const settings = await getSettings();
  if (settings.metrics.length === 0) {
    settings.set({ metrics, socials: [{ label: "Instagram", url: "" }] });
    await settings.save();
    console.log("Settings: key figures and socials initialised");
  } else {
    console.log("Settings: already initialised");
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
