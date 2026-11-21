# Décisions & questions ouvertes

## Décisions prises
| # | Décision | Raison |
|---|---|---|
| D1 | Identité **06 Performance lab · Bleu cobalt** (#1F4FD8, sur sombre #7A9BFF) | Choix client |
| D2 | **Astro** en rendu serveur (`@astrojs/node`) + TypeScript | HTML complet pour le SEO, 0 JS par défaut, et contenu lu dans l'API à chaque requête pour qu'Umut l'édite sans redéploiement (remplace le statique + Markdown du kit, 21/11/2026) |
| D3 | **Tailwind v4**, tokens dans `tokens.css` (`@theme`) | Les tokens du design deviennent directement les utilitaires ; une seule source de vérité |
| D4 | **Multi-pages** + accueil longue | SEO local par intention, liens partageables, évolutif (voir architecture) |
| D5 | Pas de React/Vue | Aucune interactivité lourde ; menu, FAQ, agenda = vanilla/HTML natif |
| D6 | Polices via Fontsource (auto-hébergées) | RGPD/nLPD (pas d'IP envoyée à Google), perf |
| D7 | Widgets tiers en façade « au clic » | Pas de cookies tiers sans action, perf |
| D8 | Témoignages : consentement obligatoire dans le schéma (Mongoose `consent` requis et `true`) | Impossible de publier sans consentement |
| D9 | **API Express 5 + MongoDB** (`server/`), admin `/admin` | Umut modifie lui-même prix, programmes, FAQ, témoignages, photos et infos. Même architecture que portfolioFreelance (auth JWT, CRUD générique, uploads sharp) |
| D10 | **Dokploy sur VPS** : `docker-compose.yml` avec `nginx` (entrée, port 80) → `web` (Astro, 4321) + `api` (4000), volume `uploads` | Même hébergement que les autres projets ; `/api` sur la même origine, donc pas de CORS |
| D11 | `/admin` en pages Astro + scripts vanilla, sans React | Respecte D5 ; quelques formulaires CRUD ne justifient pas un framework |
| D12 | Contenu de départ chargé par `seed:content` (idempotent) ; programme Nutrition créé **masqué** (Q4) ; aucun témoignage | Ne jamais inventer ; les modifications faites dans `/admin` ne sont jamais écrasées |

## Questions à poser au client (bloquantes avant mise en ligne)
| # | Question | Impact | Hypothèse par défaut |
|---|---|---|---|
| Q1 | Ville / pays (Suisse ? France ?) et salle(s) | Devise, mentions légales (nLPD vs RGPD), SEO local | Suisse, CHF |
| Q2 | Outil de réservation : Cal.com, Calendly, autre (Resalib, Zenchef…) ? Paiement en ligne à la réservation ? | Page /reserver | Cal.com (gratuit, intégrable, Stripe possible) |
| Q3 | Liste et contenu exact des programmes + prix | Content collection `programmes` | 4 programmes du doc contenu |
| Q4 | Habilitation nutrition (diplôme) ? | Programme « nutrition » affiché ou non | Masqué tant que non confirmé |
| Q5 | Témoignages / avant-après avec consentement écrit ? | Section Résultats | Section masquée |
| Q6 | Photos pro d'Umut disponibles ? Shooting prévu ? | Hero, À propos | Hero version « carte data » sans photo |
| Q7 | Tutoiement ou vouvoiement ? | Tout le copywriting | Tu dans les accroches, vous dans le pratique |
| Q8 | Langues : FR seul ? DE / TR / EN plus tard ? | i18n | FR seul, structure prête |
| Q9 | Nom de domaine (umut-coach.ch ? umut.fit ?) et e-mail pro | Canonical, sitemap, formulaire | — |
| Q10 | Outil de suivi en ligne utilisé (app, Google Sheets, Trainerize…) | FAQ, page suivi en ligne | `[outil]` |
| Q11 | Réseaux sociaux à afficher | Footer, à propos | Instagram |

## Choix techniques à trancher (non bloquants pour démarrer)
| # | Sujet | Options | Reco |
|---|---|---|---|
| T1 | Hébergement | ~~Netlify · Cloudflare Pages~~ | **Tranché : Dokploy (D10)** |
| T2 | Formulaire | Route de l'API (stockage MongoDB + notification e-mail) · Formspree | Route de l'API, messages visibles dans `/admin` |
| T3 | Analytics | Plausible (payant, UE) · Umami (gratuit, auto-hébergé) | Plausible |
| T4 | Édition par le client | ~~Markdown · Keystatic~~ | **Tranché : admin + API (D9)** |
| T5 | MongoDB | Base créée dans Dokploy · MongoDB Atlas | Base Dokploy sur le même VPS (sauvegardes Dokploy à activer) |

## Journal des dépendances ajoutées
| Paquet | Pourquoi |
|---|---|
| astro, @astrojs/sitemap, @astrojs/check, typescript | socle |
| tailwindcss, @tailwindcss/vite | styles |
| @fontsource/space-grotesk, @fontsource/space-mono | polices |
| @astrojs/node | rendu serveur (D2) |
| prettier, prettier-plugin-astro | formatage |
| **API** : express, mongoose, jsonwebtoken, bcryptjs, express-rate-limit | socle de l'API (D9), repris de portfolioFreelance |
| **API** (Phase 3) : multer, sharp | upload et compression des photos |
