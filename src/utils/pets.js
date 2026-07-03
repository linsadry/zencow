import { daysUntil, alertLevel } from "./dates.js";

export const getPetAlerts = (pet) => {
  if (!pet) return [];   /* FIX: era `if (!pets)` → ReferenceError (variável fora de escopo) */
  const a = [];
  (pet.vacinas    || []).forEach((v) => {
    const d = daysUntil(v.proxima); const lv = alertLevel(d);
    if (lv) a.push({ tipo:"Vacina",    nome:v.nome,    dias:d, nivel:lv });
  });
  (pet.vermifugos || []).forEach((v) => {
    const d = daysUntil(v.proxima); const lv = alertLevel(d);
    if (lv) a.push({ tipo:"Vermífugo", nome:v.produto, dias:d, nivel:lv });
  });
  (pet.antipulgas || []).forEach((v) => {
    const d = daysUntil(v.proxima); const lv = alertLevel(d);
    if (lv) a.push({ tipo:"Antipulga", nome:v.produto, dias:d, nivel:lv });
  });
  return a.sort((a, b) => a.dias - b.dias);
};

export const getAllPetAlerts = (pets) => {
  if (!Array.isArray(pets)) return [];
  const all = [];
  pets.forEach((p) => {
    getPetAlerts(p).forEach((a) =>
      all.push({ ...a, pet:p.nome, petId:p.id, foto:p.foto })
    );
  });
  return all.sort((a, b) => a.dias - b.dias);
};
