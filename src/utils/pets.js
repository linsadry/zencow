import { daysUntil as daysUntilShared } from "./dates.js";

function daysUntil(dateStr) {
  return daysUntilShared(dateStr);
}
function alertLevel(days) {
  if (days === null || days === undefined) return null;
  if (days < 0)   return "danger";
  if (days <= 14) return "alert";
  return null;
}
export const getPetAlerts = (pet) => {
  if (!pet) return [];
  const a = [];
  const push = (tipo, nome, dias) => {
    const lv = alertLevel(dias);
    if (lv) a.push({ tipo, nome, dias, nivel: lv });
  };
  (pet.vacinas    || []).forEach(v => push("Vacina",    v.nome,    daysUntil(v.proxima)));
  (pet.vermifugos || []).forEach(v => push("Vermífugo", v.produto, daysUntil(v.proxima)));
  (pet.antipulgas || []).forEach(v => push("Antipulga", v.produto, daysUntil(v.proxima)));
  return a.sort((a, b) => a.dias - b.dias);
};
export const getAllPetAlerts = (pets) => {
  if (!Array.isArray(pets)) return [];
  const all = [];
  pets.forEach(p =>
    getPetAlerts(p).forEach(a =>
      all.push({ ...a, pet: p.nome, petId: p.id, foto: p.foto })
    )
  );
  return all.sort((a, b) => a.dias - b.dias);
};
