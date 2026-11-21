# Astro site, rendered on the server (@astrojs/node standalone)

FROM node:24-alpine AS builder
WORKDIR /app
# pnpm pinned to the version the lockfile was generated with
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Canonical URLs and the sitemap are built from it
ARG SITE_URL=https://umut.example
ENV SITE_URL=$SITE_URL
RUN pnpm run build

FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
ENV HOST=0.0.0.0 PORT=4321 NODE_ENV=production
USER node
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
