// Texts shared by several components (header, footer, cards, sections).
// Texts used by a single page live in that page, in the same shape:
// `const copy = { fr, en, tr }[Astro.locals.lang]`.
// English and Turkish are translations of the French reference copy
// (docs/04-contenu.md); keep the three in step.
import type { Lang } from "./config";

const fr = {
  skipLink: "Aller au contenu",
  homeLabel: "umut. — accueil",
  nav: { methode: "Méthode", programmes: "Programmes", tarifs: "Tarifs", aPropos: "À propos" },
  mainNavLabel: "Navigation principale",
  booking: "Réserver une séance",
  menu: { open: "Ouvrir le menu", close: "Fermer le menu", label: "Menu" },
  language: { label: "Langue", choose: "Choisir la langue" },
  footer: {
    label: "Pied de page",
    contact: "Contact",
    pages: "Pages",
    socials: "Réseaux",
    legal: "Mentions légales",
    privacy: "Confidentialité",
  },
  sectionLabels: {
    methode: "méthode",
    programmes: "programmes",
    resultats: "résultats",
    tarifs: "tarifs",
    aPropos: "à propos",
    questions: "questions",
    nextStep: "prochaine étape",
  },
  hero: {
    kicker: "// coach · bodybuilding · data",
    words: ["Mesurer.", "Ajuster.", "Progresser."],
    /** Around the city name, kept on one line */
    lead: {
      before: "Coaching musculation à ",
      after: " et en ligne. Un bilan de départ, un plan ajusté chaque semaine, une progression suivie au kilo près.",
    },
    seePrograms: "voir les programmes",
    reply: "→ réponse sous 24 h",
    caption: "fig. 01 — umut. · hors salle",
  },
  method: {
    title: "Un protocole, pas une improvisation.",
    steps: [
      {
        title: "Mesurer",
        text: "Première séance : mensurations détaillées, vos objectifs et votre historique, photo de départ si vous le souhaitez.",
      },
      {
        title: "Ajuster",
        text: "Un programme écrit pour vous, revu chaque semaine selon vos charges, votre récupération et votre ressenti.",
      },
      { title: "Progresser", text: "Chaque séance est notée. On compare régulièrement les chiffres et on fixe la suite." },
    ],
    more: "découvrir la méthode",
  },
  programs: { title: "Choisissez votre format.", empty: "Offres [À CONFIRMER]", all: "voir tous les programmes" },
  pricing: { title: "Des tarifs clairs, sans engagement caché.", all: "voir les tarifs" },
  results: { title: "Les chiffres parlent.", photoOf: (name: string) => `Photo de ${name}` },
  metricsLabel: "Chiffres clés",
  about: {
    defaultTitle: "Umut, coach musculation.",
    defaultText: "[À CONFIRMER] Parcours d'Umut en 3 à 5 lignes.",
    specialties: "Spécialités",
    more: "en savoir plus",
    caption: "fig. 02 — portrait",
    photoAlt: "Umut à la salle",
  },
  faq: { title: "Questions fréquentes." },
  cta: { title: "Première séance : on mesure où vous en êtes.", ask: "poser une question" },
  card: { seeDetail: "voir le détail", seeDetailOf: (title: string) => `Voir le détail : ${title}` },
  status: { new: "Nouveau", available: "Places dispo", few: "Dernières places", full: "Complet" },
  recommended: "Recommandé",
  formats: { salle: "en salle", "en-ligne": "en ligne", hybride: "salle + en ligne" },
  price: { from: "dès", vat: "TVA", unknown: "[À CONFIRMER]" },
  heroPhotoAlt: "Umut, coach musculation",
};

export type Dict = typeof fr;

const en: Dict = {
  skipLink: "Skip to content",
  homeLabel: "umut. — home",
  nav: { methode: "Method", programmes: "Programmes", tarifs: "Pricing", aPropos: "About" },
  mainNavLabel: "Main navigation",
  booking: "Book a session",
  menu: { open: "Open the menu", close: "Close the menu", label: "Menu" },
  language: { label: "Language", choose: "Choose the language" },
  footer: {
    label: "Footer",
    contact: "Contact",
    pages: "Pages",
    socials: "Social",
    legal: "Legal notice",
    privacy: "Privacy",
  },
  sectionLabels: {
    methode: "method",
    programmes: "programmes",
    resultats: "results",
    tarifs: "pricing",
    aPropos: "about",
    questions: "questions",
    nextStep: "next step",
  },
  hero: {
    kicker: "// coach · bodybuilding · data",
    words: ["Measure.", "Adjust.", "Progress."],
    lead: {
      before: "Strength coaching in ",
      after: " and online. A starting assessment, a plan adjusted every week, progress tracked to the kilo.",
    },
    seePrograms: "see the programmes",
    reply: "→ reply within 24 h",
    caption: "fig. 01 — umut. · outside the gym",
  },
  method: {
    title: "A protocol, not guesswork.",
    steps: [
      {
        title: "Measure",
        text: "First session: detailed measurements, your goals and your history, a starting photo if you wish.",
      },
      {
        title: "Adjust",
        text: "A programme written for you, reviewed every week based on your loads, your recovery and how you feel.",
      },
      { title: "Progress", text: "Every session is logged. We compare the numbers regularly and set what comes next." },
    ],
    more: "discover the method",
  },
  programs: { title: "Choose your format.", empty: "Offers [À CONFIRMER]", all: "see all programmes" },
  pricing: { title: "Clear prices, no hidden commitment.", all: "see the prices" },
  results: { title: "The numbers speak.", photoOf: (name: string) => `Photo of ${name}` },
  metricsLabel: "Key figures",
  about: {
    defaultTitle: "Umut, strength coach.",
    defaultText: "[À CONFIRMER] Umut's background in 3 to 5 lines.",
    specialties: "Specialties",
    more: "learn more",
    caption: "fig. 02 — portrait",
    photoAlt: "Umut at the gym",
  },
  faq: { title: "Frequently asked questions." },
  cta: { title: "First session: we measure where you stand.", ask: "ask a question" },
  card: { seeDetail: "see the details", seeDetailOf: (title: string) => `See the details: ${title}` },
  status: { new: "New", available: "Spots available", few: "Last spots", full: "Full" },
  recommended: "Recommended",
  formats: { salle: "at the gym", "en-ligne": "online", hybride: "gym + online" },
  price: { from: "from", vat: "VAT", unknown: "[À CONFIRMER]" },
  heroPhotoAlt: "Umut, strength coach",
};

const tr: Dict = {
  skipLink: "İçeriğe geç",
  homeLabel: "umut. — ana sayfa",
  nav: { methode: "Yöntem", programmes: "Programlar", tarifs: "Fiyatlar", aPropos: "Hakkımda" },
  mainNavLabel: "Ana menü",
  booking: "Seans ayırt",
  menu: { open: "Menüyü aç", close: "Menüyü kapat", label: "Menü" },
  language: { label: "Dil", choose: "Dil seçin" },
  footer: {
    label: "Alt bilgi",
    contact: "İletişim",
    pages: "Sayfalar",
    socials: "Sosyal medya",
    legal: "Yasal bilgiler",
    privacy: "Gizlilik",
  },
  sectionLabels: {
    methode: "yöntem",
    programmes: "programlar",
    resultats: "sonuçlar",
    tarifs: "fiyatlar",
    aPropos: "hakkımda",
    questions: "sorular",
    nextStep: "sonraki adım",
  },
  hero: {
    kicker: "// koç · vücut geliştirme · veri",
    words: ["Ölç.", "Ayarla.", "İlerle."],
    lead: {
      before: "",
      after:
        " ve online fitness koçluğu. Başlangıç değerlendirmesi, her hafta güncellenen bir plan, kilosu kilosuna takip edilen bir ilerleme.",
    },
    seePrograms: "programları gör",
    reply: "→ 24 saat içinde yanıt",
    caption: "fig. 01 — umut. · salon dışında",
  },
  method: {
    title: "Doğaçlama değil, bir protokol.",
    steps: [
      {
        title: "Ölç",
        text: "İlk seans: detaylı vücut ölçüleri, hedefleriniz ve geçmişiniz, isterseniz bir başlangıç fotoğrafı.",
      },
      {
        title: "Ayarla",
        text: "Size özel yazılmış bir program; ağırlıklarınıza, toparlanmanıza ve hislerinize göre her hafta gözden geçirilir.",
      },
      { title: "İlerle", text: "Her seans kaydedilir. Rakamları düzenli olarak karşılaştırır, sonraki adımı belirleriz." },
    ],
    more: "yöntemi keşfet",
  },
  programs: { title: "Formatınızı seçin.", empty: "Teklifler [À CONFIRMER]", all: "tüm programları gör" },
  pricing: { title: "Net fiyatlar, gizli taahhüt yok.", all: "fiyatları gör" },
  results: { title: "Rakamlar konuşuyor.", photoOf: (name: string) => `${name} fotoğrafı` },
  metricsLabel: "Temel rakamlar",
  about: {
    defaultTitle: "Umut, fitness koçu.",
    defaultText: "[À CONFIRMER] Umut'un geçmişi, 3-5 satırda.",
    specialties: "Uzmanlık alanları",
    more: "daha fazla bilgi",
    caption: "fig. 02 — portre",
    photoAlt: "Umut salonda",
  },
  faq: { title: "Sık sorulan sorular." },
  cta: { title: "İlk seans: nerede olduğunuzu ölçüyoruz.", ask: "soru sor" },
  card: { seeDetail: "detayları gör", seeDetailOf: (title: string) => `Detayları gör: ${title}` },
  status: { new: "Yeni", available: "Yer var", few: "Son yerler", full: "Dolu" },
  recommended: "Önerilen",
  formats: { salle: "salonda", "en-ligne": "online", hybride: "salon + online" },
  price: { from: "başlangıç", vat: "KDV", unknown: "[À CONFIRMER]" },
  heroPhotoAlt: "Umut, fitness koçu",
};

export const ui: Record<Lang, Dict> = { fr, en, tr };
