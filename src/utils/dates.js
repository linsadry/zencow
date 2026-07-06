export const parseDate = (str) => {
  if (!str) return null;
  if (typeof str !== "string") return null;
  // Formato ISO (aaaa-mm-dd), vindo de inputs type="date"
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }
  // Formato BR (dd/mm/aaaa)
  const [d, m, y] = str.split("/").map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
};

/* Converte qualquer formato reconhecido para exibição dd/mm/aaaa */
export const toBR = (str) => {
  if (!str) return "";
  if (typeof str !== "string") return str;
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const [y, m, d] = str.split("-");
    return `${d}/${m}/${y}`;
  }
  return str; // já está em dd/mm/aaaa (ou é um valor inesperado — devolve como veio)
};

export const daysUntil = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) return null;
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.floor((d - t) / 86400000);
};
export const daysSince = (dateStr) => {
  const u = daysUntil(dateStr);
  return u === null ? null : -u;
};
export const formatDays = (d) => {
  if (d === null) return "";
  if (d < 0)  return `${-d}d atrás`;
  if (d === 0) return "hoje";
  if (d === 1) return "amanhã";
  if (d < 7)  return `em ${d}d`;
  if (d < 30) return `em ${Math.floor(d / 7)}sem`;
  return `em ${Math.floor(d / 30)}m`;
};
export const alertLevel = (d) => {
  if (d === null) return null;
  if (d < 0)  return "danger";
  if (d <= 7) return "alert";
  return null;
};
export const MESES_PT   = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
export const MESES_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const WEEK_L     = ["D","S","T","Q","Q","S","S"];
