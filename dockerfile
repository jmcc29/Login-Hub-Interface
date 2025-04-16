FROM node:22.14-alpine3.20

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .