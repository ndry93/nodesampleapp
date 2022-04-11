FROM node:16 AS base

# Builder
FROM base AS builder

ARG NPM_TOKEN
WORKDIR /app
COPY --chown=app:app package*.json ./
RUN set -ex; \
    npm clean-install; \
    npm cache clean --force;
COPY --chown=app:app . ./
RUN npm run build

# Deps Builder
FROM base AS deps-builder

ARG NPM_TOKEN
WORKDIR /app
COPY --chown=app:app package*.json ./
RUN set -ex; \
    npm clean-install --only=production; \
    npm cache clean --force;

# Dist
FROM base AS dist

WORKDIR /app
COPY --chown=app:app --from=deps-builder /app/node_modules ./node_modules
COPY --chown=app:app --from=builder /app/dist ./dist
COPY --chown=app:app --from=builder /app/docs ./docs
EXPOSE 3000
CMD ["node", "dist/src/server.js"]
