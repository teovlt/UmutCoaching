# Architecture du site

## Choix : multi-pages avec une page d'accueil « longue »

**Pas un single page.** L'accueil se lit comme une landing (tout le parcours en un scroll),
mais chaque sujet important a **sa propre URL** :

| Pourquoi | Détail |
|---|---|
| SEO local | Une page = une intention de recherche (« coach musculation [ville] », « préparation compétition bodybuilding », « coaching en ligne »). Un single page ne peut se positionner que sur une seule. |
| Partage | Umut peut envoyer le lien direct « Tarifs » ou « Prépa compétition » en DM Instagram/WhatsApp. |
| Évolution | Ajouter un programme, un blog ou une 2ᵉ langue = ajouter des fichiers, pas refondre. |
| Mesure | Analytics par page → on sait ce qui convertit. |

La navigation du design (`01 Méthode · 02 Programmes · 03 Tarifs · 04 À propos` + CTA) pointe vers des **pages**.
Sur l'accueil, chaque section reprend ces blocs en version courte avec un lien `[ voir le détail ]`.

## Plan du site (v1)

```
/                              Accueil (landing longue)
/methode                       La méthode « Mesurer. Ajuster. Progresser. »
/programmes                    Vue d'ensemble des offres
/programmes/[slug]             1 page par offre (générée depuis src/content/programmes)
/tarifs                        Grille tarifaire + packs + FAQ paiement
/a-propos                      Umut : parcours, diplômes, palmarès, valeurs
/reserver                      Prise de RDV (widget agenda) + formulaire de contact
/mentions-legales
/confidentialite
/404
```

Programmes de départ (à valider, cf. `05-decisions.md`) :
- `coaching-individuel` — séances 1:1 en salle
- `suivi-en-ligne` — programme + suivi hebdo à distance
- `preparation-competition` — prépa bodybuilding / physique (scène)
- `nutrition` — plan alimentaire et ajustements (si Umut est habilité)

**v2 possibles** (prévoir la structure, ne pas coder) : `/resultats` (transformations), `/blog`,
versions `/de/` ou `/tr/` (i18n Astro), espace client.

## Header & navigation

- Desktop (≥ 1024) : barre 76 px, fond blanc, filet bas 1 px `line`. Logo symbole + wordmark à gauche.
  Liens en Space Mono 14 px numérotés `01 …04`, lien actif en `cobalt-500`.
  CTA « Réserver une séance » **graphite** avec pastille ronde `cobalt-400` (pour laisser le cobalt plein au CTA du hero).
- Mobile (< 1024) : barre 64 px, wordmark + bouton menu carré 44 px bordé.
  Menu ouvert = **plein écran graphite**, liens 26 px Bold avec numéro mono à droite (actif en `cobalt-400`),
  CTA cobalt plein en bas. Échap ferme, focus piégé, `body` non scrollable.
- Header **sticky**, sans ombre ; au scroll, garder le filet bas.

## Accueil — sections dans l'ordre

| # | Section | Contenu | Fond |
|---|---|---|---|
| 00 | **Hero** | Label `// coach · bodybuilding · data`, H1 « Mesurer. Ajuster. Progresser. », sous-titre, CTA cobalt « Réserver une séance » + secondaire `[ voir les programmes ]`. À droite : photo d'Umut **ou** carte « Metric » (graphique de progression animé, tracé du logo). | labo |
| 01 | **Bandeau chiffres** | 3–4 `Metric` : années d'expérience, athlètes suivis, titres/compétitions, note moyenne. **Uniquement des chiffres fournis par Umut.** | blanc, filets |
| 02 | **Méthode** | 3 étapes numérotées 01 Mesurer / 02 Ajuster / 03 Progresser (bilan initial → plan ajusté chaque semaine → suivi chiffré). | labo |
| 03 | **Programmes** | Grille de `ProgramCard` (3–4), lien vers chaque page. | labo |
| 04 | **Résultats** | Témoignages réels + éventuel avant/après (consentement). Si rien de fourni : **masquer la section**. | graphite `.on-dark` |
| 05 | **Tarifs (aperçu)** | 2–3 `PricingCard`, « à partir de », lien vers /tarifs. | labo |
| 06 | **À propos (court)** | Photo + 3 lignes + diplômes en tags mono. | blanc |
| 07 | **FAQ** | 5–6 questions (`<details>`), depuis `src/content/faq`. | labo |
| 08 | **CTA final** | Bandeau graphite : « Premier bilan : on mesure où tu en es. » + CTA cobalt (cobalt-500 sur graphite OK car c'est un aplat bouton avec texte blanc 6,6:1). | graphite |
| — | **Footer** | Wordmark, coordonnées, horaires, réseaux, liens légaux, `© année umut.` en mono. | graphite |

## Pages internes — gabarit commun
1. En-tête de page : section-label (`02 / programmes`), H1, chapeau (`text-lead`), éventuel CTA.
2. Corps en sections alternant labo / blanc, séparées par des filets.
3. CTA final graphite (même composant que l'accueil).

### /programmes/[slug]
Hero (titre, pour qui, format, durée) → « Ce qui est inclus » (liste à puces carrées cobalt)
→ « Déroulé » (timeline numérotée semaine 01 → 12) → Tarif lié → FAQ spécifique → CTA.

### /tarifs
Tableau clair : offre / format / durée / prix (mono). Mettre **une seule** offre en avant
(bordure `graphite` 1 px + tag `Recommandé` avec carré cobalt). Mentions : TVA, paiement, annulation `[À CONFIRMER]`.

### /reserver
Colonne gauche : étapes « 1. Choisir un créneau 2. Bilan offert/payant 3. Démarrage ».
Colonne droite : widget agenda (Cal.com ou Calendly, voir décisions) chargé **au clic** (façade)
pour ne pas plomber la perf et ne pas déposer de cookies tiers sans action. Fallback : formulaire
(nom, e-mail, téléphone, objectif `<select>`, message) + mention RGPD.

## Modèle de contenu (MongoDB via l'API — voir D2/D9 dans `05-decisions.md`)

Le contenu éditable vit dans MongoDB (modèles Mongoose dans `server/src/models/`), servi par l'API
(`/api/programmes`, `/api/faqs`, `/api/temoignages`, `/api/settings`, `/api/uploads`, `/api/messages`) et modifiable depuis `/admin`.
Les pages Astro le lisent côté serveur via `src/lib/api.ts` (`API_URL`, cache 5 s, repli sur `src/data/site.ts` si l'API ne répond pas).
Champs : modèle prévu par le kit ci-dessous, avec en plus côté API — programmes : `priceUnit` (« / mois »), `priceLabel`
(remplace le prix, ex. « sur devis »), `status` (badge), `image {url, alt}`, `visible` ; témoignages : `consentDate` obligatoire ;
settings : `metrics` (bandeau chiffres, masqué si vide), `about {title, text, tags}`, `photos {hero, about}`.
Les photos envoyées sont converties en WebP (2000 px max, métadonnées EXIF/GPS supprimées).

```ts
programmes: {
  title: string; slug: string; order: number;
  summary: string;              // 1 phrase pour les cartes
  audience: string;             // « pour qui »
  format: 'salle' | 'en-ligne' | 'hybride';
  duration?: string;            // « 12 semaines »
  priceFrom?: number;           // en CHF/EUR, undefined = « sur devis »
  currency: 'CHF' | 'EUR';
  includes: string[];
  steps?: { label: string; text: string }[];
  featured?: boolean;
  image?: image();
}
faq:          { question: string; order: number; page: ('accueil'|'tarifs'|'programmes'|string)[] } + body markdown
temoignages:  { name: string; context: string; quote: string; metric?: string; consent: true; photo?: image() }
```
`consent: true` est **obligatoire** dans le schéma (validation Mongoose) : impossible de publier un témoignage sans.
Chaque document a aussi `visible` et `order` (masquer / réordonner depuis l'admin).

Infos globales (nom, ville, adresse salle, téléphone, réseaux, horaires, chiffres du bandeau, lien d'agenda) :
document unique `settings` dans l'API ; `src/data/site.ts` en donne les valeurs par défaut.

## Admin `/admin` (noindex)
Connexion (JWT) → écrans : Programmes & tarifs · FAQ · Témoignages (case consentement obligatoire) · Photos ·
Infos du site · Messages reçus. Pages Astro + scripts vanilla, aux couleurs de la marque.

## SEO technique
- `<title>` : `{Page} — umut. coach musculation [Ville]` ; description 140–160 car. par page.
- JSON-LD : `Person` (Umut) + `LocalBusiness`/`HealthAndBeautyBusiness` (si adresse) ou `ProfessionalService`, `Service` par programme, `FAQPage` sur les pages FAQ.
- `og-image` 1200×630 générée depuis la marque (fond labo, wordmark, H1).
- `sitemap-index.xml`, `robots.txt`, canonical, `hreflang` prêt si i18n.

## Tiers & conformité
- **Aucun cookie sans consentement.** Analytics sans cookie (Plausible ou Umami) → pas de bannière nécessaire.
- Widgets tiers (agenda, Instagram, Google Maps) : chargés au clic uniquement.
- Polices auto-hébergées (pas d'appel à fonts.googleapis.com).
