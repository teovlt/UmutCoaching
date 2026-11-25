// Field definitions of the /admin forms. The same list renders the form
// (AdminForm.astro) and turns it back into JSON in the browser
// (src/scripts/admin/form.ts), so both always agree.
//
// `name` is a dot path in the API document ("about.title").

export type FieldDef =
  | { kind: "text" | "email" | "url" | "tel"; name: string; label: string; help?: string; required?: boolean }
  | { kind: "textarea"; name: string; label: string; help?: string; required?: boolean; rows?: number }
  | { kind: "number"; name: string; label: string; help?: string }
  | { kind: "date"; name: string; label: string; help?: string; required?: boolean }
  | { kind: "select"; name: string; label: string; help?: string; options: { value: string; label: string }[] }
  | { kind: "checkbox"; name: string; label: string; help?: string; required?: boolean }
  /** string[], one item per line */
  | { kind: "lines"; name: string; label: string; help?: string; rows?: number }
  /** object[], one item per line, values separated by " | " */
  | { kind: "rows"; name: string; label: string; help?: string; keys: string[]; rows?: number }
  /** { url, alt }: upload to /api/uploads, plus the alt text */
  | { kind: "image"; name: string; label: string; help?: string };

export type CollectionKey = "programmes" | "faqs" | "temoignages";

// English and Turkish versions (site /en and /tr, docs/05-decisions.md D25).
// Each language repeats the given fields under i18n.<lang>; an empty one
// shows the French text on that version of the site.
const translated = (make: (lang: "en" | "tr", prefix: string) => FieldDef[]): FieldDef[] => [
  ...make("en", "Anglais"),
  ...make("tr", "Turc"),
];
const emptyHelp = "Vide = texte français affiché.";

const visible: FieldDef = {
  kind: "checkbox",
  name: "visible",
  label: "Afficher sur le site",
  help: "Décochez pour masquer sans supprimer.",
};

const currency: FieldDef = {
  kind: "select",
  name: "currency",
  label: "Devise",
  options: [
    { value: "EUR", label: "EUR (€)" },
    { value: "CHF", label: "CHF" },
  ],
};

export const programmeFields: FieldDef[] = [
  { kind: "text", name: "title", label: "Titre", required: true },
  {
    kind: "text",
    name: "slug",
    label: "Adresse de la page",
    help: "Laissez vide pour la créer depuis le titre. Ex. : coaching-individuel → /programmes/coaching-individuel",
  },
  { kind: "textarea", name: "summary", label: "Résumé", help: "Une phrase, affichée sur la carte.", rows: 3 },
  { kind: "textarea", name: "audience", label: "Pour qui ?", rows: 3 },
  {
    kind: "select",
    name: "format",
    label: "Format",
    options: [
      { value: "salle", label: "En salle" },
      { value: "en-ligne", label: "En ligne" },
      { value: "hybride", label: "Salle + en ligne" },
    ],
  },
  { kind: "text", name: "duration", label: "Durée", help: "Ex. 60 min, 12 sem." },
  { kind: "number", name: "priceFrom", label: "Prix à partir de", help: "Vide = « dès [À CONFIRMER] » sur le site." },
  { kind: "text", name: "priceUnit", label: "Unité du prix", help: "Ex. / séance, / mois" },
  { kind: "text", name: "priceLabel", label: "Texte à la place du prix", help: "Ex. sur devis. Remplace le prix s'il est rempli." },
  currency,
  { kind: "lines", name: "includes", label: "Ce qui est inclus", help: "Un élément par ligne." },
  {
    kind: "rows",
    name: "steps",
    label: "Déroulé",
    keys: ["label", "text"],
    help: "Une étape par ligne : S01–S04 | Bilan et premières charges",
  },
  {
    kind: "select",
    name: "status",
    label: "Badge",
    options: [
      { value: "", label: "Aucun" },
      { value: "new", label: "Nouveau" },
      { value: "available", label: "Places dispo" },
      { value: "few", label: "Dernières places" },
      { value: "full", label: "Complet" },
    ],
  },
  { kind: "checkbox", name: "featured", label: "Recommandé", help: "Une seule offre recommandée à la fois." },
  { kind: "image", name: "image", label: "Photo" },
  visible,
  ...translated((lang, prefix) => [
    { kind: "text", name: `i18n.${lang}.title`, label: `${prefix} · Titre`, help: emptyHelp },
    { kind: "textarea", name: `i18n.${lang}.summary`, label: `${prefix} · Résumé`, rows: 3 },
    { kind: "textarea", name: `i18n.${lang}.audience`, label: `${prefix} · Pour qui ?`, rows: 3 },
    { kind: "text", name: `i18n.${lang}.duration`, label: `${prefix} · Durée` },
    { kind: "text", name: `i18n.${lang}.priceUnit`, label: `${prefix} · Unité du prix` },
    { kind: "text", name: `i18n.${lang}.priceLabel`, label: `${prefix} · Texte à la place du prix` },
    { kind: "lines", name: `i18n.${lang}.includes`, label: `${prefix} · Ce qui est inclus`, help: "Un élément par ligne." },
    { kind: "rows", name: `i18n.${lang}.steps`, label: `${prefix} · Déroulé`, keys: ["label", "text"], help: "Étape | texte" },
  ]),
];

export const faqFields: FieldDef[] = [
  { kind: "text", name: "question", label: "Question", required: true },
  { kind: "textarea", name: "answer", label: "Réponse", required: true, rows: 5 },
  {
    kind: "lines",
    name: "pages",
    label: "Pages où elle apparaît",
    help: "Une par ligne : accueil, tarifs, ou l'adresse d'un programme (coaching-individuel).",
    rows: 3,
  },
  visible,
  ...translated((lang, prefix) => [
    { kind: "text", name: `i18n.${lang}.question`, label: `${prefix} · Question`, help: emptyHelp },
    { kind: "textarea", name: `i18n.${lang}.answer`, label: `${prefix} · Réponse`, rows: 4 },
  ]),
];

export const temoignageFields: FieldDef[] = [
  {
    kind: "checkbox",
    name: "consent",
    label: "J'ai le consentement écrit du client",
    help: "Obligatoire : sans accord écrit, le témoignage ne peut pas être enregistré.",
    required: true,
  },
  { kind: "date", name: "consentDate", label: "Date du consentement", required: true },
  { kind: "text", name: "name", label: "Prénom (ou initiales)", required: true },
  { kind: "text", name: "context", label: "Contexte", help: "Ex. Prise de masse · 16 sem." },
  { kind: "textarea", name: "quote", label: "Citation", required: true, rows: 4 },
  { kind: "text", name: "metric", label: "Résultat chiffré", help: "Seulement un chiffre confirmé par le client. Ex. +12 kg au squat" },
  { kind: "image", name: "photo", label: "Photo", help: "Seulement avec son accord écrit." },
  visible,
];

export const collectionFields: Record<CollectionKey, FieldDef[]> = {
  programmes: programmeFields,
  faqs: faqFields,
  temoignages: temoignageFields,
};

export const infoFields: FieldDef[] = [
  { kind: "text", name: "city", label: "Ville", help: "Vide = [À CONFIRMER] sur le site." },
  { kind: "text", name: "country", label: "Pays" },
  currency,
  { kind: "text", name: "gym", label: "Salle" },
  { kind: "textarea", name: "address", label: "Adresse de la salle", rows: 2 },
  { kind: "tel", name: "phone", label: "Téléphone" },
  { kind: "email", name: "email", label: "E-mail" },
  { kind: "text", name: "hours", label: "Horaires", help: "Ex. lun–ven 09:00–18:00 · sam 09:00–15:00" },
  { kind: "url", name: "bookingUrl", label: "Lien d'agenda en ligne", help: "Vide tant qu'il n'y a pas d'outil de réservation." },
  {
    kind: "rows",
    name: "socials",
    label: "Réseaux sociaux",
    keys: ["label", "url"],
    help: "Un par ligne : Instagram | https://www.instagram.com/…",
    rows: 3,
  },
  {
    kind: "rows",
    name: "metrics",
    label: "Chiffres clés (accueil)",
    keys: ["value", "unit", "label"],
    help: "Un par ligne : 24 | h | délai de réponse. Uniquement des chiffres vérifiables.",
    rows: 4,
  },
  { kind: "text", name: "about.title", label: "À propos : titre" },
  { kind: "textarea", name: "about.text", label: "À propos : parcours", rows: 6 },
  { kind: "lines", name: "about.tags", label: "À propos : spécialités", help: "Une par ligne, sans #.", rows: 3 },
  {
    kind: "lines",
    name: "pricingTerms",
    label: "Conditions (tarifs)",
    help: "Une par ligne, affichées sous les tarifs (accueil, /tarifs, pages programmes). La TVA se règle dans Mentions légales.",
    rows: 5,
  },
  ...translated((lang, prefix) => [
    { kind: "text", name: `i18n.${lang}.hours`, label: `${prefix} · Horaires`, help: "Ex. Mon–Fri 09:00–18:00" },
    { kind: "text", name: `i18n.${lang}.aboutTitle`, label: `${prefix} · À propos : titre`, help: emptyHelp },
    { kind: "textarea", name: `i18n.${lang}.aboutText`, label: `${prefix} · À propos : parcours`, rows: 6 },
    { kind: "lines", name: `i18n.${lang}.aboutTags`, label: `${prefix} · À propos : spécialités`, rows: 3 },
    { kind: "lines", name: `i18n.${lang}.pricingTerms`, label: `${prefix} · Conditions (tarifs)`, rows: 5 },
    {
      kind: "rows",
      name: `i18n.${lang}.metrics`,
      label: `${prefix} · Chiffres clés`,
      keys: ["value", "unit", "label"],
      help: "Mêmes chiffres qu'en français, libellé traduit : 24 | h | reply time",
      rows: 4,
    },
  ]),
];

// Legal notice (/mentions-legales). Empty = [À CONFIRMER] on the site.
export const legalFields: FieldDef[] = [
  { kind: "text", name: "legal.name", label: "Nom légal", help: "Prénom et nom, ou raison sociale." },
  { kind: "text", name: "legal.status", label: "Statut", help: "Ex. Entrepreneur individuel (micro-entreprise)" },
  { kind: "text", name: "legal.siret", label: "SIRET" },
  { kind: "textarea", name: "legal.address", label: "Adresse légale", rows: 2 },
  { kind: "text", name: "legal.vat", label: "Mention TVA", help: "Ex. TVA non applicable, art. 293 B du CGI" },
  {
    kind: "text",
    name: "legal.qualification",
    label: "Diplôme et carte professionnelle",
    help: "Diplôme d'éducateur sportif et numéro de carte professionnelle.",
  },
  { kind: "text", name: "legal.insurance", label: "Assurance RC professionnelle", help: "Assureur et numéro de contrat." },
  { kind: "textarea", name: "legal.host", label: "Hébergeur du site", help: "Nom, adresse et téléphone de l'hébergeur.", rows: 3 },
];

export const photoFields: FieldDef[] = [
  { kind: "image", name: "photos.hero", label: "Photo d'accueil", help: "Portrait, en salle, bonne lumière." },
  { kind: "image", name: "photos.about", label: "Photo « À propos »" },
];

export type SettingsSection = "infos" | "photos" | "legal";

export const settingsFields: Record<SettingsSection, FieldDef[]> = {
  infos: infoFields,
  photos: photoFields,
  legal: legalFields,
};
