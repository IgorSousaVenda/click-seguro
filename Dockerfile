# syntax=docker/dockerfile:1

# ── Dependências ────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./

# A descarga de pacotes falha por TLS em redes instáveis; as tentativas
# repetidas evitam ter de recomeçar a construção inteira.
RUN npm config set fetch-retries 6 \
 && npm config set fetch-retry-mintimeout 4000 \
 && npm config set fetch-retry-maxtimeout 90000 \
 && npm config set fetch-timeout 900000 \
 && npm ci --no-audit --no-fund

# ── Compilação ──────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Uma base já migrada e com o conteúdo pedagógico dentro, guardada na
# imagem. O arranque copia-a para o volume quando este está vazio, o que
# evita ter de levar o tsx e os scripts de sementeira para produção.
ENV DATABASE_URL="file:/app/semente.db"
RUN npx prisma migrate deploy && npm run db:seed

# ── CLI do Prisma para produção ─────────────────────────────
# A saída "standalone" traz apenas o que a aplicação importa, e o CLI do
# Prisma tem dependências próprias. Instalá-lo isolado é mais fiável do
# que extrair módulos avulsos da fase de compilação.
FROM node:22-alpine AS cli
WORKDIR /cli
RUN npm config set fetch-retries 6 \
 && npm config set fetch-retry-mintimeout 4000 \
 && npm config set fetch-timeout 900000 \
 && npm init -y > /dev/null \
 && npm install --no-audit --no-fund --omit=dev prisma@7.10.0 dotenv@17.4.2

# ── Execução ────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV CAMINHO_BD=/dados/click-seguro.db

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# A saída "standalone" não traz public nem .next/static; copiam-se à mão.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Só o necessário para aplicar migrações no arranque, fora da árvore de
# módulos da aplicação para não colidir com a saída "standalone".
COPY --from=builder /app/prisma/schema.prisma /migrador/prisma/schema.prisma
COPY --from=builder /app/prisma/migrations /migrador/prisma/migrations
COPY --from=cli /cli/node_modules /migrador/node_modules
COPY docker/prisma.config.ts /migrador/prisma.config.ts

COPY --from=builder --chown=nextjs:nodejs /app/semente.db ./semente.db
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh \
 && mkdir -p /dados && chown nextjs:nodejs /dados

USER nextjs
EXPOSE 3000
VOLUME ["/dados"]

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
