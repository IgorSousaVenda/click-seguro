#!/bin/sh
set -e

CAMINHO_BD="${CAMINHO_BD:-/dados/click-seguro.db}"
export DATABASE_URL="file:${CAMINHO_BD}"

mkdir -p "$(dirname "$CAMINHO_BD")"

# Primeiro arranque num volume novo: parte-se da base já semeada que veio
# na imagem. Nos arranques seguintes o volume manda, e o conteúdo que lá
# está — incluindo o progresso dos utilizadores — fica intacto.
if [ ! -f "$CAMINHO_BD" ]; then
  echo "Volume vazio. A instalar a base inicial em ${CAMINHO_BD}…"
  cp /app/semente.db "$CAMINHO_BD"
fi

echo "A aplicar migrações pendentes…"
cd /migrador
node ./node_modules/prisma/build/index.js migrate deploy
cd /app

exec "$@"
