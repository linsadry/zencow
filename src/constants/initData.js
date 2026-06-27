export const PETS_INIT = [
  {
    id: 1, nome: "Rasta", raca: "SRD", sexo: "M",
    nascimento: "", foto: null, peso: "",
    obs: "O patriarca, chegou primeiro.",
    vacinas:     [{ id: 1, nome: "V10 Polivalente", data: "15/01/2025", proxima: "15/01/2026", lote: "" }],
    vermifugos:  [{ id: 1, data: "01/04/2025", produto: "Drontal", proxima: "01/07/2025" }],
    antipulgas:  [{ id: 1, data: "15/05/2025", produto: "NexGard", proxima: "15/06/2025" }],
    consultas: [], exames: [], medicamentos: [], banhos: [{ id: 1, data: "20/05/2025" }],
    gastos: [], galeria: [],
  },
  {
    id: 2, nome: "Michelini", raca: "SRD", sexo: "F",
    nascimento: "", foto: null, peso: "",
    obs: "Chegou em segundo, dócil.",
    vacinas:     [{ id: 1, nome: "V10 Polivalente", data: "10/02/2025", proxima: "10/02/2026", lote: "" }],
    vermifugos:  [{ id: 1, data: "01/04/2025", produto: "Drontal", proxima: "01/07/2025" }],
    antipulgas:  [{ id: 1, data: "15/05/2025", produto: "NexGard", proxima: "15/06/2025" }],
    consultas: [], exames: [], medicamentos: [], banhos: [], gastos: [], galeria: [],
  },
  {
    id: 3, nome: "Bento", raca: "Golden Retriever", sexo: "M",
    nascimento: "", foto: null, peso: "",
    obs: "O dourado da casa.",
    vacinas: [
      { id: 1, nome: "V10 Polivalente", data: "05/03/2025", proxima: "05/03/2026", lote: "" },
      { id: 2, nome: "Antirrábica",     data: "05/03/2025", proxima: "05/03/2026", lote: "" },
    ],
    vermifugos:  [{ id: 1, data: "01/04/2025", produto: "Drontal", proxima: "01/07/2025" }],
    antipulgas:  [{ id: 1, data: "15/05/2025", produto: "NexGard", proxima: "15/06/2025" }],
    consultas: [], exames: [], medicamentos: [], banhos: [], gastos: [], galeria: [],
  },
  {
    id: 4, nome: "Stella", raca: "Husky Siberiano", sexo: "F",
    nascimento: "", foto: null, peso: "",
    obs: "Irmã da Sabah, mais agitada.",
    vacinas:     [{ id: 1, nome: "V10 Polivalente", data: "20/03/2025", proxima: "20/03/2026", lote: "" }],
    vermifugos:  [{ id: 1, data: "01/04/2025", produto: "Drontal", proxima: "01/07/2025" }],
    antipulgas:  [{ id: 1, data: "15/05/2025", produto: "NexGard", proxima: "15/06/2025" }],
    consultas: [], exames: [], medicamentos: [], banhos: [], gastos: [], galeria: [],
  },
  {
    id: 5, nome: "Sabah", raca: "Husky Siberiano", sexo: "F",
    nascimento: "", foto: null, peso: "",
    obs: "Irmã da Stella, mais calma.",
    vacinas:     [{ id: 1, nome: "V10 Polivalente", data: "20/03/2025", proxima: "20/03/2026", lote: "" }],
    vermifugos:  [{ id: 1, data: "01/04/2025", produto: "Drontal", proxima: "01/07/2025" }],
    antipulgas:  [{ id: 1, data: "15/05/2025", produto: "NexGard", proxima: "15/06/2025" }],
    consultas: [], exames: [], medicamentos: [], banhos: [], gastos: [], galeria: [],
  },
];

export const AGENDA_INIT = [
  { id: 1, titulo: "Consulta glaucoma",  hora: "09:00", durMin: 60, cor: "#C4654A", bg: "#F5EAE5", dia: 0, categoria: "Saúde" },
  { id: 2, titulo: "Questões RFB",        hora: "14:00", durMin: 90, cor: "#C4654A", bg: "#F5EAE5", dia: 0, categoria: "Estudos" },
  { id: 3, titulo: "Banho do Bento",      hora: "16:00", durMin: 30, cor: "#6A8FAA", bg: "#E5EFF5", dia: 0, categoria: "Pets" },
  { id: 4, titulo: "Vacina Rasta",        hora: "10:00", durMin: 30, cor: "#6A8FAA", bg: "#E5EFF5", dia: 3, categoria: "Pets" },
];

export const CLOSET_PECAS_INIT = [
  { id: 1, nome: "Vestido midi azul",        categoria: "Vestido", cor: "Azul",   ocasiao: "Trabalho", estacao: "Outono", foto: null, favorito: true,  usos: 0 },
  { id: 2, nome: "Camisa branca",            categoria: "Camisa",  cor: "Branco", ocasiao: "Trabalho", estacao: "Todas",  foto: null, favorito: false, usos: 0 },
  { id: 3, nome: "Calça alfaiataria preta",  categoria: "Calça",   cor: "Preto",  ocasiao: "Trabalho", estacao: "Todas",  foto: null, favorito: true,  usos: 0 },
];

export const CLOSET_LOOKS_INIT = [];

export const BEAUTY_PRODUTOS_INIT = [
  { id: 1, nome: "Pink Truffle",      categoria: "Batom", marca: "MAC", cor: "Nude rosado", rating: 5, foto: null, favorito: true },
  { id: 2, nome: "Studio Fix Fluid",  categoria: "Base",  marca: "MAC", cor: "NW20",        rating: 5, foto: null, favorito: true },
];

export const BEAUTY_MAKES_INIT = [];

export const SKINCARE_PRODUTOS_INIT = [
  { id: 1, nome: "Vitamina C 10%",  marca: "La Roche-Posay", categoria: "Vitamina C",    inicio: "01/03/2025", fim: "", frequencia: "Manhã",              foto: null, obs: "" },
  { id: 2, nome: "Retinol 0.3%",    marca: "Adcos",           categoria: "Retinol",       inicio: "15/02/2025", fim: "", frequencia: "3x/semana à noite",  foto: null, obs: "" },
  { id: 3, nome: "Protetor FPS 60", marca: "Anthelios",       categoria: "Protetor solar",inicio: "01/01/2025", fim: "", frequencia: "Manhã",              foto: null, obs: "" },
];

export const SKINCARE_DIARIO_INIT = [];

export const CASA_TAREFAS_INIT = [
  { id: 1, texto: "Limpar banheiro",       feita: false },
  { id: 2, texto: "Pagar contas",          feita: false },
  { id: 3, texto: "Compras da semana",     feita: false },
];

export const CASA_PROJETOS_INIT = [
  { id: 1, texto: "Definir localização (Sul de MG?)", feita: false, fase: "Planejamento", categoria: "Outros",      fotos: [] },
  { id: 2, texto: "Visitar opções de terreno",        feita: false, fase: "Planejamento", categoria: "Outros",      fotos: [] },
  { id: 3, texto: "Espaço para os cachorros",         feita: false, fase: "Sonhos",       categoria: "Outros",      fotos: [] },
  { id: 4, texto: "Horta orgânica",                   feita: false, fase: "Sonhos",       categoria: "Jardinagem",  fotos: [] },
  { id: 5, texto: "Pomar de frutíferas",              feita: false, fase: "Sonhos",       categoria: "Pomar",       fotos: [] },
  { id: 6, texto: "Energia solar",                    feita: false, fase: "Sonhos",       categoria: "Energia solar",fotos: [] },
];
