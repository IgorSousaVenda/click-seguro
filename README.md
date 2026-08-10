# Click Seguro

WebApp de microaprendizagem em cibersegurança para estudantes do ISAF,
centrada em phishing e engenharia social.

Trabalho de Conclusão de Curso — Igor Sousa Venda, nº 223718
Informática de Gestão Financeira, ISAF

---

## Tecnologias

| Camada        | Escolha                            |
| ------------- | ---------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack) |
| Linguagem     | TypeScript                         |
| Base de dados | SQLite via adaptador libSQL        |
| ORM           | Prisma 7                           |
| Autenticação  | Better Auth                        |
| Estilos       | Tailwind CSS v4                    |
| Validação     | Zod + React Hook Form              |
| Gráficos      | Recharts                           |
| Ícones        | lucide-react                       |

## Requisitos

- Node.js 22 LTS ou superior
- npm
- Git

## Instalação num computador novo

```bash
git clone https://github.com/IgorSousaVenda/click-seguro.git
cd click-seguro
npm install
```

Cria um ficheiro `.env` na raiz:

```
DATABASE_URL="file:./dev.db"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="<gerar - ver abaixo>"
```

Gera o segredo com:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Cria a base de dados e insere o conteúdo inicial:

```bash
npx prisma migrate deploy
npx prisma generate
npx tsx prisma/seed.ts
```

Arranca:

```bash
npm run dev
```

Abre http://localhost:3000

## Comandos úteis

| Comando                                | Efeito                              |
| -------------------------------------- | ----------------------------------- |
| `npm run dev`                          | Servidor de desenvolvimento         |
| `npx prisma studio`                    | Interface visual da base de dados   |
| `npx prisma migrate dev --name <nome>` | Nova migração após alterar o schema |
| `npx tsx prisma/seed.ts`               | Repõe módulos e perguntas           |

## Estrutura

```
prisma/
  schema.prisma      Modelo de dados (14 entidades)
  seed.ts            Módulos e perguntas iniciais
src/
  app/
    (auth)/          Registo e entrada
    (app)/           Área autenticada, protegida no servidor
    api/auth/        Endpoints do Better Auth
  components/        Componentes reutilizáveis
  lib/
    auth.ts          Configuração do Better Auth
    db.ts            Cliente Prisma (instância única)
    sessao.ts        Leitura da sessão no servidor
    glossario.ts     Definições dos termos técnicos
    validacoes.ts    Esquemas Zod
```

## Testar noutro dispositivo na mesma rede

O endereço IP da máquina muda entre redes. Quando isso acontece:

1. Vê o IP na linha `Network:` mostrada pelo `npm run dev`
2. Atualiza `DEV_ORIGIN` no `.env`
3. Atualiza `allowedDevOrigins` no `next.config.ts`
4. Reinicia o servidor

Variáveis de ambiente só são lidas no arranque.

## Problemas conhecidos

**`INVALID_ORIGIN` (403) ao registar ou entrar**
O endereço usado não consta em `trustedOrigins`. Usa `localhost:3000`
ou segue a secção acima.

**`no such table: main.user`**
Existe um `dev.db` vazio em `prisma/`. A base de dados correta está na
raiz do projeto. Apaga o ficheiro duplicado.

**Alterações ao `.env` sem efeito**
Reinicia o servidor.

## Notas de segurança

- Palavras-passe cifradas pelo Better Auth (nunca guardadas em texto simples)
- Área autenticada protegida no servidor, antes de qualquer HTML ser enviado
- Mensagens de erro genéricas no login, para impedir enumeração de contas
- Validação de origem ativa contra CSRF
- Mínimo de 10 caracteres, com maiúsculas, minúsculas e dígitos

## Limitações assumidas

- Sem verificação de e-mail (não há servidor de correio configurado)
- Indicadores de phishing guardados como texto JSON — o SQLite não suporta
  arrays nativos
- Análise longitudinal do comportamento dos utilizadores fica para
  trabalhos futuros
