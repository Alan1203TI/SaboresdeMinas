const FOODS = [
  {
    "id": "pao_de_queijo",
    "name": "Pão de Queijo",
    "image": "assets/pao_de_queijo.png",
    "category": "Lanche mineiro",
    "memory": true,
    "region": "Clássico de Minas e queridinho em São João del-Rei.",
    "clues": [
      "Sou pequeno, redondinho e perfeito para o café.",
      "Meu sabor vem do queijo e do polvilho.",
      "Fico delicioso quando saio quentinho do forno.",
      "Sou uma das comidas mais famosas de Minas Gerais."
    ]
  },
  {
    "id": "feijao_tropeiro",
    "name": "Feijão Tropeiro",
    "image": "assets/feijao_tropeiro.png",
    "category": "Prato típico",
    "memory": true,
    "region": "Prato tradicional muito presente em Minas.",
    "clues": [
      "Sou um prato bem completo e cheio de sabor.",
      "Levo feijão, farinha e ingredientes bem mineiros.",
      "Posso ter ovos, couve, linguiça e torresmo.",
      "Meu nome lembra as viagens dos tropeiros."
    ]
  },
  {
    "id": "frango_com_quiabo",
    "name": "Frango com Quiabo",
    "image": "assets/frango_com_quiabo.png",
    "category": "Almoço mineiro",
    "memory": true,
    "region": "Receita de família muito famosa no interior de Minas.",
    "clues": [
      "Sou um prato de almoço muito tradicional.",
      "Tenho carne de ave e um legume verdinho bem marcante.",
      "Costumo aparecer em panelas de barro e receitas caseiras.",
      "Meu segundo ingrediente tem sementinhas por dentro."
    ]
  },
  {
    "id": "tutu_de_feijao",
    "name": "Tutu de Feijão",
    "image": "assets/tutu_de_feijao.png",
    "category": "Prato típico",
    "memory": true,
    "region": "Presente em muitas mesas mineiras.",
    "clues": [
      "Sou cremoso e bem encorpado.",
      "Nasço do feijão e costumo ser servido com arroz, couve e torresmo.",
      "Meu nome é curtinho e muito conhecido em Minas.",
      "Sou um clássico do almoço mineiro."
    ]
  },
  {
    "id": "torresmo",
    "name": "Torresmo",
    "image": "assets/torresmo.png",
    "category": "Petisco mineiro",
    "memory": true,
    "region": "Muito presente em bares e almoços da região.",
    "clues": [
      "Sou crocante e muita gente adora como petisco.",
      "Fico douradinho e faço sucesso em bares e almoços.",
      "Venho da barriga do porco.",
      "Combino muito com feijão tropeiro."
    ]
  },
  {
    "id": "broa_de_fuba",
    "name": "Broa de Fubá",
    "image": "assets/broa_de_fuba.png",
    "category": "Quitanda mineira",
    "memory": true,
    "region": "Quitanda muito comum no café da tarde mineiro.",
    "clues": [
      "Sou uma quitanda muito tradicional.",
      "Meu sabor lembra milho e café da tarde.",
      "Sou assada, douradinha e fofinha por dentro.",
      "Meu ingrediente principal é o fubá."
    ]
  },
  {
    "id": "doce_de_leite",
    "name": "Doce de Leite",
    "image": "assets/doce_de_leite.png",
    "category": "Doce mineiro",
    "memory": true,
    "region": "Um dos doces mais amados de Minas Gerais.",
    "clues": [
      "Sou um doce cremoso e muito amado pelos mineiros.",
      "Tenho cor caramelada e textura bem macia.",
      "Posso rechear bolos, pães e biscoitos.",
      "Nasço a partir do leite e do açúcar."
    ]
  },
  {
    "id": "romeu_e_julieta",
    "name": "Romeu e Julieta",
    "image": "assets/romeu_e_julieta.png",
    "category": "Sobremesa típica",
    "memory": true,
    "region": "Combinação famosa nas sobremesas mineiras.",
    "clues": [
      "Sou uma dupla muito famosa da culinária mineira.",
      "Junto um ingrediente clarinho com outro avermelhado.",
      "Um lado é queijo, o outro é goiabada.",
      "Meu nome é o mesmo de um casal famoso da literatura."
    ]
  },
  {
    "id": "pamonha",
    "name": "Pamonha",
    "image": "assets/pamonha.png",
    "category": "Quitanda de milho",
    "memory": true,
    "region": "Muito querida em festas e cafés no interior.",
    "clues": [
      "Sou amarela e tenho gosto de milho.",
      "Costumo vir envolvida em folhas.",
      "Posso ser servida doce ou salgada.",
      "Sou muito famosa nas festas e no interior do Brasil."
    ]
  },
  {
    "id": "goiabada",
    "name": "Goiabada",
    "image": "assets/goiabada.png",
    "category": "Doce tradicional",
    "memory": true,
    "region": "Doce clássico que combina muito com queijo.",
    "clues": [
      "Sou um doce firme e avermelhado.",
      "Venho de uma fruta muito cheirosa.",
      "Quando encontro o queijo, viro uma dupla famosa.",
      "Posso ser vendida em bloco e em fatias."
    ]
  },
  {
    "id": "canjiquinha",
    "name": "Canjiquinha",
    "image": "assets/canjiquinha.png",
    "category": "Prato de milho",
    "memory": true,
    "region": "Muito tradicional em Minas, especialmente em dias frescos.",
    "clues": [
      "Sou um prato quentinho e bem caseiro.",
      "Tenho pequenos pedacinhos de milho no meu preparo.",
      "Posso levar carne suína e cheiro-verde.",
      "Meu nome termina com 'quinha' e sou bem mineira."
    ]
  },
  {
    "id": "queijo_minas",
    "name": "Queijo Minas",
    "image": "assets/queijo_minas.png",
    "category": "Queijo tradicional",
    "memory": true,
    "region": "Símbolo da culinária mineira.",
    "clues": [
      "Sou branquinho, macio e muito famoso em Minas.",
      "Posso aparecer sozinho ou com goiabada.",
      "Sou um derivado do leite muito tradicional.",
      "Meu nome já entrega de qual estado sou símbolo."
    ]
  },
  {
    "id": "biscoito_de_polvilho",
    "name": "Biscoito de Polvilho",
    "image": "assets/biscoito_de_polvilho.png",
    "category": "Quitanda crocante",
    "memory": false,
    "region": "Muito comum em lanches, mercados e padarias mineiras.",
    "clues": [
      "Sou leve, crocante e faço 'croc' quando mastigado.",
      "Posso ter formato comprido ou curvadinho.",
      "Meu ingrediente principal é o polvilho.",
      "Sou um lanche bem conhecido das padarias."
    ]
  },
  {
    "id": "angu",
    "name": "Angu",
    "image": "assets/angu.png",
    "category": "Prato de milho",
    "memory": false,
    "region": "Prato tradicional do interior de Minas.",
    "clues": [
      "Sou um prato amarelinho e macio.",
      "Meu preparo lembra uma papa de milho.",
      "Posso ser servido com molho ou carnes.",
      "Sou muito conhecido nas cozinhas mineiras."
    ]
  }
];
