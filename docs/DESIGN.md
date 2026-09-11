# Sistema de design

Uma só fonte de verdade: o bloco `@theme` em `src/app/globals.css`.
Nenhum ficheiro de interface deve voltar a escrever uma cor à mão.

## Regra

Se precisas de uma cor que não está aqui, acrescenta um token. Não
escrevas o hexadecimal no componente. Foi assim que o projecto acabou com
`#1668D9` repetido vinte e oito vezes.

## Cor

### Superfícies, do fundo para a frente

| Token          | Valor     | Onde                                  |
| -------------- | --------- | ------------------------------------- |
| `fundo`        | `#131c2b` | Fundo da página                       |
| `superficie`   | `#1e293b` | Cabeçalho, painéis                    |
| `superficie-2` | `#263449` | Cartões sobre a página                |
| `superficie-3` | `#334155` | Estados sobrepostos, botões inactivos |

### Texto

| Token         | Valor     | Onde                        |
| ------------- | --------- | --------------------------- |
| `texto`       | `#f2e6d6` | Títulos e texto corrente    |
| `texto-suave` | `#c3bdb4` | Texto secundário            |
| `texto-tenue` | `#8e9099` | Legendas, ícones apagados   |

### Contornos

| Token            | Valor     | Onde                   |
| ---------------- | --------- | ---------------------- |
| `contorno`       | `#3a4759` | Separadores, cartões   |
| `contorno-forte` | `#4d5b6e` | Campos, botões de aro  |

### Acento

| Token                | Valor     | Onde                             |
| -------------------- | --------- | -------------------------------- |
| `acento`             | `#c8a99d` | Acções principais, ligações      |
| `acento-forte`       | `#d9bfb4` | Estado de rato por cima          |
| `acento-contraste`   | `#1e293b` | Texto sobre o acento             |
| `salva`              | `#5c6b66` | Fim dos gradientes de fundo      |

### Estados

| Token     | Valor     | Significado          |
| --------- | --------- | -------------------- |
| `sucesso` | `#4ade80` | Concluído, protegido |
| `perigo`  | `#fca5a5` | Erro, comprometido   |
| `aviso`   | `#fcd34d` | Atenção              |
| `info`    | `#7dd3fc` | Informação neutra    |

Cada estado tem um par `-tenue` para fundos. Na prática usa-se a variante
com transparência, por exemplo `bg-sucesso/15`, que se adapta melhor ao
que estiver por baixo.

## Forma

| Token            | Valor     | Onde                 |
| ---------------- | --------- | -------------------- |
| `rounded-campo`  | `0.75rem` | Botões, campos       |
| `rounded-cartao` | `1rem`    | Cartões              |
| `rounded-painel` | `1.25rem` | Painéis, modais      |

## Componentes

Em `src/components/ui/`:

- `Botao` — variantes `primario`, `secundario`, `fantasma`, `perigo`,
  com estado de carregamento
- `Campo` — rótulo, dica e erro ligados por `aria-describedby`
- `Selecao` — igual, para listas; a seta é desenhada porque a nativa
  desaparece em fundo escuro
- `Alerta` — tons `perigo`, `sucesso`, `aviso`, `info`

## A excepção deliberada

As simulações imitam o WhatsApp, o Gmail e o ecrã de chamada do
telemóvel. Essas maquetas mantêm as cores originais das aplicações
copiadas, incluindo o branco: uma simulação de phishing só ensina alguma
coisa se parecer o que realmente aparece no ecrã.

As cores vivem em `src/components/conversa-simulacao.tsx`, entre as
linhas que desenham cada canal, e estão marcadas com um comentário. Não
as substituas por tokens.

## Acessibilidade

- O foco tem contorno visível em tudo, definido uma vez no `globals.css`
- `prefers-reduced-motion` desliga animações e o vídeo da página inicial
- Os ícones decorativos levam `aria-hidden`; os que informam levam rótulo
- A navegação marca a página actual com `aria-current="page"`
