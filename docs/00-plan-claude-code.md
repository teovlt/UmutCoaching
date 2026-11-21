# Plan de construction avec Claude Code

Une phase = une session (ou un `/clear`) = un commit. Copier-coller le prompt de chaque phase.
Après chaque phase : `pnpm build`, vérifier dans le navigateur, puis `/design-review`.

---

### Phase 0 — Initialisation
```
Lis CLAUDE.md et tous les fichiers de docs/. Initialise un projet Astro (dernière version stable,
template minimal, TypeScript strict) DANS ce dossier sans écraser CLAUDE.md, docs/, design-reference/,
src/styles/, src/assets/brand/ ni public/favicon.svg. Ajoute Tailwind v4 via @tailwindcss/vite,
@fontsource/space-grotesk, @fontsource/space-mono, @astrojs/sitemap, @astrojs/check.
Branche src/styles/global.css dans un BaseLayout.astro (lang="fr", meta, favicon SVG, lien d'évitement,
<main id="contenu">). Crée src/data/site.ts avec les infos globales en placeholders [À CONFIRMER].
Crée une page /styleguide (noindex) qui affiche toutes les couleurs, la typo et les logos de src/assets/brand.
Vérifie que pnpm build passe. Ne crée encore aucun composant métier.
```

### Phase 1 — Composants UI
```
Implémente les composants de docs/03-design-system.md §6 dans src/components/ui/ :
Button, Tag, StatusBadge, Field, SectionLabel, Metric, ProgressChart. Props typées, variantes
exactement comme le tableau, aucune couleur en dur. Ajoute-les tous dans /styleguide avec tous
leurs états (hover visible via une classe de démo, disabled, erreur, sur fond clair ET sur .on-dark).
Compare visuellement avec design-reference/06-bleu-cobalt.png.
```

### Phase 2 — Layout
```
Implémente Header (desktop + mobile), MobileMenu (plein écran graphite, accessible clavier :
Échap, piège de focus, aria-expanded, scroll bloqué) et Footer selon docs/02-architecture.md.
Lien actif en cobalt selon l'URL. Teste à 360, 768, 1024, 1280, 1440 px.
```

### Phase 3 — Contenu structuré (API)
```
Dans server/ : modèles Mongoose programmes, faqs, temoignages (consent requis = true), settings,
CRUD générique protégé par JWT, upload d'images (multer + sharp, volume uploads).
Script de seed avec les textes de docs/04-contenu.md, placeholders inclus. AUCUN témoignage.
Côté Astro : client typé src/lib/api.ts (API_URL), fusion avec src/data/site.ts si l'API ne répond pas.
```

### Phase 3b — Admin
```
/admin (noindex) : connexion, écrans Programmes & tarifs, FAQ, Témoignages, Photos, Infos du site,
Messages. Pages Astro + scripts vanilla, composants ui/ du design system.
```

### Phase 4 — Accueil
```
Construis la page d'accueil section par section (docs/02-architecture.md, tableau Accueil),
textes de docs/04-contenu.md. Composants sections/ dans src/components/sections/.
Section Résultats rendue seulement si la collection temoignages n'est pas vide.
Metric masqué si sa valeur est un placeholder. Une seule animation signature (ProgressChart).
```

### Phase 5 — Pages internes
```
Crée /methode, /programmes, /programmes/[slug], /tarifs, /a-propos, /reserver, /404,
/mentions-legales, /confidentialite selon docs/02-architecture.md. Pour /reserver, widget agenda
en façade chargée au clic (URL d'embed dans site.ts) + formulaire de repli accessible.
```

### Phase 6 — SEO, perf, a11y
```
Ajoute composant Seo (title, description, canonical, OG, Twitter), JSON-LD (Person,
ProfessionalService, Service par programme, FAQPage), sitemap, robots.txt, og-image 1200×630.
Audit : contraste, focus, ordre de tabulation, alt, un seul h1 par page. Vise Lighthouse ≥ 95.
Liste dans docs/05-decisions.md tous les placeholders encore présents (grep "À CONFIRMER").
```

### Phase 7 — Déploiement
```
Dokploy : docker-compose.yml (nginx → web + api, volume uploads) déjà en place depuis la Phase 0.
Ajouter : redirection www/non-www selon le domaine, en-têtes de sécurité (CSP), sauvegardes MongoDB,
formulaire branché. Rédige un guide d'utilisation de /admin pour Umut.
```
