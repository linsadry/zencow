/* ════════════════════════════════════════════════════════════════════
   Mascotes — Vaquinhas com personalidade
   Etapa 4: imagens Base64 extraídas para src/assets/*.png
════════════════════════════════════════════════════════════════════ */
import imgLogo      from "../assets/logo.png";
import imgFlora     from "../assets/cow-flora.png";
import imgMargarida from "../assets/cow-margarida.png";
import imgLola      from "../assets/cow-lola.png";
import imgCamelia   from "../assets/cow-camelia.png";
import imgEstrela   from "../assets/cow-estrela.png";
import imgMimosa    from "../assets/cow-mimosa.png";

export const LOGO = imgLogo;

export const COW_IMG = {
  hoje:    imgFlora,
  pets:    imgMargarida,
  closet:  imgLola,
  beauty:  imgCamelia,
  casa:    imgEstrela,
  memorias:imgMimosa,
  agenda:  imgFlora,
};

export const MASCOTES = {
  hoje: {
    nome:"Flora", img:imgFlora, cor:"#C4654A", bg:"#F5EAE5",
    saudacoes:[
      "Hoje está tudo em ordem.",
      "Temos alguns compromissos pela frente.",
      "Vamos cuidar das pequenas coisas primeiro.",
      "Que bom te ver de novo por aqui.",
      "Um dia de cada vez — eu fico do seu lado.",
    ],
  },
  pets: {
    nome:"Margarida", img:imgMargarida, cor:"#6A8FAA", bg:"#E5EFF5",
    saudacoes:[
      "Como está a família peluda hoje?",
      "Os bichinhos sentem sua falta quando você sai.",
      "Vamos olhar pelos nossos pequenos.",
      "Cuidar de quem ama é o melhor dos hábitos.",
    ],
  },
  closet: {
    nome:"Lola", img:imgLola, cor:"#C4A96A", bg:"#F5EFE0",
    saudacoes:[
      "Esse look merece repetir.",
      "Eu apoio repetir roupa bonita.",
      "Pronta pra escolher o look de hoje?",
      "Você ficou ótima naquele congresso.",
    ],
  },
  beauty: {
    nome:"Camélia", img:imgCamelia, cor:"#B07A7A", bg:"#F2EAEA",
    saudacoes:[
      "Vamos cuidar de você?",
      "Talvez você não precise de mais um perfume. Talvez.",
      "Essa vaca não julga seus impulsos de skincare.",
      "Vamos registrar uma nova foto da pele?",
      "Sua pele está te agradecendo.",
    ],
  },
  casa: {
    nome:"Estrela", img:imgEstrela, cor:"#5F7A4A", bg:"#E6EDDE",
    saudacoes:[
      "Mais um passo rumo ao sítio.",
      "O pomar está tomando forma.",
      "Pequenos cuidados, grandes sonhos.",
      "A vida no campo tem seu ritmo.",
    ],
  },
  memorias: {
    nome:"Mimosa", img:imgMimosa, cor:"#9A7AA0", bg:"#EFE8F0",
    saudacoes:[
      "Olha essa foto de um ano atrás.",
      "Você já percorreu um belo caminho.",
      "Quanta vida em tão pouco tempo.",
      "Memórias são tesouros silenciosos.",
    ],
  },
};
