# umut. — site du coach Umut

Site vitrine et prise de rendez-vous pour Umut, coach musculation & bodybuilding.
Identité **06 « Performance lab » · Bleu cobalt**. Les règles de travail sont dans [CLAUDE.md](CLAUDE.md) et la documentation dans [docs/](docs/).

## Stack

- **Site** (`/`) : Astro 7 en rendu serveur (`@astrojs/node`), TypeScript strict, Tailwind CSS 4 (tokens dans `src/styles/tokens.css`), polices auto-hébergées
- **API** (`/server`) : Express 5, MongoDB (Mongoose), JWT pour l'admin
- **Prod** : Docker Compose déployé avec Dokploy. Le conteneur `nginx` relaie `/api` vers `api` et le reste vers `web` (Astro).

## Lancer en local

Prérequis : Node ≥ 22.23, pnpm 10 et une base MongoDB.

```bash
# API
cd server
cp .env.example .env   # renseigner MONGODB_URI et JWT_SECRET
pnpm install
pnpm seed:user         # crée le compte admin (interactif)
pnpm dev               # http://localhost:4000/api/health

# Site, dans un autre terminal
pnpm install
pnpm dev               # http://localhost:4321 · styleguide : /styleguide
```

## Scripts du site

| Script        | Rôle                                         |
| ------------- | -------------------------------------------- |
| `pnpm dev`    | serveur de développement                     |
| `pnpm build`  | build serveur dans `dist/`                   |
| `pnpm start`  | lance le build (`dist/server/entry.mjs`)     |
| `pnpm check`  | vérification des types (`astro check`)       |
| `pnpm format` | Prettier sur tout le projet                  |

## Déploiement (Dokploy)

1. Créer une application **Docker Compose** pointant sur ce dépôt (`docker-compose.yml`).
2. Créer une base MongoDB (dans Dokploy ou ailleurs) et renseigner dans l'onglet *Environment* :
   `SITE_URL`, `MONGODB_URI`, `JWT_SECRET` (voir `.env.example`).
3. Attacher le domaine au service **`nginx`**, port **80**.
4. Après le premier déploiement, créer le compte admin :
   ```bash
   docker compose exec -it api node dist/seed/seedUser.js
   ```

Les photos envoyées depuis l'admin sont stockées dans le volume `uploads`.
