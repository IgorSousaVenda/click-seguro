# Plano de execução — 2 horas

Objetivo: aplicação coerente, rápida e publicada num subdomínio com
Traefik, sem tocar na lógica pedagógica que já funciona.

## Etapa 0 — Destravar (feita)

- [x] Criado `.env` com `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`
- [x] Removidas `@mermaid-js/mermaid-cli` e `prisma-erd-generator`
      (arrastavam Chromium; a descarga falhava e desfazia a instalação inteira)
- [x] Aprovados os scripts de instalação do Prisma e do esbuild (npm 11)
- [x] `npm install`, `prisma generate` e `npm run build` a passar

O diagrama ERD do relatório deixa de estar no projeto. Gera-se quando for
preciso, sem o instalar:
`npx -y prisma-erd-generator` com o gerador declarado no schema, ou a
ferramenta de diagramas que preferires.

## Etapa 1 — Fundações visuais (~30 min)

Uma só fonte de verdade para cor, espaço e forma.

- [x] `globals.css` sem o conteúdo duplicado
- [x] Tokens completos no `@theme` do Tailwind v4: superfícies, texto,
      acento, estados de sucesso/erro/aviso, raios e sombras
- [x] Eliminar `src/app/page.tsx` (duplicado de `(landing)/page.tsx`)
- [x] Corrigir `ui/botao.tsx` e `ui/campo.tsx` contra os tokens reais
- [x] Vídeo de fundo sai do layout raiz e fica só na landing

## Etapa 2 — Interface escura coerente (~40 min)

Decisão tomada: paleta navy/cream/blush em toda a aplicação.

- [x] Layout autenticado em superfície escura, sem o cartão branco
- [x] Substituir `style={{}}` em linha por classes com tokens
- [x] Substituir os hexadecimais soltos (`#1668D9`, `#17864F`, `#C4302B`)
      pelos tokens de acento, sucesso e perigo
- [x] Navegação com estado ativo visível
- [ ] Verificar contraste do texto longo sobre fundo escuro

## Etapa 3 — Pronto para a VPS (~25 min)

- [x] `src/lib/db.ts` passa a ler `DATABASE_URL`
- [x] `src/lib/auth.ts` passa a ler `BETTER_AUTH_URL` para os `trustedOrigins`
- [x] `output: "standalone"` no `next.config.ts`
- [x] `Dockerfile` multi-etapa
- [x] `compose.yaml` com etiquetas Traefik e volume para a base de dados
- [x] `.env.example` e `docs/DEPLOY.md`
- [x] `dev.db` deixa de ser versionada

## Etapa 4 — Verificação (~15 min)

- [x] `npm run build` sem erros
- [x] `npm run lint` sem erros
- [ ] Percurso à mão: registo → diagnóstico → lição → quiz → simulação →
      avaliação final → progresso
- [ ] Ver em largura de telemóvel

## Fora do âmbito destas 2 horas

Registado para não se perder, não para se fazer agora:

- Medalhas e gamificação (modeladas no esquema, nunca implementadas)
- Cenários de phishing (`cenario_phishing` está vazia)
- Registo de auditoria (`registo_auditoria` está vazia)
- Testes automatizados
- Observabilidade
