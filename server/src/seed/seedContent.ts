import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Faq } from "../models/Faq.js";
import { Programme } from "../models/Programme.js";
import { getSettings } from "../models/Settings.js";

// Starting content, written to look finished so the site can go online:
// Umut reviews and corrects it in /admin. Facts he confirmed (23/11/2026,
// docs/05-decisions.md) are used as is; the rest (prices within the 80–110
// range he gave, wording, city and gym) is a coherent first draft, listed in
// docs/05-decisions.md D24.
// Never invented, because they would mislead visitors or break the law: no
// testimonials (need a client's written consent), no result figures, no
// diploma or professional card (Q13), no SIRET, legal name or insurance (Q16):
// those stay [À CONFIRMER] until he gives them.
//
// Safe to run again: existing programmes (by slug), FAQ entries (by question)
// and settings fields already filled are left untouched, so edits made in
// /admin are never overwritten. With --overwrite, the seeded programmes, FAQ
// entries and settings fields are reset to the values below (other content
// is kept).
// In production, from the api container: node dist/seed/seedContent.js

const overwrite = process.argv.includes("--overwrite");

const programmes = [
  {
    slug: "coaching-individuel",
    title: "Coaching individuel",
    summary: "Séances 1:1 en salle : technique, charges et progression suivies de près.",
    audience: "Perte ou prise de poids, prise de muscle, gain de force, posture. Débutants comme sportifs confirmés.",
    format: "salle",
    duration: "45–75 min",
    priceFrom: 80,
    priceUnit: "séance",
    currency: "EUR",
    includes: [
      "Première séance : bilan complet, mensurations et objectifs",
      "Programme écrit pour vous, ajusté chaque semaine",
      "Correction de la technique sur chaque exercice",
      "Suivi des charges et des mensurations séance après séance",
      "Questions entre les séances sur WhatsApp, réponse sous 24 h",
    ],
    steps: [
      { label: "Bilan", text: "Mensurations, historique, objectifs et photo de départ si vous le souhaitez." },
      { label: "Plan", text: "Un programme adapté à votre niveau, à votre emploi du temps et à votre objectif." },
      { label: "Séances", text: "1 à 2 séances par semaine ensemble : technique, charges, intensité." },
      { label: "Ajustements", text: "Le programme évolue chaque semaine selon vos chiffres et votre récupération." },
    ],
    featured: true,
    order: 0,
  },
  {
    slug: "coaching-en-ligne",
    title: "Coaching en ligne",
    summary: "Programme personnalisé, bilan chaque dimanche, ajustements à distance.",
    audience: "Débutants et sportifs amateurs qui s'entraînent seuls et veulent un cadre et un suivi.",
    format: "hybride",
    duration: "bilan hebdo",
    priceFrom: 110,
    priceUnit: "mois",
    currency: "EUR",
    includes: [
      "Bilan de départ en visio ou en salle",
      "Programme personnalisé dans un Google Sheets",
      "Bilan chaque dimanche : charges, mensurations, ressenti",
      "Programme ajusté chaque semaine",
      "Échanges sur WhatsApp, réponse sous 24 h",
    ],
    steps: [
      { label: "Bilan", text: "Un échange pour faire le point : niveau, matériel disponible, objectifs, contraintes." },
      { label: "Programme", text: "Vous recevez votre programme détaillé, exercice par exercice, avec les charges cibles." },
      { label: "Dimanche", text: "Vous envoyez votre bilan de la semaine : séances réalisées, chiffres, photos si vous le souhaitez." },
      { label: "Ajustements", text: "Le programme de la semaine suivante est mis à jour à partir de votre bilan." },
    ],
    order: 1,
  },
  {
    slug: "nutrition",
    title: "Nutrition",
    summary: "Accompagnement alimentaire avec Manon, nutritionniste, en complément de l'entraînement.",
    audience: "Personnes qui s'entraînent sans savoir comment adapter leur alimentation à leur objectif.",
    format: "en-ligne",
    includes: ["Bilan alimentaire", "Recommandations adaptées à votre objectif", "Suivi à distance"],
    order: 2,
    // Hidden until Manon's qualification and the offer are confirmed (Q15)
    visible: false,
  },
  {
    slug: "pre-post-natal",
    title: "Pré / post-natal",
    summary: "Renforcement adapté pendant et après la grossesse, avec l'accord de votre médecin ou sage-femme.",
    audience: "Futures et jeunes mamans souhaitant garder ou reprendre une activité encadrée.",
    format: "hybride",
    order: 3,
    // Health-sensitive: hidden until the qualification and format are confirmed (Q18)
    visible: false,
  },
];

const faqs = [
  {
    question: "Je débute complètement, c'est pour moi ?",
    answer:
      "Oui. La première séance sert justement à partir de votre niveau réel : on apprend les mouvements de base avant d'ajouter de la charge.",
  },
  {
    question: "Combien de séances par semaine ?",
    answer: "En général 1 à 2 séances avec moi, complétées si besoin par des séances en autonomie prévues dans votre programme.",
  },
  {
    question: "Comment se passe la première séance ?",
    answer:
      "Mensurations détaillées, échange sur vos objectifs et votre historique, photo de départ si vous le souhaitez, puis une première prise en main en salle.",
  },
  {
    question: "Comment se passe le coaching en ligne ?",
    answer:
      "Votre programme est dans un Google Sheets, on échange sur WhatsApp, vous faites votre bilan chaque dimanche et je réponds sous 24 h.",
  },
  {
    question: "Faut-il un abonnement à une salle ?",
    answer:
      "Pour le coaching individuel, oui : les séances ont lieu en salle et l'accès reste à votre charge. Pour le coaching en ligne, le programme s'adapte au matériel dont vous disposez.",
  },
  {
    question: "En combien de temps verrai-je des résultats ?",
    answer:
      "Cela dépend de votre point de départ, de votre régularité et de votre récupération. C'est pour ça que tout est mesuré : on voit chaque semaine ce qui bouge et on ajuste.",
  },
  {
    question: "Puis-je annuler une séance ?",
    answer: "Oui, gratuitement jusqu'à 24 h avant. Au-delà, la séance est due.",
  },
  {
    question: "Comment payer ?",
    answer: "En espèces ou par virement.",
  },
  {
    question: "Dans quelle langue se passe le coaching ?",
    answer: "En français, en turc ou en anglais, au choix.",
  },
];

// D18: no "years of experience", he is a new coach
const metrics = [{ value: "24", unit: "h", label: "délai de réponse" }];

// Contact details confirmed by Umut on 23/11/2026; city and gym from his
// answers to Q1/Q14 ("Bellegarde", "peut-être Profit Valserhône"), to check
const siteSettings = {
  city: "Bellegarde-sur-Valserine",
  country: "France",
  gym: "Profit Valserhône",
  phone: "06 31 76 49 99",
  email: "umut.coachsportif@gmail.com",
  hours: "lun–ven 09:00–18:00 · sam 09:00–15:00",
};

const socials = [
  { label: "Instagram", url: "https://www.instagram.com/umut.coachsportif" },
  { label: "TikTok", url: "https://www.tiktok.com/@umut.coachsportif" },
];

const about = {
  title: "Umut, coach musculation.",
  text: [
    "Je m'entraîne en musculation depuis plus de quatre ans. Ce qui m'a fait progresser, ce n'est pas la motivation du moment : c'est de noter mes séances, de mesurer et d'ajuster.",
    "C'est cette méthode que je vous propose : un point de départ chiffré, un programme écrit pour vous et revu chaque semaine, et un suivi au kilo près.",
    "Je coache en salle à Bellegarde-sur-Valserine et en ligne, en français, en turc ou en anglais. Débutant ou confirmé, on part de votre niveau réel.",
  ].join("\n\n"),
  tags: ["force", "prise-de-masse", "sèche"],
};

// Confirmed on 23/11/2026; VAT depends on his legal status (Q16), shown on the
// site as [À CONFIRMER] until set in /admin › Mentions légales
const pricingTerms = [
  "Bilan de départ inclus dans les offres",
  "Sans engagement de durée",
  "Annulation gratuite jusqu'à 24 h avant, sinon la séance est due",
  "Paiement en espèces ou par virement",
];

const run = async () => {
  await connectDB();
  if (overwrite) console.log("--overwrite: seeded content is reset");

  let created = 0;
  for (const programme of programmes) {
    const result = overwrite
      ? await Programme.updateOne({ slug: programme.slug }, { $set: programme }, { upsert: true })
      : await Programme.updateOne({ slug: programme.slug }, { $setOnInsert: programme }, { upsert: true });
    created += result.upsertedCount;
  }
  console.log(`Programmes: ${created} created, ${programmes.length - created} ${overwrite ? "reset" : "already there"}`);

  created = 0;
  for (const [order, faq] of faqs.entries()) {
    const doc = { ...faq, order, pages: ["accueil"] };
    const result = await Faq.updateOne({ question: faq.question }, overwrite ? { $set: doc } : { $setOnInsert: doc }, { upsert: true });
    created += result.upsertedCount;
  }
  console.log(`FAQ: ${created} created, ${faqs.length - created} ${overwrite ? "reset" : "already there"}`);

  // Without --overwrite, only empty fields are filled: a value set in /admin
  // is never replaced
  const settings = await getSettings();
  const filled: string[] = [];
  const fill = (field: string, value: unknown, isEmpty: boolean) => {
    if (overwrite || isEmpty) {
      settings.set(field, value);
      filled.push(field);
    }
  };
  for (const [field, value] of Object.entries(siteSettings)) fill(field, value, !settings.get(field));
  fill("metrics", metrics, settings.metrics.length === 0);
  fill(
    "socials",
    socials,
    settings.socials.every((s) => !s.url),
  );
  fill("about.title", about.title, !settings.about?.title);
  fill("about.text", about.text, !settings.about?.text);
  fill("about.tags", about.tags, !settings.about?.tags.length);
  fill("pricingTerms", pricingTerms, !settings.pricingTerms?.length);
  await settings.save();
  console.log(filled.length ? `Settings: ${overwrite ? "set" : "filled"} ${filled.join(", ")}` : "Settings: already filled in");

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
