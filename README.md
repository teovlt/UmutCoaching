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
pnpm seed:content      # contenu de départ (programmes, FAQ), sans écraser l'existant
pnpm dev               # http://localhost:4000/api/health

# Site, dans un autre terminal
pnpm install
pnpm dev               # http://localhost:4321 · styleguide : /styleguide
```

## Scripts du site

| Script        | Rôle                                     |
| ------------- | ---------------------------------------- |
| `pnpm dev`    | serveur de développement                 |
| `pnpm build`  | build serveur dans `dist/`               |
| `pnpm start`  | lance le build (`dist/server/entry.mjs`) |
| `pnpm check`  | vérification des types (`astro check`)   |
| `pnpm format` | Prettier sur tout le projet              |

## Déploiement sur le VPS

### Avec Dokploy (sous-domaine)

1. **DNS** : un enregistrement `A` (ou `CNAME`) du sous-domaine, par ex. `umut.mondomaine.fr`, vers l'IP du VPS.
2. **Base** : créer une base **Mongo** dans le même projet Dokploy (utiliser son URI interne) ou une base Atlas (autoriser l'IP du VPS dans _Network Access_).
3. Application **Compose** pointant sur ce dépôt (branche `main`, fichier **`compose.yaml`**).
4. Onglet **Environment** : coller `.env.example` et remplir `SITE_URL` (l'URL du sous-domaine, en `https://`), `MONGODB_URI`, `JWT_SECRET` (`openssl rand -hex 32`).
5. Onglet **Domains** : le sous-domaine, **Service Name = `nginx`**, **Container Port = `80`**, HTTPS activé (Let's Encrypt).
6. Déployer. `nginx` est branché sur le réseau `dokploy-network` (déclaré dans `compose.yaml`) pour que Traefik le joigne — sans lui, « Bad Gateway ». `web` et `api` restent sur le réseau interne de la stack.
7. Après le premier déploiement, dans l'onglet **Terminal** du conteneur `api` (ou en SSH, `docker compose exec`) :
   ```bash
   node dist/seed/seedUser.js      # crée le compte admin (interactif)
   node dist/seed/seedContent.js   # contenu de départ, sans écraser l'existant
   # node dist/seed/seedContent.js --overwrite   # remet programmes, FAQ et infos seedés à leurs valeurs de départ
   ```

`SITE_URL` est lue au build : après l'avoir changée, redéployer. Les photos envoyées depuis l'admin sont stockées dans le volume `uploads` (conservé entre les déploiements).

**Dépannage**

- `Bad Gateway` : le domaine n'est pas rattaché au service `nginx` / port `80`, ou l'API ne joint pas MongoDB (voir les logs du service `api`).
- `querySrv ESERVFAIL` / `ETIMEOUT` : le DNS du VPS ne résout pas les URI `mongodb+srv://` ; utiliser la forme standard `mongodb://hote-00:27017,hote-01:27017,…/umut?ssl=true&replicaSet=…&authSource=admin` (Atlas › _Connect › Drivers_, ancienne version du driver Node).

### Sans Dokploy

Retirer `dokploy-network` de `compose.yaml` (service `nginx` et section `networks`), publier le port de `nginx` (`ports: ["127.0.0.1:8080:80"]`), créer `.env` à partir de `.env.example`, puis :

```bash
docker compose up -d --build
```

et placer un reverse proxy HTTPS devant (Caddy : `reverse_proxy 127.0.0.1:8080`). Dans ce cas, un seul proxy est devant nginx : `TRUST_PROXY: 2` reste correct.
