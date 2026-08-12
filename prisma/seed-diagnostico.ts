import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

const perguntas = [
  {
    ordem: 1,
    dificuldade: "MEDIA",
    enunciado:
      'Recebes um email de "seguranca@bfa.co.ao-verificacao.net". Qual é o domínio verdadeiro deste remetente?',
    opcoes: [
      { texto: "bfa.co.ao, porque aparece primeiro" },
      {
        texto: "ao-verificacao.net, a última parte antes da barra",
        correta: true,
      },
      { texto: "seguranca, a parte antes do arroba" },
      { texto: "Não é possível determinar sem abrir o email" },
    ],
    explicacao:
      "O domínio real lê-se do fim para o início: é sempre a última parte antes da primeira barra. Tudo o que vem antes pode ser inventado por quem registou o domínio, incluindo o nome de um banco. O olho lê da esquerda para a direita, reconhece o nome familiar e pára aí, e é precisamente nessa leitura que o ataque assenta.",
  },
  {
    ordem: 2,
    dificuldade: "DIFICIL",
    enunciado:
      "Chegaste por um link de SMS a uma página com cadeado, certificado válido e um endereço que parece o do teu banco. O que é que o cadeado garante?",
    opcoes: [
      { texto: "Que a página pertence mesmo ao banco" },
      {
        texto:
          "Que a ligação vai cifrada, e nada mais sobre quem criou a página",
        correta: true,
      },
      { texto: "Que o site foi verificado por uma autoridade bancária" },
      { texto: "Que os dados que introduzires não podem ser roubados" },
    ],
    explicacao:
      "O cadeado diz que a ligação vai cifrada, ou seja, que ninguém a intercepta pelo caminho. Não diz nada sobre quem está do outro lado. Obter um certificado é gratuito e rápido, e quem monta uma página falsa obtém um também. Se o endereço foi registado por quem ataca, os teus dados chegam cifrados ao destino errado.",
  },
  {
    ordem: 3,
    dificuldade: "DIFICIL",
    enunciado:
      "Um email trata-te pelo nome, indica o teu número de estudante correcto e vem assinado pelo teu orientador, a pedir que envies o trabalho para um Gmail pessoal porque a caixa institucional está cheia. O que deve levantar suspeita?",
    opcoes: [
      { texto: "O facto de conhecerem o teu número de estudante" },
      {
        texto: "O pedido para sair do canal institucional",
        correta: true,
      },
      { texto: "O email ter chegado fora do horário de expediente" },
      { texto: "Nada, uma vez que todos os dados conferem" },
    ],
    explicacao:
      "Dados correctos não provam nada: um número de estudante circula em listas de turma, em trabalhos de grupo e em papéis afixados. O sinal está no que a mensagem pede. Uma instituição não trata assuntos oficiais por um endereço pessoal, e a justificação apressada existe para que aceites a excepção sem pensar. Confirma sempre pelo canal habitual, mesmo quando tudo parece encaixar.",
  },
  {
    ordem: 4,
    dificuldade: "MEDIA",
    enunciado:
      "Uma empresa instala o melhor firewall e antivírus do mercado, e mantém tudo actualizado. Que protecção tem contra engenharia social?",
    opcoes: [
      { texto: "Protecção completa, é para isso que servem" },
      {
        texto:
          "Protecção parcial, porque o ataque dirige-se às pessoas e não aos sistemas",
        correta: true,
      },
      { texto: "Nenhuma, ferramentas técnicas são inúteis" },
      { texto: "Protecção total desde que haja também cópias de segurança" },
    ],
    explicacao:
      "Ferramentas técnicas filtram parte das mensagens, mas o ataque de engenharia social contorna o sistema ao dirigir-se a quem o usa. Nenhum firewall impede alguém de escrever a palavra-passe numa página falsa ou de ler um código ao telefone. A literatura aponta a formação dos utilizadores como das técnicas de prevenção mais eficazes, precisamente por isso.",
  },
  {
    ordem: 5,
    dificuldade: "DIFICIL",
    enunciado:
      "Tens uma palavra-passe de 30 caracteres aleatórios, mas usaste a mesma numa loja online e no teu email. Qual é o nível de protecção do email?",
    opcoes: [
      { texto: "Muito alto, o comprimento é o que conta" },
      {
        texto: "O da loja online, que é o serviço mais fraco onde a usaste",
        correta: true,
      },
      { texto: "Alto, porque provedores de email protegem melhor" },
      { texto: "Depende do tempo desde a última mudança" },
    ],
    explicacao:
      "Se a loja guardar credenciais sem protecção adequada e sofrer uma fuga, a palavra-passe sai da lista tal como está, por mais longa que seja, e é testada de imediato noutros serviços. A força individual não compensa a repetição: numa cadeia, o que conta é o elo mais fraco.",
  },
  {
    ordem: 6,
    dificuldade: "DIFICIL",
    enunciado:
      "Um serviço pede a palavra-passe e depois o nome da tua primeira escola. Isto constitui autenticação em duas etapas?",
    opcoes: [
      { texto: "Sim, são dois passos antes de entrar" },
      {
        texto: "Não, ambos pertencem à categoria daquilo que se sabe",
        correta: true,
      },
      { texto: "Sim, porque a segunda pergunta é pessoal" },
      { texto: "Só se a resposta for difícil de adivinhar" },
    ],
    explicacao:
      "Dois passos não são dois factores. A força vem de combinar categorias distintas: algo que se sabe com algo que se tem ou algo que se é. Palavra-passe e pergunta de segurança descobrem-se pela mesma via, e a resposta à segunda costuma estar acessível nas redes sociais ou a quem conheça a pessoa.",
  },
  {
    ordem: 7,
    dificuldade: "DIFICIL",
    enunciado:
      "Porque é que a aplicação autenticadora resiste à troca fraudulenta de cartão SIM, ao contrário do SMS?",
    opcoes: [
      { texto: "Porque os códigos são mais longos" },
      {
        texto:
          "Porque o código é gerado no dispositivo e não circula pela rede",
        correta: true,
      },
      { texto: "Porque exige impressão digital para abrir" },
      { texto: "Porque a operadora valida a aplicação" },
    ],
    explicacao:
      "Na troca fraudulenta de cartão SIM, o atacante convence a operadora a transferir o número para um cartão que controla, e passa a receber os SMS. O código da aplicação nasce de um segredo guardado no telemóvel e nunca é enviado, por isso não há nada para interceptar nem operadora para enganar.",
  },
  {
    ordem: 8,
    dificuldade: "MEDIA",
    enunciado:
      "Recebes um código de confirmação sem teres tentado entrar em conta nenhuma. O que é que isso indica?",
    opcoes: [
      { texto: "Um erro do serviço, sem consequências" },
      {
        texto:
          "Que alguém tem a tua palavra-passe e foi travado no segundo passo",
        correta: true,
      },
      { texto: "Que o telemóvel está infectado" },
      { texto: "Que a tua sessão anterior expirou" },
    ],
    explicacao:
      "O código só é enviado depois de a palavra-passe ser aceite. A sua chegada inesperada diz duas coisas ao mesmo tempo: alguém a tem, e o segundo factor acabou de fazer o seu trabalho. A palavra-passe deve ser mudada de imediato, e em todos os sítios onde tenha sido repetida.",
  },
  {
    ordem: 9,
    dificuldade: "DIFICIL",
    enunciado:
      "Numa chamada, a pessoa acerta no teu nome completo, na tua morada e nos últimos dígitos da tua conta. Isso prova que é do banco?",
    opcoes: [
      { texto: "Sim, apenas o banco tem acesso a esses dados" },
      {
        texto:
          "Não, esses dados circulam em fugas e podem ser recolhidos previamente",
        correta: true,
      },
      { texto: "Sim, desde que o número de origem seja o oficial" },
      { texto: "Depende de acertar em todos os dígitos da conta" },
    ],
    explicacao:
      "Conhecer dados sobre alguém nunca prova identidade, e essa suposição é o que o vishing explora. Informação pessoal circula em fugas antigas e nas redes sociais. Nem a origem da chamada serve de garantia, porque pode ser falsificada. A verificação só é válida num sentido: ser a própria pessoa a ligar para o número oficial.",
  },
  {
    ordem: 10,
    dificuldade: "MEDIA",
    enunciado:
      "Recebes uma mensagem legítima e uma fraudulenta, ambas a pedir acção urgente. Qual é o procedimento que funciona nos dois casos?",
    opcoes: [
      { texto: "Responder à mensagem a pedir confirmação" },
      { texto: "Verificar se a página de destino tem cadeado" },
      {
        texto:
          "Ignorar o que veio na mensagem e contactar por uma via já conhecida",
        correta: true,
      },
      { texto: "Comparar com mensagens anteriores da mesma entidade" },
    ],
    explicacao:
      "Numa mensagem fraudulenta, tudo o que ela contém pertence ao atacante: o link, o número, o endereço de resposta. Verificar por dentro é pedir ao burlão que confirme a sua própria honestidade. Sair para um canal escolhido por si funciona nos dois cenários e não custa nada quando a mensagem afinal era verdadeira.",
  },
];

async function main() {
  console.log("A semear diagnóstico…\n");

  // Apaga apenas as perguntas sem lição associada: as dos quizzes ficam intactas.
  await prisma.pergunta.deleteMany({ where: { licaoId: null } });

  for (const p of perguntas) {
    await prisma.pergunta.create({
      data: {
        enunciado: p.enunciado,
        explicacao: p.explicacao,
        dificuldade: p.dificuldade,
        ordem: p.ordem,
        opcoes: {
          create: p.opcoes.map((o, i) => ({
            texto: o.texto,
            correta: o.correta ?? false,
            ordem: i + 1,
          })),
        },
      },
    });

    console.log(`  ${p.ordem}. ok`);
  }

  console.log("\nFeito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
