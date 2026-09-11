# Autenticação

Três formas de entrar, todas assentes no Better Auth. Os códigos vivem na
base de dados, na tabela `verification`, não em memória.

## Porque não o microserviço Express

O código de referência guardava os códigos num `Map` em memória. Isso tem
três problemas que não se notam em desenvolvimento e doem em produção:

1. **Reiniciar o contentor apaga todos os códigos em curso.** Quem estava
   a meio de entrar fica de fora.
2. **Não funciona com mais do que uma instância.** O código gerado numa
   não é reconhecido pela outra.
3. **É um segundo serviço para publicar, vigiar e proteger**, com a sua
   própria porta e o seu próprio CORS.

O plugin `email-otp` do Better Auth faz o mesmo dentro da aplicação, grava
na base de dados e já vem ligado às sessões. O que se aproveitou do código
de referência foi o que lá estava bem: seis dígitos, validade de dez
minutos, limite de tentativas, o recurso ao Nodemailer e a degradação para
consola quando não há SMTP.

## Os três fluxos

### Entrar com palavra-passe

O que já existia. Mínimo de dez caracteres, com maiúscula, minúscula e
dígito. O erro é sempre "Credenciais inválidas", nunca distingue e-mail
inexistente de palavra-passe errada, para não permitir enumerar contas.

### Entrar com código

Em `/entrar`, separador **Código por e-mail**. Escreve-se o endereço,
chega um código de seis dígitos, entra-se sem palavra-passe.

O registo continua a fazer-se pelo formulário: `disableSignUp` está
activo, por isso um código nunca cria conta sozinho. É lá que se recolhe
o consentimento informado, o curso e o ano.

### Confirmar o e-mail no registo

Depois de criar conta, `/registo` passa ao passo de confirmação. Há um
atalho "Confirmar mais tarde", porque numa demonstração ao vivo não vale
a pena ficar preso à caixa de correio.

### Repor a palavra-passe

Em `/recuperar`: endereço, código, palavra-passe nova. Repor a
palavra-passe invalida as sessões antigas.

## Configuração

Em `src/lib/auth.ts`:

| Definição         | Valor      | Porquê                                     |
| ----------------- | ---------- | ------------------------------------------ |
| `otpLength`       | 6          | O mesmo do microserviço de referência       |
| `expiresIn`       | 600 s      | Dez minutos                                 |
| `allowedAttempts` | 5          | Depois disso o código morre                 |
| `storeOTP`        | `hashed`   | Quem ler a base não fica com códigos úteis  |
| `disableSignUp`   | `true`     | Um código não cria conta                    |
| `rateLimit`       | 3 por 60 s | Trava o envio repetido de e-mails           |

O limitador global está explicitamente ligado. Por omissão o Better Auth
só o activa em produção, o que esconderia o comportamento durante os
testes. Fica guardado em memória, o que chega para uma instância.

## Envio de e-mail

`src/lib/email.ts` usa o Nodemailer. Sem `SMTP_USER` e `SMTP_PASS`, o
código é escrito nos registos do servidor em vez de ser enviado:

```
┌─ E-MAIL (SMTP não configurado) ─────────────────────
│ Para:    estudante@isaf.ao
│ Assunto: 514166 é o teu código de entrada — Click Seguro
│ Entrar na tua conta: o teu código é 514166.
└─────────────────────────────────────────────────────
```

Isto mantém o fluxo inteiro demonstrável sem credenciais. Para ver os
códigos em produção:

```bash
docker compose logs -f click-seguro
```

Para passar a enviar mesmo, define no `.env` ou no Portainer:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=oteuendereco@gmail.com
SMTP_PASS=<palavra-passe de aplicação, não a da conta>
SMTP_FROM="Click Seguro <nao-responder@click.tsiangana.me>"
```

No Gmail é obrigatório gerar uma palavra-passe de aplicação: a palavra-passe
normal da conta é recusada.

Uma falha de SMTP é registada mas não devolve erro ao utilizador. Se
devolvesse, o tempo de resposta diria a quem anda a sondar se o endereço
existe.

## Ficheiros

| Ficheiro                              | Papel                              |
| ------------------------------------- | ---------------------------------- |
| `src/lib/auth.ts`                     | Configuração do servidor            |
| `src/lib/auth-client.ts`              | Cliente com o plugin de OTP         |
| `src/lib/email.ts`                    | Nodemailer e recurso à consola      |
| `src/lib/email-modelos.ts`            | Modelos HTML dos e-mails            |
| `src/components/ui/campo-codigo.tsx`  | Campo de seis dígitos               |
| `src/app/(auth)/entrar/page.tsx`      | Palavra-passe e código              |
| `src/app/(auth)/registo/page.tsx`     | Registo e confirmação do e-mail     |
| `src/app/(auth)/recuperar/page.tsx`   | Reposição da palavra-passe          |

## Por fazer

- O limitador em memória perde a contagem ao reiniciar. Para várias
  instâncias seria preciso guardá-lo na base de dados, o que exige um
  modelo novo e uma migração.
- Não há segundo factor para contas de administração.
