# Como se trabalha neste projecto

Documento de referência para quem continuar este trabalho. Descreve o fluxo adoptado durante o desenvolvimento.

## Fluxo de trabalho

Toda a tarefa começa numa _issue_. Sem excepção, mesmo que a alteração
seja de uma linha. A issue é o registo do que foi feito e porquê — serve
de histórico de execução do projecto.

Cada issue recebe uma destas etiquetas:

| Etiqueta       | Quando usar                                 |
| -------------- | ------------------------------------------- |
| `correção`     | Algo está partido e precisa de ser reparado |
| `melhoria`     | Algo que já existe e pode ficar melhor      |
| `nova função`  | Funcionalidade que ainda não existe         |
| `documentação` | Relatório, README, comentários no código    |

## Ramos

Trabalho de alguma dimensão sai do `main` para um ramo próprio:

Correcções pequenas e imediatas podem ir directas ao `main`. O critério é
o risco: se partir alguma coisa, isola num ramo.

## Commits

Formato convencional, em português:

O prefixo diz a natureza da alteração. O resto diz o que mudou, não como.

## Pull Requests

Ramos entram no `main` por PR. A descrição menciona a issue
correspondente com `Fecha #12`, para que o GitHub feche a issue
automaticamente quando o PR for integrado.

Sendo este um projecto de autor único, o PR não serve para revisão por
pares — serve como registo da alteração e ponto de verificação antes de
integrar. Num contexto de equipa, seria obrigatória a aprovação de outro
programador.

## Antes de integrar

- `npm run build` passa sem erros
- `npm run lint` sem erros (avisos avaliados caso a caso)
- O percurso principal foi testado à mão: registo, entrada, diagnóstico

## Regras do produto

Estas orientações mantêm-se ao longo de todo o desenvolvimento:

1. O README acompanha sempre as alterações. Quem clonar o repositório
   noutro computador tem de conseguir pôr o projecto a correr só com ele.
2. Robustez, segurança e qualidade antes de quantidade de funcionalidades.
3. Perguntas, lições e simulações ancoradas em situações reais. Podem ter
   leveza, nunca à custa da verosimilhança.
4. Termos técnicos aparecem a azul e são clicáveis, com explicação simples
   em linguagem corrente. Marcam-se no texto com `[[duplos parênteses]]`.
5. O acompanhamento longitudinal do comportamento (a médio e longo prazo)
   está fora do âmbito e consta dos trabalhos futuros. A aplicação mede
   conhecimento antes e depois do percurso, na mesma sessão.

## Decisões deliberadamente adiadas

Registadas aqui porque a ausência foi escolhida, não esquecida:

- **Observabilidade** (Sentry, OpenTelemetry): instrumentação faz sentido
  em produção com utilização real. Recomenda-se OpenTelemetry pela
  neutralidade face ao fornecedor.
- **Testes automatizados** para além do percurso crítico: o prazo levou a
  priorizar o percurso pedagógico completo.
- **Análise de mutação, detecção de código morto**: pressupõem uma base de
  testes que ainda não existe.

A justificação de cada uma consta do capítulo de trabalhos futuros do
relatório.
