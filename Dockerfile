FROM node:22.14.0-slim AS base
RUN npm i -g pnpm@10.6.5
RUN apt-get update -y && apt-get install -y openssl curl wget

FROM base AS builder
WORKDIR /usr/app

ARG DB_URL
ENV DB_URL=$DB_URL

RUN npm i -g @nestjs/cli@11.0.0

COPY . .

RUN pnpm install
RUN pnpm build

RUN prisma migrate status
RUN prisma migrate deploy

FROM base AS dependencies
WORKDIR /usr/app
RUN npm i -g prisma 

COPY package.json .
COPY pnpm-lock.yaml .
COPY prisma/. ./prisma/

RUN pnpm --prod install
RUN prisma generate

FROM base AS runner
WORKDIR /usr/app

ARG NODE_ENV=production
ARG PORT=3000

ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV

COPY --from=BUILDER /usr/app/dist ./dist/

COPY --from=DEPENDENCIES /usr/app/package.json ./package.json
COPY --from=DEPENDENCIES /usr/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=DEPENDENCIES /usr/app/node_modules ./node_modules
COPY --from=DEPENDENCIES /usr/app/prisma ./prisma

EXPOSE $PORT
ENTRYPOINT ["pnpm"]
CMD ["start:prod"]
