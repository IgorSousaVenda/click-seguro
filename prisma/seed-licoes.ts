import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

const licoes = [
  {
    modulo: "phishing",
    ordem: 1,
    titulo: "Porque é que caímos",
    duracaoEstimada: 2,
    conteudo: `> "Unitel: detectámos actividade irregular. A sua linha será suspensa em 24 horas. Confirme os seus dados aqui." A mensagem chega às 19h de uma sexta-feira.

Ninguém cai numa fraude destas por ser distraído ou pouco inteligente. Cai porque a mensagem foi construída para desligar o pensamento calmo e activar o reflexo.

A [[engenharia social]] não ataca computadores, ataca pessoas. E usa três alavancas que funcionam em qualquer um de nós:

- Urgência. "24 horas", "imediatamente", "última oportunidade". O tempo curto impede-te de verificar.
- Autoridade. O nome de uma operadora, de um banco, da universidade. Confiamos em quem parece ter poder sobre a nossa vida.
- Medo de perder. A linha suspensa, a conta bloqueada, a bolsa cancelada.

Repara que nenhuma destas alavancas tem a ver com tecnologia. Um firewall não te protege de uma emoção.

No inquérito realizado no ISAF, 55% dos estudantes admitiram já ter clicado num link fraudulento. Mais de metade. Se isso fosse uma questão de inteligência, o número seria muito mais baixo.

A defesa não é ser mais esperto, é criar um hábito: quando uma mensagem te apressa, é exactamente aí que deves abrandar.`,
  },
  {
    modulo: "phishing",
    ordem: 2,
    titulo: "Anatomia de uma mensagem falsa",
    duracaoEstimada: 3,
    conteudo: `> Um email do teu banco pede que confirmes os dados da conta antes de sexta-feira. O logótipo está certo, as cores estão certas. O link diz "banco-online-seguranca.com".

Uma mensagem de [[phishing]] bem feita parece legítima à primeira vista. Por isso não olhamos à primeira vista, verificamos por partes.

- O remetente completo, não o nome que aparece. "Banco BFA" pode esconder "servico@bfa-clientes.info". O nome exibido é escolhido por quem envia.
- O destino do link. Passa o cursor por cima sem clicar; no telemóvel, mantém o dedo pressionado. O endereço real aparece. Compara-o com o site oficial que já conheces.
- O pedido. Nenhum banco, nenhuma operadora, nenhuma instituição séria te pede a palavra-passe por mensagem. Nunca. Se pede, é fraude, e não há excepção a esta regra.
- A saudação. "Caro cliente" em vez do teu nome sugere um envio em massa.

Uma nota que engana muita gente: o cadeado e o [[https]] não significam que o site é de confiança. Significam apenas que a ligação está cifrada. Um site fraudulento também pode ter cadeado, e a maioria tem, precisamente porque sabem que confiamos nele.

O cadeado diz-te que ninguém está a espreitar a conversa. Não te diz com quem estás a conversar.`,
  },
  {
    modulo: "phishing",
    ordem: 3,
    titulo: "Não é só no email",
    duracaoEstimada: 2,
    conteudo: `> O telefone toca. "Bom dia, falo do departamento de segurança do seu banco. Detectámos uma transferência suspeita de 450 mil kwanzas. Para cancelar, preciso que me confirme o código que acabou de receber por SMS."

Associamos fraude ao email, mas o email é apenas um dos canais, e talvez já não seja o mais perigoso.

Quando a fraude chega por SMS ou por mensagem instantânea, chama-se [[smishing]]. Funciona melhor que o email por uma razão simples: no telemóvel o ecrã é pequeno, o endereço do link aparece encurtado, e estamos quase sempre a fazer outra coisa ao mesmo tempo.

Quando chega por chamada de voz, chama-se [[vishing]]. É o mais eficaz de todos, porque há uma pessoa do outro lado. Uma voz calma e profissional cria confiança de uma forma que um texto nunca consegue, e é muito mais difícil desligar o telefone na cara de alguém do que apagar um email.

Existe ainda uma variante mais preocupante, o [[spear phishing]]. Aqui o atacante estudou-te: sabe o teu nome, o teu curso, onde estagias. A mensagem já não é genérica, fala da tua vida. Contra esta, a atenção ao detalhe não chega.

A regra que serve para todos os canais: quem contacta não prova quem é. Desliga, procura o número oficial e liga tu. Se for verdade, a instituição confirma. Se for fraude, acabaste de a travar.`,
  },
  {
    modulo: "palavras-passe",
    ordem: 1,
    titulo: "Uma senha, muitas portas",
    duracaoEstimada: 2,
    conteudo: `> Uma loja online onde te registaste há três anos sofre uma fuga de dados. Nem te lembras da loja, mas usaste lá a mesma palavra-passe do teu email.

No inquérito do ISAF, 79% dos estudantes reutilizam palavras-passe, e 27% usam praticamente a mesma em tudo. É o número mais alarmante de todo o estudo, e vale a pena perceber exactamente porquê.

Quando um site é comprometido, as credenciais dos utilizadores acabam à venda. Os atacantes pegam nessas listas e experimentam-nas automaticamente noutros serviços: email, redes sociais, bancos. Milhões de tentativas por hora, sem esforço humano. Chama-se [[credential stuffing]].

Não precisam de te atacar a ti. Basta esperarem que qualquer site onde te registaste seja comprometido, e isso acontece constantemente.

O email é a peça central. Quem controla o teu email pede recuperação de palavra-passe em todo o resto e recebe os códigos. Uma conta cai, e as outras caem atrás.

Há um cruzamento nos dados do inquérito que fecha o raciocínio: entre os estudantes que já clicaram num link fraudulento, 83% reutilizam palavras-passe. As duas fragilidades andam juntas.

Se tiveres de proteger só uma conta a sério, protege o email.`,
  },
  {
    modulo: "palavras-passe",
    ordem: 2,
    titulo: "Frases em vez de palavras",
    duracaoEstimada: 2,
    conteudo: `> Pedem-te uma palavra-passe "forte". Escreves P@ssw0rd2026! e sentes que fizeste o que era pedido.

Fomos ensinados a trocar letras por símbolos e a acrescentar um número no fim. O problema é que os programas que quebram palavras-passe conhecem essas substituições melhor do que nós. Trocar "a" por "@" e "o" por "0" é a primeira coisa que testam.

O que torna uma palavra-passe difícil de quebrar não é parecer complicada, é ser comprida e imprevisível. Compara estas duas:

- P@ssw0rd2026!, com 13 caracteres, padrão previsível e base num termo comum. Cai depressa.
- chuva-bussola-manga-quarenta, com 28 caracteres e quatro palavras sem relação entre si. Resiste durante muito tempo.

A segunda é mais longa, mais fácil de decorar e muito mais resistente. Chama-se frase-passe.

A regra ao escolher as palavras é que estejam desligadas umas das outras e da tua vida. "benfica-luanda-2004-igor" parece uma frase-passe, mas cada peça é adivinhável para quem te conhece ou vê o teu perfil nas redes sociais.

Abre o teu email agora e muda a palavra-passe para uma frase-passe. Dois minutos, e é a conta que protege todas as outras.`,
  },
  {
    modulo: "palavras-passe",
    ordem: 3,
    titulo: "Quem guarda por ti",
    duracaoEstimada: 2,
    conteudo: `> Tens vinte contas. Sabes que devias ter vinte palavras-passe diferentes, e também sabes que não vais decorar vinte frases-passe.

Esta contradição é real, e é a razão pela qual tanta gente reutiliza. Não é preguiça, é um limite humano. A solução não é esforçares-te mais, é deixares de precisar de decorar.

Um [[gestor de palavras-passe]] é um cofre digital. Guarda todas as tuas credenciais cifradas, gera palavras-passe longas e diferentes para cada serviço, e preenche-as por ti. Tu decoras uma frase-passe, a do cofre, e mais nenhuma.

No ISAF, apenas 15% dos estudantes usam um. É a maior oportunidade de melhoria que os dados revelam, porque resolve o problema dos 79% de uma vez só.

A pergunta que toda a gente faz é o que acontece se o cofre for comprometido, e é a pergunta certa. Os gestores sérios usam cifra de conhecimento zero: nem a empresa que fornece o serviço consegue ler o que lá está dentro, porque a chave nunca sai do teu dispositivo.

Há opções gratuitas e de código aberto, que qualquer pessoa pode auditar. Bitwarden e KeePass são dois exemplos.

Um cofre com uma boa frase-passe e segundo factor activo é muitíssimo mais seguro do que a mesma palavra-passe repetida em vinte sítios.`,
  },
  {
    modulo: "autenticacao",
    ordem: 1,
    titulo: "Quando a senha já não chega",
    duracaoEstimada: 2,
    conteudo: `> Fizeste tudo bem: frase-passe longa, diferente em cada serviço, guardada num gestor. E mesmo assim entram na tua conta.

Como? Porque nenhuma palavra-passe resiste a ser entregue. Se caíste numa página falsa e a escreveste lá, a força dela deixou de importar. O atacante não a quebrou, recebeu-a das tuas mãos.

É aqui que entra a [[autenticação em duas etapas]]. A ideia é simples: para entrar, não basta saber uma coisa, é preciso também ter uma coisa.

- Algo que sabes, a palavra-passe.
- Algo que tens, o telemóvel, uma aplicação, uma chave física.
- Algo que és, impressão digital ou rosto.

Com dois factores activos, quem roubou a tua palavra-passe fica parado no segundo passo. Tem metade da chave e não consegue abrir a porta.

No inquérito do ISAF, 70% dos estudantes têm segundo factor incompleto ou nenhum, e 24% não usam nem sabem o que é. É a barreira que falta a quase toda a gente.

E é a única protecção que continua a funcionar depois de tudo o resto falhar. Podes clicar no link errado, escrever a palavra-passe na página errada, e ainda assim não perder a conta.`,
  },
  {
    modulo: "autenticacao",
    ordem: 2,
    titulo: "Nem todos os segundos factores são iguais",
    duracaoEstimada: 3,
    conteudo: `> Recebes um SMS: "O seu cartão SIM será substituído em 2 horas." Não pediste nada. Duas horas depois o telemóvel fica sem rede, e alguém está a receber os teus códigos.

Activar segundo factor é sempre melhor do que não ter, mas as opções não valem todas o mesmo, e a diferença importa.

O SMS é o mais usado e o mais frágil dos três. É vulnerável à [[troca fraudulenta de cartão SIM]]: o atacante convence a operadora, com dados teus recolhidos previamente, a transferir o teu número para um cartão que ele controla. A partir desse momento recebe os teus códigos. Já aconteceu em Angola.

A aplicação autenticadora, como o Google Authenticator, o Aegis ou o Authy, gera os códigos no próprio telemóvel, sem passar pela rede. Não há nada para interceptar nem operadora para enganar. É a escolha recomendada para a maioria das pessoas.

A chave física é um pequeno dispositivo que ligas ao computador ou aproximas do telemóvel. É a opção mais forte que existe, porque verifica também o endereço do site: se estiveres numa página falsa, simplesmente não funciona. Custa dinheiro e é normalmente usada por quem tem risco elevado.

Se hoje usas SMS, não desactives já. Activa primeiro a aplicação autenticadora, confirma que funciona, e só depois remove o SMS.`,
  },
  {
    modulo: "autenticacao",
    ordem: 3,
    titulo: "Activar e não ficar de fora",
    duracaoEstimada: 2,
    conteudo: `> Activaste segundo factor no email. Um mês depois o telemóvel cai na água, e os códigos estavam lá dentro.

Este é o medo que trava muita gente, e é legítimo. Mas tem solução, e a solução chama-se códigos de recuperação.

Quando activas o segundo factor, o serviço mostra-te uma lista de códigos de uso único. São a tua porta de emergência: cada um permite entrar uma vez, sem o telemóvel. A maioria das pessoas fecha essa janela sem os guardar, e é aí que nasce o problema.

Guarda-os impressos numa folha, ou no teu gestor de palavras-passe caso esteja noutro dispositivo. Nunca num ficheiro chamado "códigos" no ambiente de trabalho.

A ordem por onde começar, se fores activar hoje:

- Primeiro o email, porque é a conta que recupera todas as outras.
- Depois o banco e os serviços financeiros.
- Depois as redes sociais, sobretudo aquelas onde tens conversas privadas.

O processo leva cerca de três minutos por conta. Procura nas definições por "segurança", "verificação em duas etapas" ou "two-factor".

Chegaste ao fim dos módulos. A avaliação final vai comparar o que sabias no início com o que sabes agora, e essa diferença é a única medida que interessa.`,
  },
];

async function main() {
  console.log("A semear lições…\n");

  for (const dados of licoes) {
    const modulo = await prisma.modulo.findUnique({
      where: { slug: dados.modulo },
    });

    if (!modulo) {
      console.error(`  Módulo "${dados.modulo}" não encontrado.`);
      continue;
    }

    await prisma.licao.upsert({
      where: { moduloId_ordem: { moduloId: modulo.id, ordem: dados.ordem } },
      update: {
        titulo: dados.titulo,
        conteudo: dados.conteudo,
        duracaoEstimada: dados.duracaoEstimada,
      },
      create: {
        titulo: dados.titulo,
        conteudo: dados.conteudo,
        ordem: dados.ordem,
        duracaoEstimada: dados.duracaoEstimada,
        moduloId: modulo.id,
      },
    });

    console.log(`  ${dados.modulo} ${dados.ordem}. ${dados.titulo}`);
  }

  console.log("\nFeito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
