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
| D13 | **France**, devise **EUR**, **RGPD** ; SEO local Bellegarde-sur-Valserine (+ Genève à trancher, Q14) | Réponses du client (Q1), 23/11/2026 |
| D14 | **Vouvoiement partout** (accroches comprises) | Choix du client (Q7) ; remplace l'hypothèse « tu / vous » |
| D15 | Site **FR d'abord** ; EN et TR prévus (le client coache en FR / TR / EN) | Q8 : l'i18n viendra après la mise en ligne FR, la structure doit la permettre |
| D16 | **Pas d'agenda en ligne** pour l'instant : `/reserver` = formulaire de contact + téléphone / WhatsApp / e-mail. `bookingUrl` reste vide (éditable dans `/admin` quand il aura un outil) | Q2 : il prend ses rendez-vous par message ; paiement surtout en espèces, pas de paiement en ligne |
| D17 | Offres affichées : **Coaching individuel** (salle) et **Coaching en ligne**. Créées **masquées** : Nutrition (avec Manon, Q4), Pré / post-natal (Q18). Préparation compétition retirée du seed (pas proposée) | Réponses Q11 / Q12 ; les offres masquées n'apparaissent qu'une fois leurs conditions confirmées |
| D18 | Bandeau chiffres : seul `24 h` (délai de réponse, confirmé) est affiché. Pas de « ans d'expérience » : Umut est coach débutant (4 ans de pratique personnelle du bodybuilding, ce qui n'est pas une expérience de coach) | Ne pas induire en erreur |

## Questions au client — réponses reçues (Google doc « umut. — What I need for your site », 23/11/2026)
| # | Question | Réponse |
|---|---|---|
| Q1 | Ville / pays, salle | **France** · Bellegarde ou Genève · salle : « peut-être Profit Valserhône » (non confirmé) |
| Q2 | Outil de réservation, paiement en ligne | Par message / téléphone / e-mail ; « bientôt » un outil. Paiement en ligne : ne sait pas, plutôt espèces |
| Q3 | Programmes et prix | Coaching 1:1 en salle, coaching en ligne (salle + distance), nutrition (en ligne), pré / post-natal. Prix : « entre 80 et 110 € ou CHF », **non fixés** |
| Q4 | Habilitation nutrition | « Manon est ma nutritionniste » → à préciser (Q15) |
| Q5 | Témoignages / avant-après | Pas encore · Non → section Résultats masquée |
| Q6 | Photos pro | **Oui** → fichiers à recevoir (WeTransfer / Drive) |
| Q7 | Tu / vous | **Vous partout** (D14) |
| Q8 | Langues | Coache en FR / TR / EN ; site FR / EN / TR (D15) |
| Q9 | Domaine, e-mail | Pas de domaine (« umut coaching ») ; e-mail : `umut.coachsportif@gmail.com` |
| Q10 | Outil de suivi en ligne | Google Sheets + WhatsApp, bilan **chaque dimanche**, réponse sous 24 h |
| Q11 | Réseaux | Instagram et TikTok `@umut.coachsportif` |
| — | Autres réponses | 1re séance = mensurations détaillées, infos, photo « avant » si possible · bilan inclus dans les offres · 1 à 2 séances / semaine · annulation gratuite jusqu'à 24 h avant, sinon séance due · paiement : espèces (préféré), virement · horaires lun–ven 09:00–18:00, sam 09:00–15:00 · WhatsApp : oui · spécialités : force, prise de masse, sèche · public : perte / prise de poids, muscle, force, posture ; débutants et amateurs |

## Questions ouvertes (bloquantes avant mise en ligne)
| # | Question | Impact | En attendant |
|---|---|---|---|
| Q12 | **Prix** de chaque offre, unité (séance, mois), remises (quotas « 5 premiers », remise espèces) | Cartes programmes, /tarifs | `dès [À CONFIRMER]` |
| Q13 | **Diplôme / carte professionnelle d'éducateur sportif** (en France, encadrer contre rémunération exige en principe un diplôme reconnu, art. L212-1 du Code du sport) | Légalité de l'activité, mentions légales, page À propos | Aucun titre affiché ; point à vérifier avec lui avant la mise en ligne |
| Q14 | Ville principale (Bellegarde ou Genève) et salle confirmée ; faut-il un abonnement à la salle ? | SEO local, adresse, FAQ | `[À CONFIRMER]` |
| Q15 | Nutrition : diplôme de Manon, qui facture, prix | Affichage du programme Nutrition | Masqué |
| Q16 | **Mentions légales** : statut (micro-entreprise ?), nom légal, SIRET, adresse, assurance RC pro, TVA (ex. « TVA non applicable, art. 293 B du CGI ») | Page /mentions-legales | Page avec `[À CONFIRMER]` |
| Q17 | Nom de domaine à choisir et acheter | Canonical, sitemap, e-mail pro | `umut.example` |
| Q18 | Pré / post-natal : formation spécifique ? format, prix | Affichage de l'offre (sujet santé sensible) | Masqué |
| Q19 | Offre « recommandée » (« pack coaching », à préciser), places disponibles (badge), durée du 1er bilan | /tarifs, badges | Aucun badge |
| Q20 | Parcours en 3–5 lignes, pourquoi il coache | À propos | `[À CONFIRMER]` |
## Choix techniques à trancher (non bloquants pour démarrer)
| # | Sujet | Options | Reco |
|---|---|---|---|
| T1 | Hébergement | ~~Netlify · Cloudflare Pages~~ | **Tranché : Dokploy (D10)** |
| T2 | Formulaire | Route de l'API (stockage MongoDB + notification e-mail) · Formspree | **Tranché** : route de l'API, messages visibles dans `/admin` (notification e-mail plus tard) |
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
