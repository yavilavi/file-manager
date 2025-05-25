# Etapa base común
FROM node:22.15.1-slim AS base
RUN apt-get update -y && apt-get install -y openssl curl wget && \
    npm i -g pnpm@10.11.0 prisma@6.5.0

# Etapa de dependencias y build
FROM base AS builder
WORKDIR /usr/app

# Copiamos primero solo para aprovechar la cache de Docker
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Build
RUN pnpm build

# Etapa final: solo runtime
FROM base AS runner
WORKDIR /usr/app

ARG NODE_ENV=production
ARG PORT=3000

ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV

COPY --from=builder /usr/app/dist ./dist/
COPY --from=builder /usr/app/package.json ./package.json
COPY --from=builder /usr/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/app/prisma ./prisma

RUN pnpm install --prod --frozen-lockfile

EXPOSE $PORT
ENTRYPOINT ["pnpm"]
CMD ["start:prod"]
