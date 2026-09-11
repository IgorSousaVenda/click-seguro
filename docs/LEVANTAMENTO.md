# Levantamento técnico — Click Seguro

Data: 2026-09-11. Estado analisado: commit `7db0d8f`.

## 1. O que é

WebApp de microaprendizagem em cibersegurança (phishing e engenharia social)
para estudantes do ISAF. Trabalho de Conclusão de Curso de Igor Sousa Venda.

O percurso pedagógico é o produto:

1. **Registo** com consentimento informado
2. **Diagnóstico** — 10 perguntas que medem o nível de partida
3. **Nivelamento adaptativo** — o resultado decide por que módulo se começa
   (<35% → módulo 1; 35–70% → pode saltar para o 2; ≥70% → pode saltar para o 3)
4. **Módulos e lições** — conteúdo curto, com quiz de mestria a 70% por lição
5. **Simulações** — conversas ramificadas em SMS, e-mail, chamada e WhatsApp
6. **Avaliação final** — repete a medição para comparar antes/depois
7. **Progresso** — gráfico de evolução

## 2. Pilha tecnológica

| Camada     | Escolha                            |
| ---------- | ---------------------------------- |
| Framework  | Next.js 16.3 (App Router)          |
| Runtime    | React 19.2, TypeScript 5           |
| Base dados | SQLite via adaptador libSQL        |
| ORM        | Prisma 7.9                         |
| Auth       | Better Auth 1.6                    |
| Estilos    | Tailwind CSS v4                    |
| Validação  | Zod 4 + React Hook Form            |
| Gráficos   | Recharts 3                         |
| Ícones     | lucide-react                       |

## 3. Conteúdo real já carregado

A base `dev.db` não está vazia. Tem conteúdo pedagógico a sério:

| Entidade            | Registos |
| ------------------- | -------- |
| Módulos             | 3        |
| Lições              | 9        |
| Perguntas           | 64       |
| Opções              | 256      |
| Simulações          | 6        |
| Nós de simulação    | 38       |
| Escolhas            | 43       |
| Utilizadores (teste)| 10       |

Modeladas mas nunca preenchidas: `medalha`, `medalha_utilizador`,
`cenario_phishing`, `registo_auditoria`. A gamificação existe no esquema
e não existe na aplicação.

## 4. Problemas encontrados

### Bloqueiam o arranque

- **Sem ficheiro `.env`.** A aplicação não arranca num clone limpo.
- **`node_modules` estava incompleto** (sem `.bin`).
- **Rota `/` duplicada.** `src/app/page.tsx` e `src/app/(landing)/page.tsx`
  resolvem ambos para `/`. São 480 linhas quase idênticas, duplicadas.

### Bloqueiam a publicação na VPS

- **`src/lib/db.ts` ignora `DATABASE_URL`** e aponta para
  `process.cwd()/dev.db` em código. Num contentor isto escreve num caminho
  efémero — os dados desaparecem a cada redeploy.
- **`src/lib/auth.ts` tem `trustedOrigins` fixos** em `localhost:3000` e
  `192.168.0.115:3000`. No domínio real qualquer login devolve 403.
- **`next.config.ts` sem `output: "standalone"`**, obrigatório para uma
  imagem Docker pequena.
- **Sem Dockerfile, sem compose, sem etiquetas Traefik.**
- **`dev.db` versionada no Git** apesar de `*.db` estar no `.gitignore`
  (foi adicionada antes da regra). Em produção tem de viver num volume.

### Qualidade do front-end

O maior problema, e o que dá o ar de projeto não acabado:

- **Três sistemas de estilo em simultâneo.** Tailwind com tokens, `style={{}}`
  em linha (9 ficheiros) e blocos `<style>` com CSS em texto (2 ficheiros).
- **Cores escritas à mão em todo o lado.** `#1668D9` aparece 28 vezes,
  `#17864F` 31 vezes, `#C4302B` 12 vezes. Nenhuma está definida como token.
- **`globals.css` tem o conteúdo inteiro duplicado** — o mesmo `:root`,
  o mesmo `body`, a mesma `@keyframes`, dois blocos iguais seguidos.
- **`ui/botao.tsx` e `ui/campo.tsx` estão partidos e não são usados.**
  Referem `bg-brand-500`, `rounded-btn`, `text-danger` — tokens que não
  existem no `@theme`. Renderizariam sem estilo.
- **Duas paletas em conflito.** A área pública é escura (navy/cream/blush),
  a área autenticada é um cartão branco com azul e verde. Parecem dois
  produtos diferentes.
- **Vídeo de fundo de 1,6 MB em autoplay no layout raiz**, ou seja em todas
  as páginas, incluindo a área autenticada, onde está por baixo de um cartão
  branco opaco. É peso puro.
- **CSS em `<style>` dentro de componente cliente** obriga a `"use client"`
  a página inteira da landing, que não tem interatividade nenhuma.

### Dependências

- **`@mermaid-js/mermaid-cli` e `prisma-erd-generator`** arrastam Puppeteer e
  um Chromium inteiro. O `prisma-erd-generator` nem sequer está declarado no
  `schema.prisma` — é peso morto. Instalar demora minutos por causa disto.

## 5. O que está bem e não se mexe

- O domínio está modelado com cuidado e em português coerente.
- A proteção da área autenticada é feita no servidor, antes do HTML.
- A regra de mestria a 70% e o nivelamento adaptativo estão implementados
  e testados contra a base.
- O conteúdo pedagógico é real e específico, não é texto de preenchimento.
- `CONTRIBUTING.md` documenta decisões adiadas com justificação — raro e útil.
