# umut. — Site du coach Umut (coach & bodybuilding)

Site vitrine + prise de rendez-vous. Identité validée par le client :
**Proposition 06 « Performance lab » — variante Bleu cobalt**.
Concept : *un labo de performance* — blanc clinique, graphite, **une seule couleur signal (cobalt)**,
tout ce qui se mesure est en monospace. Promesse : « Mesurer. Ajuster. Progresser. »

## Lire avant de coder
1. `docs/03-design-system.md` — règles visuelles et composants (obligatoire avant toute UI)
2. `docs/02-architecture.md` — pages, sections, routes, modèle de contenu
3. `docs/04-contenu.md` — textes de départ (les `[À CONFIRMER]` restent visibles, ne pas inventer)
4. `docs/05-decisions.md` — décisions prises et questions ouvertes
5. `design-reference/` — rendu de référence de la planche validée (HTML + PNG)

## Stack
- **Astro 7** en **rendu serveur** (`output: "server"`, `@astrojs/node` standalone) + **TypeScript strict**.
  Les pages lisent leur contenu dans l'API à chaque requête : Umut modifie prix, photos, FAQ… depuis `/admin`
  sans redéploiement. Une page qui ne dépend pas de l'API peut repasser en statique (`export const prerender = true`).
- **Tailwind CSS v4** via `@tailwindcss/vite` — config **CSS-first** : aucun `tailwind.config.js`
- Polices auto-hébergées via `@fontsource/space-grotesk` et `@fontsource/space-mono`
- Pas de framework UI (pas de React/Vue), y compris pour `/admin`. Interactions = petits `<script>` Astro en vanilla TS
- **API** (`server/`) : Express 5 + Mongoose (MongoDB), JWT pour l'admin, uploads d'images (Multer + sharp, Phase 3).
  Même architecture que le projet portfolioFreelance.
- Contenu éditable (programmes, tarifs, FAQ, témoignages, photos, infos du site) : **MongoDB via l'API**.
  `src/data/site.ts` garde les valeurs par défaut / placeholders si l'API ne répond pas.
- Images : `astro:assets` (`<Image />`, AVIF/WebP, dimensions explicites)
- SEO : `@astrojs/sitemap`, balises meta/OG par page, JSON-LD (voir architecture)
- Hébergement : **VPS avec Dokploy**, `compose.yaml` (services `nginx` → `web` + `api`). Voir `docs/05-decisions.md`

## Commandes
Gestionnaire de paquets : **pnpm** (version épinglée dans `packageManager`).
```bash
pnpm dev          # site  → http://localhost:4321
pnpm build        # doit passer sans warning avant chaque commit
pnpm check        # astro check (types)
cd server && pnpm dev        # API → http://localhost:4000 (lit server/.env)
cd server && pnpm seed:user  # crée un compte admin (interactif)
cd server && pnpm seed:content  # contenu de départ de docs/04-contenu.md (ne réécrit jamais l'existant)
docker compose up --build    # stack complète (voir README)
```

## Arborescence
```
src/
  assets/brand/     logos SVG officiels — NE PAS redessiner, NE PAS modifier
  assets/images/    photos (fournies par le client)
  components/
    ui/             Button, Tag, StatusBadge, Field, SectionLabel, Metric…
    sections/       Hero, Method, Programs, Pricing, Results, About, Faq, CtaBand…
    layout/         Header, MobileMenu, Footer, Seo
  data/site.ts      infos globales par défaut (placeholders)
  layouts/          BaseLayout.astro
  pages/            routes (voir docs/02-architecture.md)
  styles/
    tokens.css      SOURCE DE VÉRITÉ des tokens (@theme Tailwind v4)
    global.css      base + classes de marque (.section-label, .card, .on-dark…)
public/             favicon.svg, og-image, robots.txt
server/             API Express + MongoDB (models/, routes/, seed/)
Dockerfile, server/Dockerfile, compose.yaml, nginx.conf   déploiement Dokploy
```

## Règles absolues (design)
- **Jamais de valeur en dur** (hex, px de police, ombres). Uniquement les tokens de `tokens.css`.
  Besoin d'un nouveau token ? L'ajouter dans `tokens.css` + le documenter dans `docs/03-design-system.md`.
- **Le cobalt est rare.** Un seul bouton primaire cobalt visible par écran. Le cobalt sert à :
  l'action principale, le point de « umut. », le tracé du logo, l'élément actif, les données mises en avant.
  Jamais en grand aplat de fond de section, jamais en dégradé.
- **Cobalt sur fond graphite = `cobalt-400` (#7A9BFF)**, jamais `cobalt-500` (contraste 2,6:1 ❌).
- **Angles droits partout** (`rounded-none`). Seules exceptions : icône d'app, pastilles d'état rondes.
- **Pas d'ombres portées.** La profondeur vient des filets 1 px (`line` / `graphite`) et des contrastes de fond.
- **Monospace (Space Mono)** pour : chiffres, kg, reps, prix, dates, numérotation `01 / 02`, labels, tags,
  liens tertiaires `[ en savoir plus ]`. **Space Grotesk** pour titres et texte courant.
- Titres en Space Grotesk 700 avec approche négative (déjà dans les tokens `text-h1`, `text-display`…).
- `muted` (#9A9A9A) = décoratif uniquement sur fond clair (2,8:1). Texte secondaire = `mesure` (#5E5E5E).
- Logos : utiliser les SVG de `src/assets/brand/`. Le wordmark en HTML (`umut<span class="brand-dot">.</span>`)
  est autorisé dans le header/footer uniquement.

## Règles absolues (contenu & éthique)
- **Ne jamais inventer** de témoignages, avis, chiffres de résultats, diplômes, prix ou photos avant/après.
  Utiliser des placeholders visibles `[À CONFIRMER]` et les lister dans `docs/05-decisions.md`.
  Cela vaut aussi pour les données de seed de l'API.
- Photos de transformation : seulement avec consentement écrit du client (mentionné dans la donnée).
- Pas d'allégations santé (« perdez 10 kg en 1 mois ») — ton factuel, mesurable, sans promesse miracle.

## Règles de code
- Composants `.astro` petits et typés (`interface Props`). Variantes via props, pas via classes ad hoc.
- HTML sémantique : un seul `<h1>` par page, `<nav aria-label>`, `<main id="contenu">`, lien d'évitement.
- Accessibilité **WCAG 2.2 AA** : contrastes (voir tableau dans le design system), focus visible
  (déjà global), cibles ≥ 44 px, menu mobile au clavier (Échap ferme, focus piégé, `aria-expanded`).
- `prefers-reduced-motion` respecté (déjà global). Animations : opacité/transform/stroke uniquement.
- Performance : Lighthouse ≥ 95 partout, 0 JS par défaut, pas de lib d'animation, pas de carrousel lourd.
- Mobile-first. Tester à 360, 768, 1024, 1280, 1440 px.
- Pas de dépendance ajoutée sans la justifier dans `docs/05-decisions.md`.
- Langue : `lang="fr"`. Textes UI en français, typographie française (espace fine avant `: ; ! ?` via `&nbsp;`/`&#8239;`, guillemets « »).

## Définition de « terminé » pour une page
- [ ] Respecte `docs/03-design-system.md` (lancer `/design-review`)
- [ ] `pnpm build` et `pnpm check` sans erreur (et `cd server && pnpm build` si l'API a changé)
- [ ] Responsive vérifié aux 5 largeurs, menu mobile OK au clavier
- [ ] Meta title/description, OG, canonical
- [ ] Aucun texte inventé ; placeholders listés
