# Publicação na VPS com Traefik

A aplicação corre num contentor. O Traefik trata do domínio e do
certificado. A base de dados vive num volume e sobrevive a cada
publicação.

## O que é preciso do lado da VPS

- Docker e Docker Compose
- Traefik já a correr, com um `entrypoint` chamado `websecure` e um
  resolvedor de certificados
- Uma rede Docker externa partilhada com o Traefik, chamada `traefik`

Se a rede ainda não existir:

```bash
docker network create traefik
```

Se o teu resolvedor de certificados tiver outro nome, define
`RESOLVEDOR_TLS` no `.env`.

## Registo DNS

Aponta o subdomínio para o IP da VPS:

```
A    click.tsiangana.me    ->    <IP da VPS>
```

Espera a propagação antes de subir o serviço, senão o Let's Encrypt
falha a emissão e entra em período de espera.

## Publicar

```bash
git clone <repositório> click-seguro
cd click-seguro

cat > .env <<EOF
DOMINIO=click.tsiangana.me
BETTER_AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))")
EOF

docker compose up -d --build
docker compose logs -f
```

O arranque mostra, por esta ordem:

```
Volume vazio. A instalar a base inicial em /dados/click-seguro.db…
A aplicar migrações pendentes…
No pending migrations to apply.
▲ Next.js 16.3.0
✓ Ready
```

## Pelo Portainer

O Portainer aceita o `compose.yaml` tal como está, em **Stacks → Add
stack → Repository**. As variáveis `DOMINIO` e `BETTER_AUTH_SECRET`
declaram-se no painel de variáveis de ambiente da stack, não num ficheiro.

## Variáveis de ambiente

| Variável             | Obrigatória | Para que serve                                     |
| -------------------- | ----------- | -------------------------------------------------- |
| `DOMINIO`            | sim         | Domínio público; alimenta a regra do Traefik        |
| `BETTER_AUTH_SECRET` | sim         | Assina os cookies de sessão                         |
| `BETTER_AUTH_URL`    | sim         | Origem aceite no login; o compose deriva do domínio |
| `CAMINHO_BD`         | não         | Caminho da base no volume                           |
| `RESOLVEDOR_TLS`     | não         | Resolvedor de certificados do Traefik               |
| `SMTP_USER`          | não         | Utilizador SMTP; sem ele o código vai para os registos |
| `SMTP_PASS`          | não         | Palavra-passe de aplicação, nunca a da conta         |
| `SMTP_HOST`          | não         | Servidor de correio                                  |
| `SMTP_PORT`          | não         | Porta; 587 com STARTTLS, 465 com TLS directo         |
| `SMTP_FROM`          | não         | Remetente mostrado ao destinatário                   |

Sem SMTP configurado a aplicação continua a funcionar: o código de
verificação aparece em `docker compose logs -f click-seguro` em vez de
seguir por e-mail. Os detalhes estão em [AUTENTICACAO.md](AUTENTICACAO.md).

O `BETTER_AUTH_SECRET` não se muda depois de haver contas criadas.
Mudá-lo invalida todas as sessões activas.

## Como a base de dados é tratada

A imagem transporta uma `semente.db` já migrada e com o conteúdo
pedagógico dentro. No primeiro arranque, se o volume estiver vazio, essa
base é copiada para lá. A partir daí o volume manda: a semente nunca mais
é aplicada e o progresso dos utilizadores fica intacto.

Cada arranque corre `prisma migrate deploy`, por isso uma alteração ao
esquema entra sozinha na publicação seguinte.

## Actualizar

```bash
git pull
docker compose up -d --build
```

O volume não é tocado.

## Cópia de segurança

```bash
docker run --rm -v click-seguro_dados-click-seguro:/dados \
  -v "$PWD":/backup alpine \
  tar czf /backup/click-seguro-$(date +%F).tar.gz -C /dados .
```

Vale a pena fazer isto antes de cada actualização, porque os dados são a
matéria-prima do relatório.

## Problemas frequentes

**Login devolve 403**
O `BETTER_AUTH_URL` não corresponde ao endereço usado no browser.
Confirma que inclui `https://` e o domínio exacto, sem barra final.

**O Traefik não encontra o serviço**
O contentor tem de estar na rede `traefik`. Confirma com
`docker network inspect traefik`.

**Certificado não emitido**
Regista o DNS antes de subir o serviço e confirma que as portas 80 e 443
chegam ao Traefik.

## Limitação assumida

A imagem tem cerca de 676 MB, e a maior parte é o CLI do Prisma, que só
existe para aplicar migrações no arranque. Quem preferir uma imagem
pequena pode retirar essa etapa do `Dockerfile` e aplicar as migrações à
mão nas actualizações de esquema.
