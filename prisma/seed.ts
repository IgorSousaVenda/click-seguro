import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

type OpcaoSemente = { texto: string; correta?: boolean };
type PerguntaSemente = {
  enunciado: string;
  explicacao: string;
  dificuldade: "FACIL" | "MEDIA" | "DIFICIL";
  modulo: string;
  opcoes: OpcaoSemente[];
};

const modulos = [
  {
    slug: "phishing",
    titulo: "Reconhecer o engodo",
    descricao:
      "Identificar mensagens fraudulentas por e-mail, SMS e chamada antes de clicar.",
    icone: "fish",
    ordem: 1,
    cor: "brand",
  },
  {
    slug: "palavras-passe",
    titulo: "Palavras-passe que resistem",
    descricao:
      "Porque a reutilização é o maior risco e como construir credenciais fortes.",
    icone: "key-round",
    ordem: 2,
    cor: "brand",
  },
  {
    slug: "autenticacao",
    titulo: "A segunda barreira",
    descricao:
      "Autenticação em duas etapas: o que é, qual escolher e o que nunca partilhar.",
    icone: "shield-check",
    ordem: 3,
    cor: "brand",
  },
];

const perguntas: PerguntaSemente[] = [
  {
    modulo: "phishing",
    dificuldade: "FACIL",
    enunciado:
      "Recebes um e-mail do teu banco a avisar que a conta será suspensa dentro de 24 horas se não confirmares os teus dados através de uma ligação. Qual é o sinal mais forte de fraude?",
    explicacao:
      "A combinação de urgência artificial com pedido de credenciais é a assinatura clássica do phishing. Instituições financeiras não pedem dados de acesso por e-mail nem impõem prazos de horas.",
    opcoes: [
      {
        texto: "A urgência do prazo somada ao pedido de dados de acesso",
        correta: true,
      },
      { texto: "O e-mail incluir o logótipo do banco" },
      { texto: "A mensagem ter chegado fora do horário de expediente" },
      { texto: "O e-mail tratar-te pelo teu nome próprio" },
    ],
  },
  {
    modulo: "phishing",
    dificuldade: "MEDIA",
    enunciado:
      "Antes de clicares numa ligação recebida por e-mail, qual é a forma mais fiável de verificar para onde ela aponta?",
    explicacao:
      "O texto visível de uma ligação pode dizer qualquer coisa. Colocar o cursor sobre ela (ou premir sem largar, no telemóvel) revela o endereço real de destino.",
    opcoes: [
      {
        texto:
          "Colocar o cursor sobre a ligação e ler o endereço real que aparece",
        correta: true,
      },
      { texto: "Clicar e avaliar a página que abrir" },
      { texto: "Confiar se o texto da ligação mostrar o nome da instituição" },
      { texto: "Verificar apenas se a mensagem tem bom português" },
    ],
  },
  {
    modulo: "phishing",
    dificuldade: "MEDIA",
    enunciado:
      "Um site com cadeado e endereço começado por «https://» é garantia de que é legítimo?",
    explicacao:
      "Não. O cadeado indica apenas que a ligação está cifrada entre o teu dispositivo e o servidor. Qualquer pessoa obtém um certificado gratuito, e a maioria das páginas de phishing hoje usa https.",
    opcoes: [
      {
        texto:
          "Não — garante apenas que a ligação está cifrada, não quem está do outro lado",
        correta: true,
      },
      { texto: "Sim — o cadeado só é atribuído a sites verificados" },
      { texto: "Sim, desde que se trate de um banco" },
      { texto: "Não há maneira de avaliar a legitimidade de um site" },
    ],
  },
  {
    modulo: "phishing",
    dificuldade: "FACIL",
    enunciado:
      "Chega-te um SMS em nome da tua operadora: ganhaste um prémio, resgata através da ligação nas próximas duas horas. Qual é a ação mais segura?",
    explicacao:
      "Isto é smishing — phishing por SMS. A regra é não usar a ligação recebida: entra na aplicação oficial ou liga para o número do cartão. Se o prémio existir, aparece no canal oficial.",
    opcoes: [
      {
        texto:
          "Não clicar e confirmar pela aplicação ou pelo número oficial da operadora",
        correta: true,
      },
      { texto: "Clicar para ver do que se trata, sem preencher nada" },
      { texto: "Reencaminhar a amigos para saber se também receberam" },
      { texto: "Responder ao SMS a pedir mais informações" },
    ],
  },
  {
    modulo: "palavras-passe",
    dificuldade: "FACIL",
    enunciado:
      "Porque é que usar a mesma palavra-passe em vários serviços é perigoso, mesmo que ela seja complexa?",
    explicacao:
      "Basta que um dos serviços sofra uma fuga de dados. Os atacantes testam automaticamente essas credenciais em dezenas de outros sites — chama-se credential stuffing. A força da palavra-passe não protege contra isto.",
    opcoes: [
      {
        texto:
          "Uma fuga num único serviço passa a comprometer todas as outras contas",
        correta: true,
      },
      { texto: "Torna o processo de autenticação mais lento" },
      { texto: "Os serviços detetam a repetição e bloqueiam a conta" },
      { texto: "Não é perigoso, desde que a palavra-passe seja complexa" },
    ],
  },
  {
    modulo: "palavras-passe",
    dificuldade: "MEDIA",
    enunciado: "Qual destas palavras-passe é mais resistente a um ataque?",
    explicacao:
      "O comprimento pesa mais do que os símbolos. Uma frase longa com palavras sem relação entre si é difícil de quebrar e fácil de memorizar. Substituir letras por símbolos em palavras comuns já não engana ferramentas modernas.",
    opcoes: [
      { texto: "chuva-bussola-manga-quarenta", correta: true },
      { texto: "P@ssw0rd!" },
      { texto: "Angola2026!" },
      { texto: "Igor@1999" },
    ],
  },
  {
    modulo: "palavras-passe",
    dificuldade: "MEDIA",
    enunciado:
      "Qual é a forma mais segura de guardar palavras-passe diferentes para cada serviço?",
    explicacao:
      "Um gestor de palavras-passe cifra o cofre e exige uma única palavra-passe principal. Resolve o problema real: ninguém memoriza vinte credenciais distintas, e é por isso que a maioria acaba por reutilizar.",
    opcoes: [
      {
        texto:
          "Num gestor de palavras-passe protegido por uma palavra-passe principal",
        correta: true,
      },
      { texto: "Nas notas do telemóvel, sem proteção adicional" },
      { texto: "Num papel guardado na carteira" },
      { texto: "Num ficheiro chamado «outros» no computador" },
    ],
  },
  {
    modulo: "autenticacao",
    dificuldade: "FACIL",
    enunciado: "O que é a autenticação em duas etapas?",
    explicacao:
      "É exigir um segundo elemento além da palavra-passe — algo que tens (telemóvel, chave física) ou algo que és (impressão digital). Mesmo que a palavra-passe seja roubada, falta ao atacante o segundo fator.",
    opcoes: [
      {
        texto:
          "Exigir um segundo elemento de verificação para além da palavra-passe",
        correta: true,
      },
      { texto: "Usar uma palavra-passe com o dobro dos caracteres" },
      { texto: "Introduzir a mesma palavra-passe duas vezes" },
      { texto: "Ter duas contas diferentes no mesmo serviço" },
    ],
  },
  {
    modulo: "autenticacao",
    dificuldade: "DIFICIL",
    enunciado: "Entre as opções de segundo fator, qual oferece maior proteção?",
    explicacao:
      "Uma aplicação autenticadora ou chave física gera o código no próprio dispositivo, sem passar pela rede móvel. O SMS é vulnerável à troca fraudulenta de cartão SIM — ainda assim, SMS é muito melhor do que não ter segundo fator nenhum.",
    opcoes: [
      {
        texto: "Aplicação autenticadora ou chave de segurança física",
        correta: true,
      },
      { texto: "Código enviado por SMS" },
      { texto: "Pergunta de segurança sobre a tua vida pessoal" },
      { texto: "Código enviado para o e-mail de recuperação" },
    ],
  },
  {
    modulo: "autenticacao",
    dificuldade: "MEDIA",
    enunciado:
      "Recebes uma chamada de alguém que diz ser do apoio do teu banco. Sabe o teu nome e pede o código de seis dígitos que acabaste de receber por SMS. O que fazes?",
    explicacao:
      "Isto é vishing — engenharia social por telefone. Nenhuma instituição legítima pede o código de verificação. Quem liga já tem a tua palavra-passe e só lhe falta o segundo fator. Desliga e contacta o banco pelo número do cartão.",
    opcoes: [
      {
        texto:
          "Não partilhar o código, desligar e ligar para o número oficial do banco",
        correta: true,
      },
      { texto: "Partilhar, porque a pessoa sabia o meu nome" },
      { texto: "Partilhar, se o número da chamada parecer oficial" },
      { texto: "Partilhar apenas os três primeiros dígitos" },
    ],
  },
];

async function main() {
  console.log("A semear a base de dados…");

  const mapaModulos = new Map<string, string>();

  for (const m of modulos) {
    const registo = await prisma.modulo.upsert({
      where: { slug: m.slug },
      update: m,
      create: m,
    });
    mapaModulos.set(m.slug, registo.id);
  }
  console.log(`${modulos.length} módulos prontos.`);

  await prisma.pergunta.deleteMany();

  let ordem = 1;
  for (const p of perguntas) {
    await prisma.pergunta.create({
      data: {
        enunciado: p.enunciado,
        explicacao: p.explicacao,
        dificuldade: p.dificuldade,
        ordem: ordem++,
        moduloId: mapaModulos.get(p.modulo),
        opcoes: {
          create: p.opcoes.map((o, i) => ({
            texto: o.texto,
            correta: o.correta ?? false,
            ordem: i + 1,
          })),
        },
      },
    });
  }
  console.log(`${perguntas.length} perguntas inseridas.`);
}

main()
  .catch((erro) => {
    console.error("Falhou a sementeira:", erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
