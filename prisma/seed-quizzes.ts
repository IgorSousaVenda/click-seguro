import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

type PerguntaSeed = {
  modulo: string;
  licaoOrdem: number;
  ordem: number;
  enunciado: string;
  dificuldade: string;
  explicacao: string;
  opcoes: { texto: string; correta?: boolean }[];
};

const perguntas: PerguntaSeed[] = [
  // ───────── Lição 1.1 — Porque é que caímos ─────────
  {
    modulo: "phishing",
    licaoOrdem: 1,
    ordem: 1,
    dificuldade: "FACIL",
    enunciado:
      'São 21h de domingo. Chega um SMS: "BFA: a sua conta será bloqueada em 2 horas por falta de validação. Regularize já." O que é que esta mensagem está a tentar fazer contigo, antes de mais?',
    opcoes: [
      { texto: "Informar-te de um problema real da conta" },
      {
        texto: "Criar pressão de tempo para não te deixar verificar",
        correta: true,
      },
      { texto: "Testar se o teu número ainda está activo" },
      { texto: "Confirmar que recebes SMS do banco" },
    ],
    explicacao:
      "As duas horas não existem para nada, a não ser para te apressar. A urgência é a primeira alavanca da [[engenharia social]], porque quem tem pressa não confere o remetente nem liga ao banco a perguntar. Repara ainda na hora: 21h de domingo, quando o balcão está fechado e não podes confirmar. Isso não é acaso, é desenho.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 1,
    ordem: 2,
    dificuldade: "MEDIA",
    enunciado:
      "Um colega teu, dos melhores alunos da turma, caiu numa fraude por email e perdeu o acesso ao Instagram. Qual é a leitura correcta do que aconteceu?",
    opcoes: [
      { texto: "Foi descuido dele, devia ter lido com mais atenção" },
      {
        texto:
          "O ataque explorou reflexos humanos normais, que não dependem de inteligência",
        correta: true,
      },
      { texto: "Ele deve ter um antivírus fraco no telemóvel" },
      { texto: "Foi azar, podia ter acontecido a qualquer altura" },
    ],
    explicacao:
      "No inquérito do ISAF, 55% dos estudantes já clicaram num link fraudulento. Se fosse questão de inteligência ou de atenção, o número seria muito mais baixo. Estes ataques funcionam porque exploram urgência, autoridade e medo de perder, que são reacções normais em qualquer pessoa. Culpar quem cai é, aliás, contraproducente: faz com que as vítimas escondam o incidente em vez de o reportarem depressa.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 1,
    ordem: 3,
    dificuldade: "MEDIA",
    enunciado:
      'Recebes um email assinado pela "Direcção Académica do ISAF" a exigir que confirmes os teus dados em 24 horas, sob pena de perderes a inscrição. Que alavancas estão a ser usadas ao mesmo tempo?',
    opcoes: [
      { texto: "Apenas urgência" },
      { texto: "Apenas autoridade" },
      { texto: "Urgência, autoridade e medo de perder", correta: true },
      { texto: "Nenhuma, é um pedido administrativo normal" },
    ],
    explicacao:
      "As três estão presentes e reforçam-se: o prazo de 24 horas é urgência, o nome da Direcção Académica é autoridade, e perder a inscrição é medo de perder algo importante. Quando várias alavancas aparecem juntas na mesma mensagem, o sinal de alarme deve ser maior, não menor. Uma instituição séria comunica prazos com antecedência e por canais que já conheces.",
  },

  // ───────── Lição 1.2 — Anatomia de uma mensagem falsa ─────────
  {
    modulo: "phishing",
    licaoOrdem: 2,
    ordem: 1,
    dificuldade: "MEDIA",
    enunciado:
      'O email mostra o remetente "Banco BFA". Ao expandires, o endereço real é "seguranca@bfa-clientes-online.info". O que é que isto te diz?',
    opcoes: [
      { texto: "Nada de especial, os bancos usam vários domínios" },
      {
        texto: "É fraude: o domínio verdadeiro não pertence ao banco",
        correta: true,
      },
      { texto: "É legítimo, porque tem a palavra bfa no endereço" },
      { texto: "Depende de o email ter o logótipo correcto" },
    ],
    explicacao:
      'O nome que aparece no remetente é escrito por quem envia e não prova nada. O que conta é o domínio, a parte depois do arroba. Ter "bfa" lá dentro não ajuda: qualquer pessoa pode registar um domínio com o nome de um banco. O logótipo também não serve de prova, porque se copia de uma imagem do site oficial em segundos.',
  },
  {
    modulo: "phishing",
    licaoOrdem: 2,
    ordem: 2,
    dificuldade: "DIFICIL",
    enunciado:
      "Abres uma página que pede as tuas credenciais. Tem cadeado, o endereço começa por https e o desenho está igual ao do site oficial. É seguro entrar?",
    opcoes: [
      { texto: "Sim, o cadeado garante que o site é legítimo" },
      { texto: "Sim, se o desenho estiver igual ao oficial" },
      {
        texto: "Não, o cadeado só garante que a ligação está cifrada",
        correta: true,
      },
      { texto: "Só se o endereço também tiver o nome da instituição" },
    ],
    explicacao:
      "Esta é a confusão mais comum de todas. O [[https]] cifra o que viaja entre ti e o site, ou seja, impede que alguém espreite a conversa pelo caminho. Não diz nada sobre quem está do outro lado. Sites fraudulentos usam cadeado quase sempre, precisamente porque sabem que confiamos nele. O que tens de verificar é o domínio, não o cadeado.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 2,
    ordem: 3,
    dificuldade: "FACIL",
    enunciado:
      "Qual destes pedidos, vindo por email ou SMS, é sempre fraude, sem excepção?",
    opcoes: [
      { texto: "Pedir que ligues para o número do balcão" },
      { texto: "Pedir que te dirijas a uma agência" },
      {
        texto: "Pedir a tua palavra-passe ou o código recebido por SMS",
        correta: true,
      },
      { texto: "Pedir que actualizes a aplicação do banco" },
    ],
    explicacao:
      "Nenhuma instituição séria pede a palavra-passe ou o código de confirmação por mensagem, telefone ou email. Nenhuma, em circunstância alguma. Esta é a única regra deste módulo que não tem excepções, e por isso é a mais útil: quando o pedido aparece, não precisas de analisar mais nada.",
  },

  // ───────── Lição 1.3 — Não é só no email ─────────
  {
    modulo: "phishing",
    licaoOrdem: 3,
    ordem: 1,
    dificuldade: "MEDIA",
    enunciado:
      "Porque é que a fraude por SMS, o [[smishing]], costuma ser mais eficaz do que a fraude por email?",
    opcoes: [
      { texto: "Porque os SMS não podem ser bloqueados" },
      {
        texto:
          "Porque o ecrã é pequeno, o link aparece encurtado e estamos distraídos",
        correta: true,
      },
      { texto: "Porque as operadoras não filtram mensagens" },
      { texto: "Porque os SMS chegam mais depressa que os emails" },
    ],
    explicacao:
      "No telemóvel falta-te o contexto que o computador dá: não vês o endereço completo do link, o remetente aparece truncado, e normalmente estás a fazer outra coisa ao mesmo tempo. A verificação que farias com calma no email simplesmente não acontece. Para veres o destino real de um link no telemóvel, mantém o dedo pressionado sobre ele sem largar.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 3,
    ordem: 2,
    dificuldade: "DIFICIL",
    enunciado:
      'Ligam-te: "Falo da segurança do seu banco, detectámos uma transferência suspeita. Para cancelar, leia-me o código que acabou de receber." A voz é calma e profissional. O que fazes?',
    opcoes: [
      { texto: "Dás o código, porque a transferência tem de ser travada já" },
      { texto: "Pedes o nome do funcionário e depois dás o código" },
      {
        texto: "Desligas e ligas tu para o número oficial do banco",
        correta: true,
      },
      {
        texto:
          "Confirmas primeiro os teus dados pessoais para provar a identidade",
      },
    ],
    explicacao:
      "Isto é [[vishing]], e é o canal mais eficaz porque há uma pessoa a falar contigo. Pedir o nome não resolve nada, porque quem inventou a chamada inventa também um nome. O código serve exactamente para autorizar a operação que o atacante está a tentar fazer neste momento: ao lê-lo, és tu que aprovas. A única saída segura é desligar e ligar tu para o número que já conheces.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 3,
    ordem: 3,
    dificuldade: "DIFICIL",
    enunciado:
      "Recebes uma mensagem que trata o teu nome completo, refere o teu curso no ISAF e menciona o local onde estás a estagiar. Que tipo de ataque é este?",
    opcoes: [
      { texto: "Phishing comum, enviado em massa" },
      {
        texto: "[[spear phishing]], dirigido a ti com informação real",
        correta: true,
      },
      { texto: "Não é ataque, quem sabe isso tudo é de confiança" },
      { texto: "Um erro, a mensagem era para outra pessoa" },
    ],
    explicacao:
      "Saber coisas sobre ti não prova identidade nenhuma. O curso, o estágio e o nome completo estão frequentemente nas redes sociais ou em listas que circulam. É essa informação que torna o [[spear phishing]] tão perigoso: a mensagem parece pessoal e por isso baixamos a guarda. Contra este tipo de ataque, procurar erros de escrita não chega, porque não os há. O que continua a valer é a regra do canal: confirma por uma via que escolheste tu.",
  },
  // ───────── Lição 2.1 — Uma senha, muitas portas ─────────
  {
    modulo: "palavras-passe",
    licaoOrdem: 1,
    ordem: 1,
    dificuldade: "MEDIA",
    enunciado:
      "Uma loja online onde compraste uma vez, há três anos, sofre uma fuga de dados. Usaste lá a mesma palavra-passe do teu email. Qual é o risco real?",
    opcoes: [
      { texto: "Nenhum, a loja não tem nada de importante teu" },
      { texto: "Só perdes a conta da loja" },
      {
        texto:
          "Podem entrar no teu email, e a partir daí em quase tudo o resto",
        correta: true,
      },
      { texto: "Só há risco se tiveres deixado lá o cartão guardado" },
    ],
    explicacao:
      "As credenciais roubadas de um site acabam à venda, e são testadas automaticamente noutros serviços. Chama-se [[credential stuffing]] e não exige esforço nenhum: são milhões de tentativas por hora. O email é a peça mais valiosa, porque quem lá entra pede recuperação de palavra-passe em todo o resto e recebe os códigos. A loja não importa, o que importa é a chave que lá deixaste.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 1,
    ordem: 2,
    dificuldade: "FACIL",
    enunciado:
      "Se só tivesses tempo para proteger uma conta a sério hoje, qual devia ser?",
    opcoes: [
      { texto: "O Instagram, porque é a que usas mais" },
      { texto: "O email, porque recupera todas as outras", correta: true },
      { texto: "A conta do banco, porque tem dinheiro" },
      { texto: "O WhatsApp, porque tem as conversas privadas" },
    ],
    explicacao:
      'O email é a conta que abre todas as portas. Quem o controla clica em "esqueci-me da palavra-passe" no banco, nas redes sociais e nos serviços da faculdade, e recebe os códigos de recuperação na própria caixa que acabou de tomar. Proteger primeiro o banco sem proteger o email é trancar a porta e deixar a chave debaixo do tapete.',
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 1,
    ordem: 3,
    dificuldade: "MEDIA",
    enunciado:
      "Usas a mesma base em todo o lado, mudando só o fim: Kwanza2024Face, Kwanza2024Insta, Kwanza2024Mail. Isto resolve o problema da reutilização?",
    opcoes: [
      { texto: "Sim, porque cada palavra-passe é tecnicamente diferente" },
      {
        texto: "Não, porque o padrão é evidente para quem vê uma delas",
        correta: true,
      },
      { texto: "Sim, desde que a base seja comprida" },
      { texto: "Depende de teres números e maiúsculas" },
    ],
    explicacao:
      "Basta uma fuga para o padrão ficar exposto. Quem vir Kwanza2024Face testa de imediato as variantes óbvias para o email e para o banco, e isso é feito por programas, não à mão. A variação previsível dá a sensação de segurança sem a substância. O que protege é que as palavras-passe não tenham relação nenhuma entre si.",
  },

  // ───────── Lição 2.2 — Frases em vez de palavras ─────────
  {
    modulo: "palavras-passe",
    licaoOrdem: 2,
    ordem: 1,
    dificuldade: "MEDIA",
    enunciado: "Qual destas resiste melhor a um ataque automatizado?",
    opcoes: [
      { texto: "S3gur@nc@2026!" },
      { texto: "chuva-bussola-manga-quarenta", correta: true },
      { texto: "Isaf#2026" },
      { texto: "P@ssw0rd!" },
    ],
    explicacao:
      "As três primeiras são curtas e assentam em palavras comuns com substituições previsíveis. Trocar a por arroba e o por zero é a primeira coisa que os programas testam, porque essas regras estão nas listas há décadas. A frase-passe ganha por comprimento e por imprevisibilidade: quatro palavras sem relação entre si dão muito mais combinações do que treze caracteres com um padrão conhecido, e ainda por cima é mais fácil de decorar.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 2,
    ordem: 2,
    dificuldade: "DIFICIL",
    enunciado:
      'Um colega escolheu a frase-passe "benfica-luanda-2004-igor". É longa, tem quatro elementos e traços a separar. Está bem escolhida?',
    opcoes: [
      { texto: "Sim, tem mais de 20 caracteres" },
      { texto: "Sim, porque usa o formato de frase-passe" },
      {
        texto: "Não, cada elemento é adivinhável para quem o conhece",
        correta: true,
      },
      { texto: "Não, faltam-lhe símbolos e maiúsculas" },
    ],
    explicacao:
      "O formato está certo, o conteúdo é que não. O clube, a cidade, o ano de nascimento e o nome próprio estão provavelmente no perfil público dele. Um ataque dirigido começa exactamente por aí, combinando dados pessoais recolhidos das redes sociais. O comprimento só protege quando as palavras são imprevisíveis: têm de estar desligadas umas das outras e da vida de quem as escolhe.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 2,
    ordem: 3,
    dificuldade: "FACIL",
    enunciado: "O que torna uma palavra-passe difícil de quebrar?",
    opcoes: [
      { texto: "Parecer complicada, com muitos símbolos" },
      { texto: "Ser comprida e imprevisível", correta: true },
      { texto: "Ser trocada todos os meses" },
      { texto: "Ter pelo menos um número e uma maiúscula" },
    ],
    explicacao:
      "Fomos treinados a confundir aspecto complicado com força real. Uma palavra-passe cheia de símbolos mas curta e assente num termo comum cai depressa. As trocas mensais obrigatórias, aliás, costumam piorar as escolhas, porque levam as pessoas a usar variações previsíveis. O que conta mesmo é o comprimento combinado com a ausência de padrão.",
  },

  // ───────── Lição 2.3 — Quem guarda por ti ─────────
  {
    modulo: "palavras-passe",
    licaoOrdem: 3,
    ordem: 1,
    dificuldade: "MEDIA",
    enunciado:
      '"Se guardo tudo num só sítio e esse sítio for comprometido, perco tudo de uma vez." O que responder a esta objecção?',
    opcoes: [
      { texto: "É verdade, por isso é melhor decorar as palavras-passe" },
      { texto: "É verdade, mas vale a pena correr o risco pela comodidade" },
      {
        texto:
          "O cofre usa cifra de conhecimento zero: nem o fornecedor consegue ler o conteúdo",
        correta: true,
      },
      { texto: "Não faz diferença, o risco é o mesmo em qualquer caso" },
    ],
    explicacao:
      "A objecção é legítima e merece resposta técnica, não encolher de ombros. Nos [[gestor de palavras-passe]] sérios, o conteúdo é cifrado no teu dispositivo com uma chave derivada da tua frase-passe principal, e essa chave nunca é enviada. Mesmo que os servidores da empresa sejam invadidos, o que lá está é ilegível. Compara com a alternativa real, que é a mesma palavra-passe repetida em vinte sítios, cada um deles um ponto de falha.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 3,
    ordem: 2,
    dificuldade: "FACIL",
    enunciado:
      "Depois de instalares um gestor de palavras-passe, quantas passas a ter de decorar?",
    opcoes: [
      { texto: "Nenhuma, o gestor trata de tudo" },
      { texto: "Uma, a frase-passe principal do cofre", correta: true },
      { texto: "Três ou quatro, as das contas mais importantes" },
      { texto: "As mesmas de antes, o gestor só as organiza" },
    ],
    explicacao:
      "Decoras uma, e essa tem de ser longa e imprevisível, porque protege todas as outras. É o que torna o gestor viável: o problema nunca foi falta de vontade, foi o limite humano de memorizar vinte segredos diferentes. No ISAF apenas 15% dos estudantes usam um, o que é a maior oportunidade de melhoria que os dados revelam.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 3,
    ordem: 3,
    dificuldade: "DIFICIL",
    enunciado:
      "Estás a criar conta num serviço novo e o gestor propõe uma palavra-passe de 20 caracteres aleatórios. Qual é a vantagem principal?",
    opcoes: [
      { texto: "É mais rápido do que inventar uma" },
      {
        texto: "Não tem padrão nem relação contigo, e é única nesse serviço",
        correta: true,
      },
      { texto: "Fica guardada na nuvem automaticamente" },
      { texto: "Cumpre os requisitos de qualquer formulário" },
    ],
    explicacao:
      "Uma palavra-passe gerada não passa pela tua cabeça, e é isso que a torna forte: não tem a tua data de nascimento, nem o nome do teu bairro, nem o padrão que costumas usar. Sendo única, uma fuga naquele serviço não contamina mais nenhum. Como não precisas de a decorar, o comprimento deixa de ser um incómodo.",
  },

  // ───────── Lição 3.1 — Quando a senha já não chega ─────────
  {
    modulo: "autenticacao",
    licaoOrdem: 1,
    ordem: 1,
    dificuldade: "MEDIA",
    enunciado:
      "Caíste numa página falsa e escreveste lá a tua palavra-passe, que era longa e única. O que te pode salvar a conta?",
    opcoes: [
      { texto: "O comprimento da palavra-passe" },
      { texto: "O facto de ser única nesse serviço" },
      { texto: "Ter [[autenticação em duas etapas]] activa", correta: true },
      { texto: "Ter um antivírus instalado no computador" },
    ],
    explicacao:
      "Nenhuma palavra-passe resiste a ser entregue de livre vontade. Depois de escrita numa página falsa, o comprimento deixa de importar, porque o atacante não a quebrou, recebeu-a. O segundo factor é a única barreira que continua de pé nesse cenário: quem tem a palavra-passe fica parado no passo seguinte, sem o código ou o dispositivo.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 1,
    ordem: 2,
    dificuldade: "FACIL",
    enunciado:
      'A autenticação em duas etapas combina factores de naturezas diferentes. Qual destes é do tipo "algo que tens"?',
    opcoes: [
      { texto: "A palavra-passe" },
      { texto: "A resposta a uma pergunta de segurança" },
      { texto: "O código gerado na aplicação do telemóvel", correta: true },
      { texto: "A impressão digital" },
    ],
    explicacao:
      "São três categorias: algo que sabes, como a palavra-passe ou a pergunta de segurança; algo que tens, como o telemóvel ou uma chave física; e algo que és, como a impressão digital ou o rosto. A força vem de combinar categorias diferentes. Palavra-passe mais pergunta de segurança não é duas etapas, porque ambas são coisas que se sabem, e ambas se descobrem da mesma maneira.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 1,
    ordem: 3,
    dificuldade: "MEDIA",
    enunciado:
      "No inquérito do ISAF, 24% dos estudantes não usam nem sabem o que é a autenticação em duas etapas. Qual é a consequência mais directa?",
    opcoes: [
      { texto: "As contas ficam mais lentas a abrir" },
      {
        texto: "Uma palavra-passe roubada dá acesso imediato à conta",
        correta: true,
      },
      { texto: "Não conseguem recuperar a conta se a esquecerem" },
      { texto: "Recebem mais mensagens de phishing" },
    ],
    explicacao:
      "Sem segundo factor, a palavra-passe é a única barreira, e já vimos as várias formas de a obter: fuga de dados noutro serviço, página falsa, chamada a pedir confirmação. Com segundo factor, cada uma dessas vias deixa de ser suficiente por si só. É a protecção que continua a funcionar depois de tudo o resto falhar.",
  },

  // ───────── Lição 3.2 — Nem todos os segundos factores são iguais ─────────
  {
    modulo: "autenticacao",
    licaoOrdem: 2,
    ordem: 1,
    dificuldade: "DIFICIL",
    enunciado:
      "Recebes um SMS a avisar que o teu cartão SIM será substituído dentro de duas horas. Não pediste nada. O que está provavelmente a acontecer?",
    opcoes: [
      { texto: "Uma actualização de rede da operadora" },
      {
        texto:
          "Uma tentativa de [[troca fraudulenta de cartão SIM]] para interceptar os teus códigos",
        correta: true,
      },
      { texto: "Um erro do sistema da operadora" },
      { texto: "Publicidade a um plano novo" },
    ],
    explicacao:
      "O atacante recolhe dados teus e convence a operadora a transferir o teu número para um cartão que ele controla. Quando o teu telemóvel fica sem rede, já é tarde: os códigos por SMS passam a chegar a ele. Age depressa, contactando a operadora por outra via, e é exactamente por isto que o SMS é o segundo factor mais frágil.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 2,
    ordem: 2,
    dificuldade: "MEDIA",
    enunciado:
      "Porque é que a aplicação autenticadora é mais segura do que receber códigos por SMS?",
    opcoes: [
      { texto: "Porque gera códigos mais compridos" },
      {
        texto:
          "Porque gera os códigos no próprio telemóvel, sem passar pela rede",
        correta: true,
      },
      { texto: "Porque exige palavra-passe para abrir" },
      { texto: "Porque funciona em qualquer país" },
    ],
    explicacao:
      "O código nasce dentro do dispositivo, a partir de um segredo partilhado no momento da configuração, e não viaja por lado nenhum. Não há SMS para interceptar nem operadora para enganar, o que elimina de uma vez a via da troca fraudulenta de cartão SIM. Funcionar sem rede é um efeito secundário útil, mas não é a razão de segurança.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 2,
    ordem: 3,
    dificuldade: "MEDIA",
    enunciado:
      "Usas hoje códigos por SMS e queres passar para uma aplicação autenticadora. Qual é a ordem certa?",
    opcoes: [
      { texto: "Remover o SMS primeiro, para não haver confusão" },
      {
        texto:
          "Activar a aplicação, confirmar que funciona, e só depois remover o SMS",
        correta: true,
      },
      { texto: "Desactivar o segundo factor e voltar a activá-lo do zero" },
      { texto: "Tanto faz, o resultado final é o mesmo" },
    ],
    explicacao:
      "Se removeres o SMS antes de confirmares que a aplicação funciona, arriscas ficar sem forma de entrar na conta. A regra é simples: nunca tires a rede de segurança antes de a nova estar montada e testada. Faz o teste de entrada com o código da aplicação enquanto ainda tens o SMS activo.",
  },

  // ───────── Lição 3.3 — Activar e não ficar de fora ─────────
  {
    modulo: "autenticacao",
    licaoOrdem: 3,
    ordem: 1,
    dificuldade: "FACIL",
    enunciado:
      "Ao activar o segundo factor, o serviço mostra uma lista de códigos de uso único. Para que servem?",
    opcoes: [
      { texto: "São os códigos que vais usar em cada entrada" },
      {
        texto: "Servem para entrar caso percas o acesso ao telemóvel",
        correta: true,
      },
      { texto: "São o histórico das entradas anteriores" },
      { texto: "Servem para partilhar a conta com outra pessoa" },
    ],
    explicacao:
      "São a porta de emergência, e cada um funciona uma única vez. Perder o telemóvel é o medo que trava mais gente na hora de activar o segundo factor, e estes códigos são precisamente a resposta a esse medo. A maioria das pessoas fecha a janela sem os guardar, e é aí que o problema nasce.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 3,
    ordem: 2,
    dificuldade: "MEDIA",
    enunciado: "Onde é que os códigos de recuperação não devem ser guardados?",
    opcoes: [
      { texto: "Impressos numa folha em casa" },
      {
        texto: 'Num ficheiro chamado "codigos" no ambiente de trabalho',
        correta: true,
      },
      { texto: "No gestor de palavras-passe, se estiver noutro dispositivo" },
      { texto: "Escritos num caderno guardado com outros documentos" },
    ],
    explicacao:
      "Um ficheiro de texto com esse nome no computador é a primeira coisa que qualquer programa malicioso procura, e anula a protecção que os códigos deviam garantir. O papel funciona bem, porque não está ligado à rede. O gestor também serve, desde que não seja o mesmo dispositivo que perderias, senão ficas sem os dois ao mesmo tempo.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 3,
    ordem: 3,
    dificuldade: "MEDIA",
    enunciado:
      "Vais activar segundo factor hoje e tens tempo para três contas. Por qual começas?",
    opcoes: [
      { texto: "Pelas redes sociais, que são as mais usadas" },
      {
        texto: "Pelo email, depois banco, depois redes sociais",
        correta: true,
      },
      { texto: "Pelo banco, porque é onde está o dinheiro" },
      { texto: "Pela conta da faculdade, por causa das notas" },
    ],
    explicacao:
      "A ordem segue o efeito de dominó. O email recupera todas as outras contas, por isso protegê-lo primeiro fecha a via mais aproveitada. Depois vêm os serviços financeiros, pelo impacto directo, e a seguir as redes sociais, sobretudo aquelas com conversas privadas que podem ser usadas para enganar as pessoas próximas de ti.",
  },
  // ───────── Banco adicional: Lição 1.1 ─────────
  {
    modulo: "phishing",
    licaoOrdem: 1,
    ordem: 4,
    dificuldade: "MEDIA",
    enunciado:
      'Chega um email: "Parabéns! Foste seleccionado para uma bolsa de estudo. Confirma os teus dados nas próximas 48 horas para não perderes a vaga." Não te candidataste a nada. Qual é a alavanca aqui?',
    opcoes: [
      { texto: "Só urgência, por causa do prazo" },
      {
        texto:
          "Ganância e medo de perder uma oportunidade, reforçados pelo prazo",
        correta: true,
      },
      { texto: "Autoridade, porque menciona uma instituição" },
      { texto: "Nenhuma, é uma comunicação normal de bolsas" },
    ],
    explicacao:
      "Nem todas as alavancas assustam, algumas atraem. A promessa de algo valioso funciona tão bem como a ameaça, porque o medo de perder a oportunidade tem o mesmo efeito de bloquear a verificação. O sinal mais claro é que não te candidataste: ninguém te dá o que não pediste. Quando a boa notícia chega com prazo apertado, desconfia na mesma.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 1,
    ordem: 5,
    dificuldade: "FACIL",
    enunciado:
      "Uma mensagem legítima do teu banco e uma mensagem fraudulenta podem ser muito parecidas. Qual é o comportamento mais seguro em qualquer dos casos?",
    opcoes: [
      { texto: "Responder à mensagem a pedir confirmação" },
      { texto: "Clicar no link e ver se a página parece oficial" },
      {
        texto:
          "Não usar o que veio na mensagem e contactar o banco por uma via que já conheces",
        correta: true,
      },
      { texto: "Esperar para ver se chega outra mensagem igual" },
    ],
    explicacao:
      "Se a mensagem for fraudulenta, tudo o que ela contém pertence ao atacante: o link, o número de telefone, o endereço de resposta. Verificar dentro da própria mensagem é pedir ao burlão que confirme a sua honestidade. Sair para um canal que escolheste tu funciona nos dois cenários, e não te custa nada quando a mensagem afinal era verdadeira.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 1,
    ordem: 6,
    dificuldade: "MEDIA",
    enunciado:
      "Porque é que muitas mensagens fraudulentas chegam à noite, ao fim de semana ou em vésperas de feriado?",
    opcoes: [
      { texto: "Porque a internet está mais rápida a essas horas" },
      {
        texto: "Porque os canais oficiais estão fechados e não podes confirmar",
        correta: true,
      },
      { texto: "Porque as pessoas usam mais o telemóvel nessas alturas" },
      { texto: "É coincidência, o envio é automático" },
    ],
    explicacao:
      "O momento faz parte do ataque. Com o balcão fechado e a linha de apoio indisponível, ficas sozinho com a decisão e com o relógio a correr. A escolha do horário é tão deliberada como o texto da mensagem. Se não consegues confirmar agora, a resposta certa é esperar: nenhuma instituição séria te penaliza por confirmares no dia seguinte.",
  },

  // ───────── Banco adicional: Lição 1.2 ─────────
  {
    modulo: "phishing",
    licaoOrdem: 2,
    ordem: 4,
    dificuldade: "MEDIA",
    enunciado:
      'O email começa com "Caro cliente" em vez do teu nome. Por si só, o que é que isto indica?',
    opcoes: [
      { texto: "Que é seguramente fraude" },
      {
        texto: "Que é um envio em massa, o que é um sinal a somar aos outros",
        correta: true,
      },
      { texto: "Que o sistema do banco está com problemas" },
      { texto: "Nada, é a forma habitual de tratamento" },
    ],
    explicacao:
      "É um indício, não uma prova. Instituições legítimas também enviam comunicações genéricas, e um atacante que te estude pode escrever o teu nome correctamente. Por isso os sinais somam-se em vez de decidirem sozinhos: saudação genérica, mais prazo apertado, mais pedido de dados, é um conjunto que fala por si.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 2,
    ordem: 5,
    dificuldade: "DIFICIL",
    enunciado:
      "Estás no telemóvel e queres ver para onde aponta um link antes de clicar. Como fazes?",
    opcoes: [
      { texto: "Clicas e voltas atrás se a página parecer estranha" },
      {
        texto:
          "Mantens o dedo pressionado sobre o link até aparecer o endereço",
        correta: true,
      },
      { texto: "Copias o link e colas noutra mensagem para o leres" },
      { texto: "Não é possível verificar links no telemóvel" },
    ],
    explicacao:
      "Manter o dedo pressionado abre um menu que mostra o endereço completo, sem abrir nada. Clicar para ver já é tarde: basta abrir a página para o atacante saber que o teu contacto está activo, e algumas páginas tentam explorar o navegador logo à entrada. Esta é a verificação que quase ninguém faz no telemóvel, e é precisamente por isso que o [[smishing]] funciona tão bem.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 2,
    ordem: 6,
    dificuldade: "DIFICIL",
    enunciado:
      'Recebes um email de "servico@bfa.co.ao-clientes.net". O domínio parece conter o do banco. É legítimo?',
    opcoes: [
      { texto: "Sim, começa pelo domínio oficial do banco" },
      {
        texto:
          "Não, o domínio verdadeiro é o que está mesmo antes da barra, aqui ao-clientes.net",
        correta: true,
      },
      { texto: "Sim, desde que termine em .net" },
      { texto: "Não é possível saber apenas pelo endereço" },
    ],
    explicacao:
      "O domínio real é sempre a última parte antes da primeira barra, lida da direita para a esquerda. Tudo o que vem antes pode ser inventado por quem registou o domínio, incluindo o nome de um banco. É um truque muito usado, porque o olho lê da esquerda para a direita, reconhece o nome familiar logo no início e pára aí. Treina-te a ler o fim do endereço primeiro.",
  },

  // ───────── Banco adicional: Lição 1.3 ─────────
  {
    modulo: "phishing",
    licaoOrdem: 3,
    ordem: 4,
    dificuldade: "MEDIA",
    enunciado:
      'Uma mensagem de WhatsApp do número da tua irmã: "Perdi o telemóvel, estou com outro número. Preciso que me faças uma transferência urgente, depois explico." O que fazes?',
    opcoes: [
      { texto: "Transferes, porque é a tua irmã e é urgente" },
      { texto: "Respondes a pedir mais detalhes por escrito" },
      {
        texto: "Ligas para o número antigo dela ou para alguém que a veja hoje",
        correta: true,
      },
      { texto: "Pedes que envie uma foto para confirmar" },
    ],
    explicacao:
      "Contas de WhatsApp são tomadas com frequência, e o pedido de dinheiro a contactos próximos é o passo seguinte. Responder por escrito não prova nada, porque quem controla a conta responde a tudo. Fotos também não, podem estar na galeria da conta tomada. Confirmar por voz, ou através de alguém que a veja, é o que funciona. Combina em família um código para estas situações.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 3,
    ordem: 5,
    dificuldade: "FACIL",
    enunciado: "Qual destes canais está livre de fraude por engenharia social?",
    opcoes: [
      { texto: "O email, se tiver filtro de spam" },
      { texto: "A chamada telefónica, porque se ouve a voz" },
      { texto: "Nenhum, todos podem ser usados", correta: true },
      { texto: "O SMS, porque as operadoras verificam os remetentes" },
    ],
    explicacao:
      "Email, SMS, chamada, mensagem instantânea, redes sociais e até o contacto presencial: todos servem, porque o alvo é a pessoa, não o canal. Filtros de spam apanham parte, nunca tudo. A voz não prova identidade, e o remetente de um SMS pode ser falsificado. A defesa não é escolher o canal seguro, é o hábito de confirmar por uma via que escolheste tu.",
  },
  {
    modulo: "phishing",
    licaoOrdem: 3,
    ordem: 6,
    dificuldade: "MEDIA",
    enunciado:
      "Numa chamada, a pessoa diz o teu nome completo, o teu número de conta parcial e a tua morada. Isso prova que é mesmo do banco?",
    opcoes: [
      { texto: "Sim, só o banco tem esses dados" },
      {
        texto: "Não, esses dados circulam em fugas e podem ser recolhidos",
        correta: true,
      },
      { texto: "Sim, desde que acerte no número de conta" },
      { texto: "Depende de o número de telefone ser o oficial" },
    ],
    explicacao:
      "Saber coisas sobre ti nunca prova identidade, e é exactamente essa suposição que o atacante explora. Dados pessoais circulam em fugas antigas, em documentos partilhados e nas redes sociais. Nem o número de telefone serve de garantia, porque a origem de uma chamada pode ser falsificada. A prova só vale num sentido: és tu que ligas para o número oficial.",
  },
  // ───────── Banco adicional: Lição 2.1 ─────────
  {
    modulo: "palavras-passe",
    licaoOrdem: 1,
    ordem: 4,
    dificuldade: "DIFICIL",
    enunciado:
      "Usas uma palavra-passe fortíssima, com 25 caracteres aleatórios, mas é a mesma no email, no banco e numa loja online. Que nível de protecção tens?",
    opcoes: [
      { texto: "Muito alto, o comprimento compensa a repetição" },
      { texto: "Alto no banco, porque os bancos protegem melhor os dados" },
      { texto: "O nível do serviço mais fraco onde a usaste", correta: true },
      { texto: "Depende de teres segundo factor no email" },
    ],
    explicacao:
      "A força da palavra-passe deixa de contar quando ela é roubada inteira de um sítio onde estava mal guardada. Se a loja online guardar as credenciais sem protecção adequada e sofrer uma fuga, a tua palavra-passe de 25 caracteres aparece na lista tal como está, pronta a ser testada no banco e no email. A segurança de um conjunto é a do elo mais fraco, e nesta cadeia o elo és tu a repeti-la.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 1,
    ordem: 5,
    dificuldade: "MEDIA",
    enunciado:
      "Descobres que um serviço que usas sofreu uma fuga de dados há dois anos, e só agora soubeste. O que é mais urgente?",
    opcoes: [
      { texto: "Apagar a conta desse serviço" },
      { texto: "Mudar a palavra-passe nesse serviço" },
      {
        texto: "Mudar em todos os sítios onde usaste a mesma ou parecida",
        correta: true,
      },
      { texto: "Nada, dois anos depois já não há risco" },
    ],
    explicacao:
      "Mudar apenas no serviço afectado deixa expostas todas as outras contas onde repetiste a credencial, e são essas que valem mais. O tempo decorrido não ajuda: listas antigas continuam a circular e a ser testadas anos depois, precisamente porque as pessoas raramente mudam. Apagar a conta remove dados futuros, mas não recupera o que já saiu.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 1,
    ordem: 6,
    dificuldade: "DIFICIL",
    enunciado:
      "Um atacante tem uma lista de milhões de emails e palavras-passe de uma fuga. Porque é que ele não precisa de te escolher a ti especificamente?",
    opcoes: [
      { texto: "Porque testa tudo à mão, uma conta de cada vez" },
      {
        texto:
          "Porque os testes são automáticos e a taxa de sucesso, mesmo baixa, dá muitas contas",
        correta: true,
      },
      { texto: "Porque a lista já vem com as contas todas confirmadas" },
      { texto: "Porque só ataca contas de pessoas conhecidas" },
    ],
    explicacao:
      "Esta é a parte que mais custa a interiorizar: não há ninguém a pensar em ti. Programas testam milhões de combinações em serviços diferentes, e mesmo que só uma em cada mil funcione, são milhares de contas tomadas sem esforço nenhum. Achar que não se é alvo interessante é a suposição que torna o [[credential stuffing]] tão rentável.",
  },

  // ───────── Banco adicional: Lição 2.2 ─────────
  {
    modulo: "palavras-passe",
    licaoOrdem: 2,
    ordem: 4,
    dificuldade: "DIFICIL",
    enunciado:
      "Um site obriga a mudar a palavra-passe de três em três meses. Que efeito costuma ter esta regra no comportamento das pessoas?",
    opcoes: [
      {
        texto:
          "Melhora a segurança, porque as credenciais antigas deixam de servir",
      },
      {
        texto: "Leva a escolhas mais fracas e previsíveis a cada mudança",
        correta: true,
      },
      { texto: "Não tem efeito, as pessoas escolhem sempre bem" },
      { texto: "Obriga as pessoas a usarem gestores de palavras-passe" },
    ],
    explicacao:
      "Obrigadas a mudar com frequência, as pessoas recorrem a variações mínimas e previsíveis, acrescentando um número no fim ou trocando o mês. O resultado é uma sequência fácil de adivinhar a partir de uma única fuga. As recomendações actuais apontam para mudar quando há indício de compromisso, não por calendário, e apostar antes no comprimento e na unicidade.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 2,
    ordem: 5,
    dificuldade: "MEDIA",
    enunciado:
      "Duas frases-passe com o mesmo número de caracteres: uma é uma frase de uma música conhecida, a outra são quatro palavras sorteadas ao acaso. São igualmente fortes?",
    opcoes: [
      { texto: "Sim, o que conta é o comprimento" },
      {
        texto: "Não, a frase da música é previsível e está em listas",
        correta: true,
      },
      { texto: "Sim, desde que a música não seja muito famosa" },
      { texto: "Não, a frase da música é mais forte por ter pontuação" },
    ],
    explicacao:
      "Comprimento sem imprevisibilidade não protege. Letras de músicas, versos, provérbios e frases célebres estão em listas usadas por programas de quebra, precisamente porque são fáceis de decorar e por isso muito escolhidas. O que dá força é o sorteio: palavras sem relação entre si, que ninguém associaria naturalmente umas às outras.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 2,
    ordem: 6,
    dificuldade: "MEDIA",
    enunciado:
      'Um formulário exige "pelo menos 8 caracteres, uma maiúscula, um número e um símbolo". Cumprir isto garante uma boa palavra-passe?',
    opcoes: [
      { texto: "Sim, são os requisitos definidos por especialistas" },
      { texto: "Não, são o mínimo aceite, e o mínimo é fraco", correta: true },
      { texto: "Sim, desde que o símbolo não seja no fim" },
      { texto: "Depende do serviço em causa" },
    ],
    explicacao:
      "Requisitos de formulário definem o que o sistema aceita, não o que te protege. Oito caracteres com maiúscula, número e símbolo descreve exactamente algo como Isaf#2026, que cai depressa. A regra útil é outra: bastante mais longa do que o mínimo pedido, e única nesse serviço. Cumprir o formulário é o ponto de partida, não a meta.",
  },

  // ───────── Banco adicional: Lição 2.3 ─────────
  {
    modulo: "palavras-passe",
    licaoOrdem: 3,
    ordem: 4,
    dificuldade: "MEDIA",
    enunciado:
      "O navegador oferece-se para guardar as tuas palavras-passe. É o mesmo que usar um gestor dedicado?",
    opcoes: [
      { texto: "Sim, é exactamente a mesma coisa" },
      {
        texto:
          "É melhor do que repetir, mas fica dependente de quem tiver acesso ao dispositivo",
        correta: true,
      },
      { texto: "Não, guardar no navegador não tem qualquer protecção" },
      { texto: "É pior do que decorar uma palavra-passe só" },
    ],
    explicacao:
      "Guardar no navegador é claramente melhor do que repetir a mesma credencial em todo o lado, e serve muita gente. As diferenças estão nos pormenores: quem tiver acesso à tua sessão no computador pode consultá-las, a protecção por palavra-passe principal nem sempre está activa por omissão, e a portabilidade entre dispositivos é menor. Se for o teu caso, activa a palavra-passe principal do navegador.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 3,
    ordem: 5,
    dificuldade: "DIFICIL",
    enunciado:
      "Qual destas situações compromete realmente um gestor de palavras-passe bem configurado?",
    opcoes: [
      { texto: "Os servidores da empresa serem invadidos" },
      { texto: "Alguém descobrir a tua frase-passe principal", correta: true },
      { texto: "O serviço mudar de dono" },
      { texto: "Usares o gestor em vários dispositivos" },
    ],
    explicacao:
      "Com cifra de conhecimento zero, uma invasão aos servidores expõe conteúdo ilegível, porque a chave nunca sai do teu dispositivo. O ponto único de falha real é a frase-passe principal: quem a tiver, abre o cofre. É por isso que essa tem de ser longa e imprevisível, e é por isso que o gestor deve ter segundo factor activo, que é a barreira caso a frase-passe seja descoberta.",
  },
  {
    modulo: "palavras-passe",
    licaoOrdem: 3,
    ordem: 6,
    dificuldade: "MEDIA",
    enunciado:
      "Vais começar a usar um gestor e tens dezenas de contas antigas com a mesma palavra-passe. Por onde começas?",
    opcoes: [
      { texto: "Mudas todas de uma vez, no mesmo dia" },
      {
        texto:
          "Começas pelo email, depois pelas contas com dinheiro ou dados sensíveis",
        correta: true,
      },
      { texto: "Começas pelas contas que usas menos, para praticar" },
      { texto: "Esperas por uma fuga de dados para saber quais mudar" },
    ],
    explicacao:
      "Tentar mudar tudo de uma vez é a receita para desistir a meio, e ficar pior do que estavas se perderes acessos pelo caminho. A ordem por impacto resolve o essencial nos primeiros minutos: o email primeiro, porque recupera as outras, depois banco e serviços com dados sensíveis. As contas antigas e irrelevantes podem esperar, ou simplesmente ser eliminadas.",
  },

  // ───────── Banco adicional: Lição 3.1 ─────────
  {
    modulo: "autenticacao",
    licaoOrdem: 1,
    ordem: 4,
    dificuldade: "DIFICIL",
    enunciado:
      "Um serviço pede a palavra-passe e depois o nome da tua primeira escola. Isto é autenticação em duas etapas?",
    opcoes: [
      { texto: "Sim, são dois passos antes de entrar" },
      {
        texto:
          "Não, ambos são coisas que sabes, e descobrem-se da mesma maneira",
        correta: true,
      },
      { texto: "Sim, porque a pergunta é pessoal" },
      { texto: "Depende de a resposta ser difícil de adivinhar" },
    ],
    explicacao:
      "Dois passos não são dois factores. A força vem de combinar categorias diferentes: algo que sabes com algo que tens ou algo que és. Palavra-passe mais pergunta de segurança são as duas coisas que se sabem, e a resposta à segunda costuma até ser mais fácil de descobrir, porque está nas redes sociais ou basta perguntar a alguém que te conheça.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 1,
    ordem: 5,
    dificuldade: "MEDIA",
    enunciado:
      "Recebes um código de confirmação no telemóvel sem teres tentado entrar em lado nenhum. O que significa?",
    opcoes: [
      { texto: "É um erro do serviço, podes ignorar" },
      {
        texto: "Alguém tem a tua palavra-passe e está a tentar entrar agora",
        correta: true,
      },
      { texto: "O teu telemóvel está infectado" },
      { texto: "É publicidade disfarçada do serviço" },
    ],
    explicacao:
      "O código só é enviado depois de a palavra-passe ser aceite, por isso a sua chegada inesperada diz-te duas coisas: alguém a tem, e o segundo factor acabou de travar a entrada. Nunca partilhes esse código com ninguém, seja qual for a justificação apresentada. Muda a palavra-passe imediatamente, e verifica onde mais a usaste.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 1,
    ordem: 6,
    dificuldade: "DIFICIL",
    enunciado:
      "Com segundo factor activo, ainda há alguma forma de alguém entrar na tua conta?",
    opcoes: [
      { texto: "Não, torna-se impossível" },
      {
        texto: "Sim, se te convencerem a partilhar o código no momento certo",
        correta: true,
      },
      { texto: "Sim, mas apenas quebrando a palavra-passe" },
      { texto: "Só se tiveres uma palavra-passe fraca" },
    ],
    explicacao:
      "Nenhuma protecção é absoluta. O segundo factor elimina o ataque à distância com a palavra-passe roubada, mas continua vulnerável a que sejas tu a entregar o código, e é exactamente isso que a chamada do falso técnico do banco procura. Por isso o segundo factor não substitui o hábito de desconfiar: complementa-o. Um código pedido por outra pessoa é sempre fraude.",
  },

  // ───────── Banco adicional: Lição 3.2 ─────────
  {
    modulo: "autenticacao",
    licaoOrdem: 2,
    ordem: 4,
    dificuldade: "DIFICIL",
    enunciado:
      "Porque é que a chave física resiste a páginas falsas, ao contrário do código da aplicação autenticadora?",
    opcoes: [
      { texto: "Porque gera códigos mais longos" },
      {
        texto: "Porque verifica o endereço do site e recusa funcionar noutro",
        correta: true,
      },
      { texto: "Porque não precisa de bateria" },
      { texto: "Porque é impossível de roubar" },
    ],
    explicacao:
      "O código da aplicação és tu que o copias, e podes copiá-lo para uma página falsa sem dar por isso, entregando-o ao atacante em tempo real. A chave física verifica o endereço do site antes de responder, e numa página fraudulenta simplesmente não funciona. Essa verificação automática é o que a torna a opção mais resistente, e é uma protecção que não depende da atenção de quem a usa.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 2,
    ordem: 5,
    dificuldade: "MEDIA",
    enunciado:
      "Só tens acesso ao SMS como segundo factor num determinado serviço. O que deves fazer?",
    opcoes: [
      { texto: "Não activar nada, o SMS não vale a pena" },
      {
        texto:
          "Activar o SMS, que é muito melhor do que não ter segundo factor",
        correta: true,
      },
      { texto: "Activar e desactivar conforme a necessidade" },
      { texto: "Deixar de usar esse serviço" },
    ],
    explicacao:
      "O SMS é o mais frágil dos três, mas comparar a opção certa com a alternativa errada leva a conclusões absurdas. Sem segundo factor, uma palavra-passe roubada dá entrada imediata. Com SMS, o atacante tem de comprometer também o teu número, o que exige um passo adicional e bastante trabalho. Activa o que existe, e migra para aplicação autenticadora quando o serviço passar a suportá-la.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 2,
    ordem: 6,
    dificuldade: "MEDIA",
    enunciado: "O que torna possível a troca fraudulenta de cartão SIM?",
    opcoes: [
      { texto: "Uma falha técnica na rede da operadora" },
      {
        texto:
          "Convencer um funcionário da operadora com dados pessoais recolhidos sobre ti",
        correta: true,
      },
      { texto: "Um programa que clona o cartão à distância" },
      { texto: "Ter o telemóvel ligado a redes públicas" },
    ],
    explicacao:
      "Não há falha técnica nenhuma, o processo é o normal de substituição de cartão. O atacante apresenta-se como sendo tu, com os dados pessoais que recolheu antes, e o funcionário faz o que faria a qualquer cliente legítimo. É [[engenharia social]] aplicada ao balcão da operadora, e explica bem porque é que quanto menos dados teus circularem publicamente, melhor.",
  },

  // ───────── Banco adicional: Lição 3.3 ─────────
  {
    modulo: "autenticacao",
    licaoOrdem: 3,
    ordem: 4,
    dificuldade: "MEDIA",
    enunciado:
      "Mudas de telemóvel e instalas a aplicação autenticadora no novo. Os códigos aparecem automaticamente?",
    opcoes: [
      { texto: "Sim, basta iniciar sessão com a mesma conta" },
      {
        texto:
          "Não, é preciso transferir ou reconfigurar cada conta antes de perder o antigo",
        correta: true,
      },
      {
        texto: "Sim, os códigos são calculados a partir do número de telemóvel",
      },
      { texto: "Não, é preciso pedir novos códigos ao operador" },
    ],
    explicacao:
      "Os códigos nascem de um segredo guardado no dispositivo, e não viajam sozinhos para um telemóvel novo. Algumas aplicações oferecem exportação ou cópia cifrada, outras obrigam a reconfigurar conta a conta. Faz esta migração enquanto ainda tens o telemóvel antigo a funcionar, ou vais precisar dos códigos de recuperação para voltar a entrar.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 3,
    ordem: 5,
    dificuldade: "DIFICIL",
    enunciado:
      'Uma mensagem diz: "Detectámos uma tentativa de entrada na sua conta. Se não foi você, envie-nos o código de segurança para bloquearmos o acesso." O que fazes?',
    opcoes: [
      { texto: "Envias o código, para bloquear o acesso indevido" },
      {
        texto:
          "Não envias nada, porque o código serve para autorizar, não para bloquear",
        correta: true,
      },
      { texto: "Envias apenas os primeiros dígitos, por precaução" },
      { texto: "Respondes a perguntar quem enviou a mensagem" },
    ],
    explicacao:
      "O código de segundo factor existe para autorizar uma entrada, nunca para impedir. Um pedido para o enviar significa que alguém tem a tua palavra-passe e está bloqueado no último passo, precisando que sejas tu a abrir a porta. Enviar metade não ajuda, e responder confirma apenas que o teu contacto está activo. Se suspeitas de acesso indevido, muda a palavra-passe através da aplicação oficial.",
  },
  {
    modulo: "autenticacao",
    licaoOrdem: 3,
    ordem: 6,
    dificuldade: "MEDIA",
    enunciado:
      "Guardaste os códigos de recuperação no teu gestor de palavras-passe. Que cuidado adicional é preciso?",
    opcoes: [
      { texto: "Nenhum, o gestor é seguro" },
      {
        texto:
          "Garantir que consegues abrir o gestor sem o dispositivo que podes perder",
        correta: true,
      },
      { texto: "Mudar os códigos todos os meses" },
      { texto: "Guardar também uma cópia por email" },
    ],
    explicacao:
      "Se os códigos de recuperação do email estiverem num gestor que só abre com o telemóvel perdido, perdes os dois ao mesmo tempo e ficas de fora. O princípio é simples: a via de recuperação não pode depender daquilo de que estás a recuperar. Uma cópia impressa resolve. Guardar por email é a pior hipótese, porque é precisamente a conta que os códigos deviam recuperar.",
  },
];

async function main() {
  console.log("A semear quizzes…\n");

  for (const p of perguntas) {
    const modulo = await prisma.modulo.findUnique({
      where: { slug: p.modulo },
      include: { licoes: true },
    });

    if (!modulo) {
      console.error(`  Módulo "${p.modulo}" não encontrado.`);
      continue;
    }

    const licao = modulo.licoes.find((l) => l.ordem === p.licaoOrdem);
    if (!licao) {
      console.error(`  Lição ${p.licaoOrdem} de "${p.modulo}" não encontrada.`);
      continue;
    }

    // Remove a pergunta anterior desta posição, se existir, e recria.
    await prisma.pergunta.deleteMany({
      where: { licaoId: licao.id, ordem: p.ordem },
    });

    await prisma.pergunta.create({
      data: {
        enunciado: p.enunciado,
        explicacao: p.explicacao,
        dificuldade: p.dificuldade,
        ordem: p.ordem,
        moduloId: modulo.id,
        licaoId: licao.id,
        opcoes: {
          create: p.opcoes.map((o, i) => ({
            texto: o.texto,
            correta: o.correta ?? false,
            ordem: i + 1,
          })),
        },
      },
    });

    console.log(`  ${p.modulo} ${p.licaoOrdem}.${p.ordem} — ok`);
  }

  console.log("\nFeito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
