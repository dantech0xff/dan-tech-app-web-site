# syntax=docker/dockerfile:1
#
# Production image for Dokploy (build type "Dockerfile", context "."): the static
# export served by unprivileged nginx on port 8080.
#
# A Dockerfile build sees neither Dokploy's Environment tab nor any .env file. The
# only build input is the optional Build Argument NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
# which Next inlines into the bundle; without it Subscribe falls back to email.

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Dependencies first, so a source change reuses the installed layer.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# Declared after the install: changing the value rebuilds the site, not node_modules.
ARG NEXT_PUBLIC_NEWSLETTER_ENDPOINT
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
