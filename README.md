# Click Seguro

WebApp de microaprendizagem em cibersegurança para estudantes do ISAF,
centrada em phishing e engenharia social.

Trabalho de Conclusão de Curso — Igor Sousa Venda, nº 223718
Informática de Gestão Financeira, ISAF

---

## O percurso

1. **Registo** com consentimento informado e confirmação do e-mail por código
2. **Diagnóstico** de dez perguntas, que mede o ponto de partida
3. **Nivelamento**: o resultado decide por que módulo se começa
4. **Módulos e lições** curtas, com quiz de mestria a 70% por lição
5. **Simulações** em conversa ramificada: SMS, e-mail, chamada, WhatsApp
6. **Avaliação final**, que repete a medição
7. **Progresso**, com a comparação antes e depois

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

## Pôr a correr

Precisas de Node.js 22 ou superior, npm e Git.

```bash
git clone https://github.com/IgorSousaVenda/click-seguro.git
cd click-seguro
npm install
cp .env.example .env
```

Gera o segredo e põe-no no `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Cria a base de dados e insere o conteúdo:

```bash
npm run db:migrate
npm run db:generate
npm run db:seed
npm run dev
```

Abre http://localhost:3000

## Comandos

| Comando               | Efeito                                    |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Servidor de desenvolvimento               |
| `npm run verificar`   | Tipos, lint e build, por esta ordem        |
| `npm run db:migrate`  | Aplica as migrações                        |
| `npm run db:seed`     | Insere módulos, lições, quizzes, simulações |
| `npm run db:studio`   | Interface visual da base de dados          |
| `npm run docker:build`| Constrói a imagem de produção              |

## Documentação

| Ficheiro                                 | Assunto                            |
| ---------------------------------------- | ---------------------------------- |
| [docs/AUTENTICACAO.md](docs/AUTENTICACAO.md) | Entrada por palavra-passe e por código |
| [docs/DESIGN.md](docs/DESIGN.md)         | Tokens, componentes, acessibilidade |
| [docs/DEPLOY.md](docs/DEPLOY.md)         | Publicação na VPS com Traefik       |
| [docs/LEVANTAMENTO.md](docs/LEVANTAMENTO.md) | Estado técnico e problemas encontrados |
| [docs/PLANO-2H.md](docs/PLANO-2H.md)     | Plano de execução e o que ficou de fora |
| [CONTRIBUTING.md](CONTRIBUTING.md)       | Fluxo de trabalho e regras do produto |

## Estrutura

```
prisma/
  schema.prisma        Modelo de dados
  cliente-semente.ts   Ligação partilhada pelos scripts de sementeira
  seed*.ts             Conteúdo inicial
src/
  app/
    (landing)/         Página pública
    (auth)/            Registo, entrada e recuperação
    (app)/             Área autenticada, protegida no servidor
    api/auth/          Endpoints do Better Auth
    globals.css        Tokens do sistema de design
  components/
    ui/                Botão, campo, selecção, alerta, código
  lib/
    auth.ts            Better Auth e plugin de código por e-mail
    email.ts           Nodemailer, com recurso à consola
    email-modelos.ts   Modelos HTML dos e-mails
    db.ts              Cliente Prisma
    sessao.ts          Leitura e exigência de sessão
    acesso.ts          Regras de desbloqueio de módulos
    glossario.ts       Termos técnicos
    validacoes.ts      Esquemas Zod
docker/
  prisma.config.ts     Configuração usada só dentro do contentor
```

## Testar noutro dispositivo da mesma rede

Descomenta no `.env`:

```
ORIGENS_DEV="192.168.0.115"
ORIGENS_CONFIAVEIS="http://192.168.0.115:3000"
```

Usa o IP que o `npm run dev` mostra em `Network:`. As variáveis só são
lidas no arranque, por isso reinicia o servidor depois de as mudar.

## Notas de segurança

- Palavras-passe cifradas pelo Better Auth, nunca guardadas em texto simples
- Códigos de verificação guardados cifrados, com validade de dez minutos
- Limite de três pedidos de código por minuto e cinco tentativas por código
- Área autenticada protegida no servidor, antes de qualquer HTML ser enviado
- Mensagens de erro genéricas no login, para impedir enumeração de contas
- Validação de origem activa contra CSRF
- Mínimo de 10 caracteres, com maiúsculas, minúsculas e dígitos
- Cabeçalhos de segurança aplicados pelo Traefik em produção

## Limitações assumidas

- O envio de e-mail precisa de credenciais SMTP; sem elas o código sai nos
  registos do servidor, o que chega para desenvolver e demonstrar
- Indicadores de phishing guardados como texto JSON, porque o SQLite não
  tem arrays nativos
- Medalhas, cenários de phishing e registo de auditoria estão modelados no
  esquema mas ainda não são usados pela aplicação
- Sem testes automatizados nem observabilidade; a justificação consta do
  [CONTRIBUTING.md](CONTRIBUTING.md)
- Análise longitudinal do comportamento fica para trabalhos futuros
