# 1. Build Stage
FROM node:24-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

# 2. Production Runner Stage
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:./dev.db"

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
