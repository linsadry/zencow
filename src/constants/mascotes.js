// src/constants/mascotes.js
import { T } from './theme.js';
import {
  COW_FLORA,
  COW_MARGARIDA,
  COW_LOLA,
  COW_CAMELIA,
  COW_ESTRELA,
  COW_MIMOSA,
} from './images.js';

export const COW_IMG = {
  hoje:     COW_FLORA,
  pets:     COW_MARGARIDA,
  closet:   COW_LOLA,
  beauty:   COW_CAMELIA,
  casa:     COW_ESTRELA,
  memorias: COW_MIMOSA,
  agenda:   COW_FLORA,
};

export const MASCOTES = {
  hoje: {
    nome: 'Flora', img: COW_FLORA, cor: T.terra, bg: T.terraBg,
    saudacoes: [
      'Hoje está tudo em ordem.',
      'Temos alguns compromissos pela frente.',
      'Vamos cuidar das pequenas coisas primeiro.',
      'Que bom te ver de novo por aqui.',
      'Um dia de cada vez — eu fico do seu lado.',
    ],
  },
  pets: {
    nome: 'Margarida', img: COW_MARGARIDA, cor: T.blue, bg: T.blueBg,
    saudacoes: [
      'Como está a família peluda hoje?',
      'Os bichinhos sentem sua falta quando você sai.',
      'Vamos olhar pelos nossos pequenos.',
      'Cuidar de quem ama é o melhor dos hábitos.',
    ],
  },
  closet: {
    nome: 'Lola', img: COW_LOLA, cor: T.sand, bg: T.sandBg,
    saudacoes: [
      'Esse look merece repetir.',
      'Eu apoio repetir roupa bonita.',
      'Pronta pra escolher o look de hoje?',
      'Você ficou ótima naquele congresso.',
    ],
  },
  beauty: {
    nome: 'Camélia', img: COW_CAMELIA, cor: T.rose, bg: T.roseBg,
    saudacoes: [
      'Vamos cuidar de você?',
      'Talvez você não precise de mais um perfume. Talvez.',
      'Essa vaca não julga seus impulsos de skincare.',
      'Vamos registrar uma nova foto da pele?',
      'Sua pele está te agradecendo.',
    ],
  },
  casa: {
    nome: 'Estrela', img: COW_ESTRELA, cor: T.moss, bg: T.mossBg,
    saudacoes: [
      'Mais um passo rumo ao sítio.',
      'O pomar está tomando forma.',
      'Pequenos cuidados, grandes sonhos.',
      'A vida no campo tem seu ritmo.',
    ],
  },
  memorias: {
    nome: 'Mimosa', img: COW_MIMOSA, cor: T.lav, bg: T.lavBg,
    saudacoes: [
      'Olha essa foto de um ano atrás.',
      'Você já percorreu um belo caminho.',
      'Quanta vida em tão pouco tempo.',
      'Memórias são tesouros silenciosos.',
    ],
  },
};

export const HUMOR_QUOTES = [
  'Não fui eu que comprei mais um blush.',
  'Talvez você não precise de mais um perfume. Talvez.',
  'Essa vaca não julga seus impulsos de skincare.',
  'Seu cachorro discorda da última decisão.',
  'Eu apoio repetir roupa bonita.',
  'Um pet a mais nunca é demais.',
  'Sua pele agradece o protetor solar de hoje.',
  'Aquela peça do fundo do armário também conta.',
];
