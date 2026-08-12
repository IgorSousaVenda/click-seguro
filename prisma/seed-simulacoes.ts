import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

type No = {
  chave: string;
  mensagens: string[];
  desfecho?: "SEGURO" | "COMPROMETIDO" | "PARCIAL";
  desenlace?: string;
  escolhas?: { texto: string; proximo: string }[];
};

type Sim = {
  slug: string;
  titulo: string;
  canal: string;
  remetente: string;
  contexto: string;
  ehFraude: boolean;
  licao: string;
  ordem: number;
  moduloMinimo: number;
  nos: No[];
};

const simulacoes: Sim[] = [
  {
    slug: "chamada-banco",
    titulo: "A transferência suspeita",
    canal: "CHAMADA",
    remetente: "+244 923 000 118",
    contexto:
      "São 16h de uma terça-feira. Estás na paragem à espera do candongueiro. O telefone toca, número desconhecido.",
    ehFraude: true,
    moduloMinimo: 1,
    ordem: 1,
    licao:
      "Um código de confirmação nunca serve para cancelar nada, serve para autorizar. Quem o pede está a precisar que sejas tu a abrir a porta que a palavra-passe já não abre sozinha.",
    nos: [
      {
        chave: "inicio",
        mensagens: ["*A chamar…*"],
        escolhas: [
          { texto: "Atender", proximo: "atendeu" },
          { texto: "Não atender", proximo: "ignorou" },
        ],
      },
      {
        chave: "ignorou",
        mensagens: [
          "*Chamada perdida.*",
          "*Trinta segundos depois, o mesmo número volta a ligar.*",
        ],
        escolhas: [
          { texto: "Atender desta vez", proximo: "atendeu" },
          { texto: "Continuar a ignorar", proximo: "ignorou-duas-vezes" },
        ],
      },
      {
        chave: "ignorou-duas-vezes",
        mensagens: [
          "*A chamada cai.*",
          '*Chega um SMS: "Cliente, tentámos contactá-lo sobre uma operação na sua conta. Ligue já para 923 000 118."*',
        ],
        desfecho: "SEGURO",
        desenlace:
          "Não atendeste, e não ligaste para o número que a mensagem indicava. Fizeste o essencial: nada do que veio da mensagem foi usado para verificar a mensagem. Se houvesse mesmo uma operação por confirmar, o banco tê-la-ia bloqueado e tu confirmarias pela aplicação ou pelo número impresso no cartão.",
      },
      {
        chave: "atendeu",
        mensagens: [
          "Boa tarde. Falo do departamento de segurança do banco.",
          "Estou a ligar por causa de uma operação registada na sua conta há poucos minutos.",
          "Uma transferência de 450 mil kwanzas para um destinatário novo. Foi o senhor que autorizou?",
        ],
        escolhas: [
          {
            texto: "Não fui eu. Cancele imediatamente.",
            proximo: "pediu-cancelar",
          },
          {
            texto: "Com quem estou a falar exactamente?",
            proximo: "perguntou-quem",
          },
          {
            texto: "Vou confirmar pela aplicação e ligo eu ao banco.",
            proximo: "quis-confirmar",
          },
        ],
      },
      {
        chave: "perguntou-quem",
        mensagens: [
          "Com certeza. Chamo-me Adilson Kiala, funcionário número 4471, departamento de prevenção de fraude.",
          "Compreendo a desconfiança, é o procedimento correcto da sua parte.",
          "Mas temos de ser rápidos. A operação entra em processamento dentro de poucos minutos.",
        ],
        escolhas: [
          { texto: "Está bem, cancele então.", proximo: "pediu-cancelar" },
          {
            texto: "Mesmo assim prefiro ligar eu para o banco.",
            proximo: "quis-confirmar",
          },
        ],
      },
      {
        chave: "quis-confirmar",
        mensagens: [
          "Percebo, mas nesse caso não consigo travar a operação a tempo.",
          "A linha de apoio geral tem espera de vinte minutos a esta hora, e nós temos dois.",
          "Se desligar agora, o valor sai e a recuperação leva semanas.",
        ],
        escolhas: [
          {
            texto: "Desligo na mesma e ligo pelo número do cartão.",
            proximo: "desligou",
          },
          { texto: "Não posso arriscar. Continue.", proximo: "pediu-cancelar" },
        ],
      },
      {
        chave: "pediu-cancelar",
        mensagens: [
          "Muito bem. Vou iniciar o processo de anulação.",
          "Acabou de receber um SMS com um código de seis dígitos.",
          "Leia-me esse código para eu confirmar a anulação no sistema.",
        ],
        escolhas: [
          { texto: "Ler o código", proximo: "deu-codigo" },
          {
            texto: "Não leio códigos a ninguém. Vou desligar.",
            proximo: "desligou",
          },
          { texto: "Ficar em silêncio", proximo: "hesitou" },
        ],
      },
      {
        chave: "hesitou",
        mensagens: [
          "Está a ouvir-me? O tempo está a contar.",
          "Senhor, sem esse código eu não consigo fazer nada. O valor vai sair.",
          "*Silêncio do outro lado. Depois, a chamada cai.*",
        ],
        desfecho: "PARCIAL",
        desenlace:
          "A conta não foi comprometida, mas o mérito não foi teu: foi a chamada que caiu. Hesitar é melhor do que ceder, e a hesitação foi o teu instinto a dizer que algo não batia certo. O que faltou foi transformar essa dúvida em acção, desligando e ligando tu para o número oficial.",
      },
      {
        chave: "deu-codigo",
        mensagens: [
          "Obrigado. Confirmado, a operação foi anulada.",
          "Vai receber um comprovativo por email. Tenha um bom dia.",
          "*Dois minutos depois, chega uma notificação: transferência de 450 mil kwanzas efectuada com sucesso.*",
        ],
        desfecho: "COMPROMETIDO",
        desenlace:
          "Não havia transferência nenhuma antes da chamada. Quem ligou tinha a tua palavra-passe, tentou entrar, e o segundo factor bloqueou-o. O código que recebeste era o pedido de autorização dessa entrada, e ao lê-lo em voz alta foste tu a autorizá-la. Um código de confirmação nunca cancela operações, só as aprova. Esta chamada engana pessoas atentas todos os dias, precisamente porque a pressa não deixa fazer esta distinção.",
      },
      {
        chave: "desligou",
        mensagens: [
          "*Desligaste.*",
          "*Ligaste para o número impresso no verso do cartão.*",
          "*O banco confirma: não há transferência nenhuma pendente, e ninguém do banco te ligou.*",
        ],
        desfecho: "SEGURO",
        desenlace:
          "Fizeste exactamente o que protege em qualquer cenário: saíste do canal que o outro lado escolheu e verificaste por uma via que escolheste tu. Repara que isto funcionaria igualmente bem se a chamada fosse verdadeira, e não te teria custado nada. O banco não te penaliza por confirmares.",
      },
    ],
  },

  {
    slug: "sms-unitel",
    titulo: "A linha suspensa",
    canal: "SMS",
    remetente: "Unitel",
    contexto:
      "São 21h40 de domingo. Estás a ver um filme quando o telemóvel vibra.",
    ehFraude: true,
    moduloMinimo: 1,
    ordem: 2,
    licao:
      "O remetente de um SMS pode ser escrito por quem envia, incluindo o nome de uma operadora. E o domínio verdadeiro de um endereço lê-se do fim para o início.",
    nos: [
      {
        chave: "inicio",
        mensagens: [
          "UNITEL: Detectámos actividade irregular associada ao seu numero. A linha sera suspensa em 24h.",
          "Regularize em: unitel.ao-verificacao.net",
        ],
        escolhas: [
          { texto: "Abrir o link", proximo: "abriu" },
          {
            texto: "Manter o dedo no link para ver o endereço",
            proximo: "verificou-link",
          },
          {
            texto: "Ignorar e ver a conta pela app Unitel",
            proximo: "usou-app",
          },
        ],
      },
      {
        chave: "verificou-link",
        mensagens: [
          "*O endereço completo aparece: https://unitel.ao-verificacao.net/login*",
          "*O domínio verdadeiro é ao-verificacao.net. A palavra unitel está apenas no início, onde qualquer pessoa a pode escrever.*",
        ],
        escolhas: [
          { texto: "Apagar a mensagem", proximo: "seguro-verificou" },
          { texto: "Abrir na mesma, só para ver", proximo: "abriu" },
        ],
      },
      {
        chave: "seguro-verificou",
        mensagens: [
          "*Apagaste a mensagem.*",
          "*No dia seguinte a linha continua activa. Nunca houve suspensão nenhuma.*",
        ],
        desfecho: "SEGURO",
        desenlace:
          "Verificaste o destino antes de clicar, que é a única coisa que distingue este SMS de um verdadeiro. Repara que o nome do remetente dizia Unitel: esse campo é escrito por quem envia e não prova nada. O que revelou a fraude foi o fim do endereço, não o princípio.",
      },
      {
        chave: "usou-app",
        mensagens: [
          "*Abriste a aplicação oficial da Unitel.*",
          "*Nenhum aviso, nenhuma irregularidade, saldo normal.*",
        ],
        desfecho: "SEGURO",
        desenlace:
          "Saíste da mensagem e foste verificar por um canal que escolheste tu. Este procedimento funciona sem precisares de analisar o link, e funcionaria igualmente se a mensagem fosse verdadeira. É o hábito mais útil de todos, porque não depende de reconheceres o truque.",
      },
      {
        chave: "abriu",
        mensagens: [
          "*A página abre com o logótipo da Unitel e o cadeado no endereço.*",
          "*Pede o número de telefone e o PIN da conta.*",
        ],
        escolhas: [
          {
            texto: "Preencher, o cadeado indica que é seguro",
            proximo: "preencheu",
          },
          {
            texto: "Fechar, o cadeado não prova a identidade do site",
            proximo: "fechou",
          },
        ],
      },
      {
        chave: "fechou",
        mensagens: [
          "*Fechaste a página sem escrever nada.*",
          "*O domínio ficou registado na tua memória: ao-verificacao.net não é da Unitel.*",
        ],
        desfecho: "SEGURO",
        desenlace:
          "Abriste a página, o que já dá ao atacante a informação de que o teu número está activo, mas não entregaste nada. O cadeado que viste era genuíno: certifica que a ligação está cifrada, nunca que o site é de quem diz ser. Sites fraudulentos têm cadeado quase sempre.",
      },
      {
        chave: "preencheu",
        mensagens: [
          '*A página mostra: "A processar…"*',
          '*Depois: "Erro. Tente novamente mais tarde."*',
          "*Duas horas depois, o teu saldo Unitel está a zero e há transferências para números que não conheces.*",
        ],
        desfecho: "COMPROMETIDO",
        desenlace:
          "A mensagem de erro faz parte do desenho: dá a sensação de que nada aconteceu e evita que suspeites de imediato. Os dados foram entregues no momento em que carregaste no botão. O cadeado não te enganou, tu é que leste nele uma garantia que ele nunca deu.",
      },
    ],
  },
  {
    slug: "email-isaf",
    titulo: "Aviso de propinas",
    canal: "EMAIL",
    remetente: "secretaria@isaf.ao",
    contexto:
      "Terça-feira de manhã. Chega um email da secretaria do ISAF sobre o pagamento das propinas.",
    ehFraude: false,
    moduloMinimo: 1,
    ordem: 3,
    licao:
      "Nem tudo o que pede atenção é fraude. Desconfiar de tudo é tão inútil como não desconfiar de nada, e o que distingue as duas situações é o que a mensagem pede.",
    nos: [
      {
        chave: "inicio",
        mensagens: [
          "Caro estudante,",
          "Informamos que o prazo de pagamento da propina referente ao mês em curso termina no dia 30.",
          "O pagamento pode ser efectuado na tesouraria ou por transferência, conforme os dados já constantes do portal do estudante.",
          "Secretaria Académica, ISAF",
        ],
        escolhas: [
          {
            texto: "Verificar o remetente e o que a mensagem pede",
            proximo: "analisou",
          },
          { texto: "Apagar, deve ser fraude", proximo: "apagou" },
        ],
      },
      {
        chave: "analisou",
        mensagens: [
          "*Remetente: secretaria@isaf.ao. O domínio é o oficial da instituição.*",
          "*A mensagem não tem links, não tem anexos e não pede dados nenhuns.*",
          "*Remete para o portal que já conheces, sem fornecer atalho.*",
        ],
        escolhas: [
          {
            texto: "É legítima. Entrar no portal pelo endereço habitual.",
            proximo: "aceitou",
          },
          { texto: "Continuo desconfiado. Apagar.", proximo: "apagou" },
        ],
      },
      {
        chave: "aceitou",
        mensagens: [
          "*Entraste no portal pelo endereço que já usavas.*",
          "*A informação da propina está lá, igual à do email.*",
        ],
        desfecho: "SEGURO",
        desenlace:
          "Esta mensagem era legítima, e reconheceste-o pelos sinais certos: domínio oficial, ausência de links, nenhum pedido de dados, e remissão para um canal que já conhecias. Repara que mesmo assim entraste pelo endereço habitual em vez de seguir a mensagem. Isso é o hábito correcto, e não custa nada quando a mensagem é verdadeira.",
      },
      {
        chave: "apagou",
        mensagens: [
          "*Apagaste a mensagem.*",
          "*No dia 2 do mês seguinte, recebes uma notificação de propina em atraso com multa.*",
        ],
        desfecho: "PARCIAL",
        desenlace:
          "A mensagem era verdadeira. Não houve dano de segurança, mas houve custo: desconfiar de tudo tem preço, e leva as pessoas a ignorar comunicações que importam. O objectivo não é a suspeita permanente, é saber onde olhar. Esta mensagem não pedia dados, não tinha links, e vinha do domínio oficial, três sinais que a distinguiam de uma fraude.",
      },
    ],
  },
  {
    slug: "whatsapp-familiar",
    titulo: "O número novo",
    canal: "WHATSAPP",
    remetente: "+244 921 447 302",
    contexto:
      "Quinta-feira à noite. Uma mensagem de um número que não tens guardado, com a foto de perfil da tua irmã.",
    ehFraude: true,
    moduloMinimo: 1,
    ordem: 4,
    licao:
      "Uma conta tomada responde a tudo e tem acesso às fotografias e ao histórico. A confirmação tem de sair do canal, e o melhor canal é a voz.",
    nos: [
      {
        chave: "inicio",
        mensagens: [
          "Mano, sou eu. Perdi o telemóvel, estou com outro número.",
          "Estou numa situação complicada, preciso que me faças uma transferência urgente.",
          "Depois explico tudo, prometo.",
        ],
        escolhas: [
          { texto: "Ligar para o número antigo dela", proximo: "ligou" },
          {
            texto: "Pedir que envie uma foto para confirmar",
            proximo: "pediu-foto",
          },
          { texto: "Perguntar quanto é", proximo: "perguntou-valor" },
        ],
      },
      {
        chave: "pediu-foto",
        mensagens: [
          "*Chega uma fotografia dela, recente, tirada em casa dos vossos pais.*",
          "Viste? Sou eu. Agora despacha lá, é urgente.",
        ],
        escolhas: [
          { texto: "Ligar na mesma para o número antigo", proximo: "ligou" },
          {
            texto: "Ficou provado. Perguntar quanto é.",
            proximo: "perguntou-valor",
          },
        ],
      },
      {
        chave: "perguntou-valor",
        mensagens: [
          "180 mil. Envio-te já o IBAN.",
          "AO06 0040 0000 ... (conta em nome de terceiro)",
          "Faz agora por favor, depois devolvo.",
        ],
        escolhas: [
          { texto: "Transferir", proximo: "transferiu" },
          { texto: "Parar e ligar para o número antigo", proximo: "ligou" },
        ],
      },
      {
        chave: "ligou",
        mensagens: [
          "*Ligaste para o número antigo. Toca.*",
          '*Ela atende: "Estou em casa, não perdi telemóvel nenhum."*',
        ],
        desfecho: "SEGURO",
        desenlace:
          "A conta dela tinha sido tomada, e quem lá estava tinha acesso às fotografias e ao histórico de conversas, o que explica a foto e o tom familiar. Nada do que vem por escrito prova identidade quando a conta está comprometida. A voz continua a ser a verificação mais simples, e vale a pena combinar em família uma palavra que só vocês conheçam.",
      },
      {
        chave: "transferiu",
        mensagens: [
          "*Transferência efectuada.*",
          "Obrigado mano, salvaste-me.",
          "*No dia seguinte, a tua irmã pergunta porque é que lhe transferiste 180 mil kwanzas.*",
        ],
        desfecho: "COMPROMETIDO",
        desenlace:
          "A conta dela foi tomada e usada para pedir dinheiro aos contactos mais próximos, que é o passo seguinte habitual. A fotografia estava na galeria da própria conta. O afecto é a alavanca aqui, não o medo, e é por isso que este golpe funciona tão bem com pessoas cuidadosas. Uma chamada de dez segundos teria bastado.",
      },
    ],
  },
  {
    slug: "email-documento",
    titulo: "O documento partilhado",
    canal: "EMAIL",
    remetente: "no-reply@docs-partilha.com",
    contexto:
      "Estás a acabar um trabalho de grupo. Chega um email a dizer que um colega partilhou um documento contigo.",
    ehFraude: true,
    moduloMinimo: 2,
    ordem: 5,
    licao:
      "Uma página que pede a palavra-passe do email para mostrar um documento não faz sentido nenhum. O pedido é o sinal, mesmo quando tudo o resto parece certo.",
    nos: [
      {
        chave: "inicio",
        mensagens: [
          'Um documento foi partilhado consigo: "Trabalho_Grupo_Final_v3.docx"',
          "Clique para visualizar.",
        ],
        escolhas: [
          { texto: "Abrir o documento", proximo: "abriu" },
          {
            texto: "Perguntar ao colega se partilhou alguma coisa",
            proximo: "perguntou",
          },
        ],
      },
      {
        chave: "perguntou",
        mensagens: [
          "*Mandaste mensagem ao colega.*",
          '*Resposta: "Não partilhei nada contigo hoje."*',
        ],
        desfecho: "SEGURO",
        desenlace:
          "Uma pergunta de dez segundos resolveu. Nota que o nome do ficheiro era plausível, porque estás mesmo a fazer um trabalho de grupo, e essa coincidência não é sorte do atacante: mensagens deste tipo são enviadas em massa precisamente porque acertam em muita gente.",
      },
      {
        chave: "abriu",
        mensagens: [
          "*A página abre com o aspecto de um serviço de documentos.*",
          "*Mostra a primeira página do documento, desfocada.*",
          '*"Inicie sessão com o seu email para visualizar o documento completo."*',
        ],
        escolhas: [
          { texto: "Escrever o email e a palavra-passe", proximo: "escreveu" },
          {
            texto:
              "Parar: nenhum documento precisa da minha palavra-passe de email",
            proximo: "parou",
          },
        ],
      },
      {
        chave: "parou",
        mensagens: [
          "*Fechaste a página.*",
          "*O documento desfocado era uma imagem, não havia documento nenhum por trás.*",
        ],
        desfecho: "SEGURO",
        desenlace:
          "O pedido era o sinal, e reconheceste-o mesmo com a página bem feita. Um serviço de partilha usa a sessão que já tens aberta, ou envia um link directo, nunca pede a palavra-passe do teu email numa página própria. A pré-visualização desfocada existe para criar curiosidade e apressar a decisão.",
      },
      {
        chave: "escreveu",
        mensagens: [
          '*"A carregar documento…"*',
          "*A página redirecciona para o teu email verdadeiro, já com sessão iniciada.*",
          "*Parece que nada aconteceu.*",
        ],
        desfecho: "COMPROMETIDO",
        desenlace:
          "O redireccionamento final é a parte mais bem pensada do ataque: deixa a sensação de normalidade e adia a suspeita durante dias. As credenciais foram capturadas no momento do envio. A partir do email, o atacante pede recuperação de palavra-passe nos outros serviços e recebe os códigos na caixa que acabou de tomar.",
      },
    ],
  },
  {
    slug: "spear-dirigido",
    titulo: "Sabem o teu nome",
    canal: "EMAIL",
    remetente: "coordenacao.estagios@isaf-ao.org",
    contexto:
      "Uma mensagem que te trata pelo nome, refere o teu curso e menciona o estágio.",
    ehFraude: true,
    moduloMinimo: 3,
    ordem: 6,
    licao:
      "Saber coisas sobre ti não prova identidade. Contra o spear phishing, procurar erros não chega, porque não os há: o que continua a valer é confirmar por um canal que escolheste tu.",
    nos: [
      {
        chave: "inicio",
        mensagens: [
          "Bom dia,",
          "No âmbito do processo de colocação em estágio dos finalistas de Informática de Gestão Financeira, precisamos de confirmar os seus dados antes da submissão à entidade de acolhimento.",
          "O prazo termina hoje às 17h. Aceda ao formulário para confirmar.",
          "Coordenação de Estágios",
        ],
        escolhas: [
          {
            texto:
              "Abrir o formulário, a mensagem sabe demasiado para ser falsa",
            proximo: "abriu",
          },
          { texto: "Verificar o domínio do remetente", proximo: "verificou" },
          { texto: "Ligar para a secretaria do ISAF", proximo: "ligou" },
        ],
      },
      {
        chave: "verificou",
        mensagens: [
          "*Domínio do remetente: isaf-ao.org*",
          "*O domínio oficial da instituição é isaf.ao*",
          "*São endereços diferentes, registados por pessoas diferentes.*",
        ],
        escolhas: [
          { texto: "É fraude. Reportar e apagar.", proximo: "reportou" },
          {
            texto: "Pode ser um domínio novo da escola. Abrir.",
            proximo: "abriu",
          },
        ],
      },
      {
        chave: "ligou",
        mensagens: [
          "*Ligaste para a secretaria.*",
          '*"Não enviámos nenhuma comunicação sobre estágios hoje."*',
        ],
        desfecho: "SEGURO",
        desenlace:
          "Confirmaste por um canal que escolheste tu, e é a única defesa que funciona quando a mensagem não tem erros nenhuns. Os dados que a mensagem usava, o teu nome, o curso, o estágio, circulam em listas de turma, em publicações nas redes sociais e em documentos partilhados. Nada disso prova quem escreveu.",
      },
      {
        chave: "reportou",
        mensagens: [
          "*Reportaste à secretaria e apagaste a mensagem.*",
          "*Dias depois, a escola envia um aviso a alertar os finalistas para a mesma fraude.*",
        ],
        desfecho: "SEGURO",
        desenlace:
          "Detectaste a diferença de um carácter no domínio, o que é difícil e revela atenção treinada. Reportar é a parte que muita gente esquece: um alerta atempado protege os colegas que iam receber a mesma mensagem. Comunidades que reportam sem medo detectam ataques muito mais depressa do que aquelas onde quem cai tem vergonha de o dizer.",
      },
      {
        chave: "abriu",
        mensagens: [
          "*O formulário tem o logótipo do ISAF e o teu nome já preenchido.*",
          "*Pede o número de estudante, o número do BI e os dados bancários para processamento da bolsa de estágio.*",
        ],
        escolhas: [
          {
            texto: "Preencher, os dados já lá estão de qualquer forma",
            proximo: "preencheu",
          },
          {
            texto: "Parar: o teu nome preenchido não prova nada",
            proximo: "parou",
          },
        ],
      },
      {
        chave: "parou",
        mensagens: [
          "*Fechaste sem submeter.*",
          "*Ligaste à secretaria e confirmaste que a comunicação não existia.*",
        ],
        desfecho: "SEGURO",
        desenlace:
          "Chegaste ao formulário mas paraste no ponto certo. Os dados pré-preenchidos vêm da mesma recolha que gerou a mensagem, e servem apenas para reforçar a sensação de legitimidade. Repara no que era pedido a mais: o número do BI e os dados bancários não são precisos para confirmar uma colocação.",
      },
      {
        chave: "preencheu",
        mensagens: [
          '*"Dados confirmados. Será contactado pela entidade de acolhimento."*',
          "*Duas semanas depois, é aberta uma conta em teu nome numa instituição de crédito.*",
        ],
        desfecho: "COMPROMETIDO",
        desenlace:
          "Este ataque não queria a tua palavra-passe, queria a tua identidade. Nome, número de BI e dados bancários chegam para abrir contas e contrair crédito em nome de outra pessoa. Foi dirigido a ti especificamente, com informação real recolhida antes, e por isso não tinha nenhum dos sinais habituais. A verificação fora do canal era a única defesa disponível.",
      },
    ],
  },
];

async function main() {
  console.log("A semear simulações…\n");

  for (const sim of simulacoes) {
    await prisma.simulacao.deleteMany({ where: { slug: sim.slug } });

    const criada = await prisma.simulacao.create({
      data: {
        slug: sim.slug,
        titulo: sim.titulo,
        canal: sim.canal,
        remetente: sim.remetente,
        contexto: sim.contexto,
        ehFraude: sim.ehFraude,
        licao: sim.licao,
        ordem: sim.ordem,
        moduloMinimo: sim.moduloMinimo,
      },
    });

    for (const no of sim.nos) {
      const noCriado = await prisma.noSimulacao.create({
        data: {
          chave: no.chave,
          mensagens: JSON.stringify(no.mensagens),
          desfecho: no.desfecho ?? null,
          desenlace: no.desenlace ?? null,
          simulacaoId: criada.id,
        },
      });

      if (no.escolhas) {
        for (const [i, escolha] of no.escolhas.entries()) {
          await prisma.escolhaSimulacao.create({
            data: {
              texto: escolha.texto,
              proximo: escolha.proximo,
              ordem: i + 1,
              noId: noCriado.id,
            },
          });
        }
      }
    }

    console.log(`  ${sim.slug}: ${sim.nos.length} nós`);
  }

  console.log("\nFeito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
