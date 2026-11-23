# Plan de construction avec Claude Code

Une phase = une session (ou un `/clear`) = un commit. Copier-coller le prompt de chaque phase.
Après chaque phase : `pnpm build`, vérifier dans le navigateur, puis `/design-review`.

## État au 24/11/2026 — reprendre ici

| Phase | État |
|---|---|
| 0 → 3 | ✅ Faites |
| 3b Admin | ✅ Faite et testée de bout en bout (connexion, offres, ordre, masquer, témoignages avec consentement, upload photo, infos, messages) |
| 4 Accueil | ✅ Faite (sections dans `src/components/sections/`, `ProgramCard`, `PricingCard`, OG + JSON-LD). **Reste les corrections de la revue design ci-dessous** |
| 5 → 7 | ⏳ À faire |

Réponses du client (Google doc du 23/11/2026) reportées dans `05-decisions.md` (D13–D19) et `04-contenu.md`.
Questions encore ouvertes : Q12–Q20 dans `05-decisions.md` (prix, diplôme / carte pro, mentions légales, ville et salle, domaine…).

### À faire en premier (revue design de l'accueil, non corrigée)
- [ ] `src/components/sections/Hero.astro` : H1 en `text-display` → le design system prévoit `text-h1` (le titre passe sur 3 lignes à 1280 px au lieu de 2). Corriger, ou documenter l'exception dans `03-design-system.md`.
- [ ] `src/components/sections/Results.astro` : `alt` vide possible sur la photo d'un témoignage → repli `` `Photo de ${t.name}` ``.
- [ ] Espaces insécables manquantes avant `:` / `kg` : `Hero.astro` (`title` du graphique), `ui/ProgramCard.astro` (`aria-label`), `pages/index.astro` (meta description).
- [ ] (Phase 5) Les conditions de `PricingPreview.astro` (annulation, paiement, TVA) sont en dur : les rendre éditables dans « Infos du site » en faisant `/tarifs`.

### Ensuite
- Phase 5 (pages internes) : les liens de l'accueil pointent déjà vers `/methode`, `/programmes`, `/programmes/[slug]`, `/tarifs`, `/a-propos`, `/reserver` (encore en 404). `/reserver` = **formulaire de contact + téléphone / WhatsApp / e-mail, sans agenda** (D16), le formulaire poste sur `/api/messages`.
- Les sections prennent un prop `index` : la page calcule la numérotation (pas de trou quand une section est masquée), voir `src/pages/index.astro`.

### Environnement de dev (à savoir)
- **Node ≥ 22.23 obligatoire** (Astro 7). Le Node système est en 22.14 : `fnm use 22` (Node 22.23.5 installé avec fnm) avant `pnpm dev` / `pnpm check`.
- **Ne pas déclencher de fenêtre du pare-feu Windows** : tout serveur de test doit écouter sur `127.0.0.1` uniquement (`astro dev --host 127.0.0.1` ; l'API écoute sur toutes les interfaces par défaut, la lancer avec un `--import` qui force `127.0.0.1` ou ajouter une variable `HOST` à `server/src/index.ts`). Arrêter les serveurs après chaque test.
- Pas de MongoDB local ni Docker démarré : pour tester, base jetable `mongodb-memory-server` (hors du projet) sur `127.0.0.1:27999`, puis `seed:content` et `seed:user`.

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
