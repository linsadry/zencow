import { useState }        from "react";
import AppHeader            from "../components/AppHeader.jsx";
import { Card, Pill, IconBtn, Modal, MascoteHeader, Input, Select, ModalActions }
                            from "../components/primitives.jsx";
import { T }               from "../constants/index.js";
import { COW_MARGARIDA }   from "../constants/images.js";
import { parseDate, daysSince, formatDays } from "../utils/dates.js";
import { getPetAlerts, getAllPetAlerts }     from "../utils/pets.js";

/* compressImage inline — sem depender de utils/image.js */
async function compressImage(file, maxW = 1024, quality = 0.85) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxW || h > maxW) {
          if (w > h) { h = Math.round(h * maxW / w); w = maxW; }
          else       { w = Math.round(w * maxW / h); h = maxW; }
        }
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ── Ícone de pata (SVG inline) ─────────────────────────────────── */
function PawIcon({ size = 28, color = T.blue }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="4.5"  cy="9.5" r="2"/>
      <circle cx="9"    cy="4.5" r="2"/>
      <circle cx="15"   cy="4.5" r="2"/>
      <circle cx="19.5" cy="9.5" r="2"/>
      <path d="M12 14c-2.5 0-4 1-4 3s2 3 4 3 4-1 4-3-1.5-3-4-3z"/>
    </svg>
  );
}

/* ── Ícone câmera ──────────────────────────────────────────────── */
function CameraIcon({ size = 11, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

/* ── Ícone lixo ────────────────────────────────────────────────── */
function TrashIcon({ size = 14, color = T.danger }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M9 6V4h6v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  );
}

/* ── Cores por tipo de evento ──────────────────────────────────── */
const TIPO_COLORS = {
  vacina:     T.blue,
  vermifugo:  T.rose,
  antipulga:  T.moss,
  consulta:   T.terra,
  exame:      T.lav,
  cirurgia:   T.danger,
  banho:      T.sand,
};

/* ════════════════════════════════════════════════════════════════ */
/* PetHistorico                                                    */
/* ════════════════════════════════════════════════════════════════ */
function PetHistorico({ pet }) {
  const eventos = [];
  (pet.vacinas    || []).forEach(v => eventos.push({ tipo:"Vacina",     tipoKey:"vacina",    titulo:v.nome,     data:v.data }));
  (pet.vermifugos || []).forEach(v => eventos.push({ tipo:"Vermífugo",  tipoKey:"vermifugo", titulo:v.produto,  data:v.data }));
  (pet.antipulgas || []).forEach(v => eventos.push({ tipo:"Antipulga",  tipoKey:"antipulga", titulo:v.produto,  data:v.data }));
  (pet.consultas  || []).forEach(c => eventos.push({ tipo:"Consulta",   tipoKey:"consulta",  titulo:c.motivo,   data:c.data }));
  (pet.exames     || []).forEach(e => eventos.push({ tipo:"Exame",      tipoKey:"exame",     titulo:e.tipo,     data:e.data }));
  (pet.cirurgias  || []).forEach(c => eventos.push({ tipo:"Cirurgia",   tipoKey:"cirurgia",  titulo:c.tipo,     data:c.data }));
  (pet.banhos     || []).forEach(b => eventos.push({ tipo:"Banho",      tipoKey:"banho",     titulo:b.local||"", data:b.data }));

  eventos.sort((a, b) => (b.data || "").localeCompare(a.data || ""));

  if (eventos.length === 0) return (
    <div style={{ textAlign:"center", padding:"48px 20px", color:T.textMute }}>
      <PawIcon size={36} color={T.borderMd}/>
      <div style={{ marginTop:12, fontSize:13 }}>Nenhum evento registrado ainda.</div>
    </div>
  );

  return (
    <div style={{ padding:"0 16px 24px" }}>
      {eventos.map((ev, i) => {
        const cor = TIPO_COLORS[ev.tipoKey] || T.blue;
        return (
          <div key={i} style={{ display:"flex", gap:12, marginBottom:12 }}>
            {/* Linha do tempo */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:3 }}>
              <div style={{ width:9, height:9, borderRadius:"50%", background:cor, flexShrink:0 }}/>
              {i < eventos.length - 1 && (
                <div style={{ flex:1, width:1, background:T.border, marginTop:4, minHeight:20 }}/>
              )}
            </div>
            {/* Conteúdo */}
            <div style={{ flex:1, paddingBottom:i < eventos.length - 1 ? 8 : 0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:1 }}>
                <span style={{ fontSize:11, fontWeight:700, color:cor, letterSpacing:.2 }}>
                  {ev.tipo.toUpperCase()}
                </span>
                <span style={{ fontSize:11, color:T.textMute }}>{ev.data}</span>
              </div>
              <div style={{ fontSize:13, color:T.text, fontWeight:500 }}>{ev.titulo}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PetGastos                                                       */
/* ════════════════════════════════════════════════════════════════ */
/* ── Ícone de recorrência ─────────────────────────────────── */
function RepeatIcon({ size=13, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  );
}

const FREQ_LABELS = ["Mensal","Bimestral","Trimestral","Semestral","Anual"];

function PetGastos({ pet, setPets }) {
  const [form, setForm] = useState(null);
  const gastos = pet.gastos || [];

  /* Próxima data de um gasto recorrente */
  const proximaData = (g) => {
    if (!g.recorrente || !g.data) return null;
    const [d, m, y] = g.data.split("-");
    const base = new Date(+y, +m - 1, +d);
    const meses = { Mensal:1, Bimestral:2, Trimestral:3, Semestral:6, Anual:12 }[g.frequencia] || 1;
    base.setMonth(base.getMonth() + meses);
    return base.toISOString().slice(0,10);
  };

  /* Salvar gasto (novo ou editar) */
  const salvar = () => {
    if (!form.descricao || !form.valor) return;
    const item = { ...form, id: form.id || Date.now().toString() };
    if (!item.recorrente) { delete item.frequencia; }
    setPets(ps => ps.map(p => p.id !== pet.id ? p : {
      ...p, gastos: form.id
        ? (p.gastos || []).map(g => g.id === form.id ? item : g)
        : [...(p.gastos || []), item],
    }));
    setForm(null);
  };

  /* Registrar nova ocorrência do gasto recorrente */
  const registrarOcorrencia = (g) => {
    const novo = {
      ...g,
      id: Date.now().toString(),
      data: proximaData(g) || new Date().toISOString().slice(0,10),
    };
    setPets(ps => ps.map(p =>
      p.id !== pet.id ? p : { ...p, gastos: [...(p.gastos || []), novo] }
    ));
  };

  const remover = id => setPets(ps => ps.map(p =>
    p.id !== pet.id ? p : { ...p, gastos: (p.gastos||[]).filter(g => g.id !== id) }
  ));

  const total     = gastos.reduce((s, g) => s + (parseFloat(g.valor) || 0), 0);
  const recorrentes = gastos.filter(g => g.recorrente);
  const totalRecorr = recorrentes.reduce((s, g) => s + (parseFloat(g.valor) || 0), 0);

  /* agrupa por categoria para totais */
  const porCat = {};
  gastos.forEach(g => { porCat[g.categoria] = (porCat[g.categoria]||0) + (parseFloat(g.valor)||0); });

  return (
    <div style={{ padding:"0 16px 24px" }}>
      {/* Cabeçalho */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div className="serif" style={{ fontSize:16, fontWeight:700, color:T.text }}>Histórico</div>
        <button onClick={() => setForm({ descricao:"", valor:"", data:"", categoria:"Consulta", recorrente:false, frequencia:"Mensal" })}
          style={{ fontSize:13, fontWeight:700, color:T.sand, background:T.sandBg, borderRadius:20, padding:"5px 14px" }}>
          + Gasto
        </button>
      </div>

      {/* Totais */}
      {gastos.length > 0 && (
        <Card style={{ padding:"12px 16px", marginBottom:14, background:T.sandBg, border:`1px solid ${T.sand}33` }}>
          <div style={{ fontSize:11, color:T.textMute, fontWeight:600, letterSpacing:.3 }}>TOTAL GASTO</div>
          <div className="serif" style={{ fontSize:26, fontWeight:700, color:T.sand, lineHeight:1.1 }}>
            R$ {total.toFixed(2).replace(".",",")}
          </div>
          {totalRecorr > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:6 }}>
              <RepeatIcon size={11} color={T.textMute}/>
              <span style={{ fontSize:11, color:T.textMute }}>
                Recorrentes: R$ {totalRecorr.toFixed(2).replace(".",",")}/período
              </span>
            </div>
          )}
          {Object.keys(porCat).length > 1 && (
            <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:3 }}>
              {Object.entries(porCat).map(([c,v]) => (
                <div key={c} style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
                  <span style={{ color:T.textSub }}>{c}</span>
                  <span style={{ fontWeight:700, color:T.text }}>R$ {v.toFixed(2).replace(".",",")}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {gastos.length === 0 && (
        <div style={{ textAlign:"center", padding:"32px 0", color:T.textMute, fontSize:13 }}>
          Nenhum gasto registrado.
        </div>
      )}

      {gastos.slice().reverse().map(g => (
        <Card key={g.id} style={{ padding:"11px 14px", marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                {g.recorrente && <RepeatIcon size={11} color={T.sand}/>}
                <span style={{ fontSize:13, fontWeight:700, color:T.text }}>{g.descricao}</span>
              </div>
              <div style={{ fontSize:11, color:T.textMute, marginTop:1 }}>
                {g.data} · {g.categoria}
                {g.recorrente && <span style={{ color:T.sand }}> · {g.frequencia}</span>}
              </div>
            </div>
            <div className="serif" style={{ fontSize:15, fontWeight:700, color:T.sand, flexShrink:0 }}>
              R$ {parseFloat(g.valor||0).toFixed(2).replace(".",",")}
            </div>
            <IconBtn icon="✏️" size={12} color={T.textMute} onClick={() => setForm({...g})}/>
            <IconBtn icon="🗑️" size={12} color={T.danger}   onClick={() => remover(g.id)}/>
          </div>
          {/* Botão "Registrar este período" para gastos recorrentes */}
          {g.recorrente && (
            <button onClick={() => registrarOcorrencia(g)} style={{
              marginTop:8, width:"100%", padding:"6px", borderRadius:8,
              background:T.sandBg, border:`1px solid ${T.sand}33`,
              fontSize:11, fontWeight:700, color:T.sand,
              display:"flex", alignItems:"center", justifyContent:"center", gap:5,
            }}>
              <RepeatIcon size={11} color={T.sand}/> Registrar novo período
            </button>
          )}
        </Card>
      ))}

      {form && (
        <Modal title={form.id ? "Editar Gasto" : "Novo Gasto"} onClose={() => setForm(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Descrição"  value={form.descricao||""} onChange={e=>setForm({...form,descricao:e.target.value})}/>
            <Input label="Valor (R$)" value={form.valor||""}     onChange={e=>setForm({...form,valor:e.target.value})} type="number"/>
            <Input label="Data"       value={form.data||""}      onChange={e=>setForm({...form,data:e.target.value})}  type="date"/>
            <Select label="Categoria" value={form.categoria||"Consulta"} onChange={e=>setForm({...form,categoria:e.target.value})}
              options={["Consulta","Vacina","Medicamento","Banho","Ração","Petshop","Seguro","Plano de saúde pet","Outro"]}/>

            {/* Toggle recorrente */}
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer",
              padding:"10px 12px", borderRadius:10, background:T.bgInput }}>
              <input type="checkbox" checked={!!form.recorrente}
                onChange={e=>setForm({...form,recorrente:e.target.checked})}
                style={{ width:16, height:16, accentColor:T.sand }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Gasto recorrente</div>
                <div style={{ fontSize:11, color:T.textMute }}>Ex: plano de saúde, mensalidades</div>
              </div>
            </label>

            {form.recorrente && (
              <Select label="Frequência" value={form.frequencia||"Mensal"} onChange={e=>setForm({...form,frequencia:e.target.value})}
                options={FREQ_LABELS}/>
            )}

            <ModalActions onCancel={() => setForm(null)} onSave={salvar} color={T.sand}
              onDelete={form.id ? () => { remover(form.id); setForm(null); } : undefined}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PetGaleria                                                      */
/* ════════════════════════════════════════════════════════════════ */
function PetGaleria({ pet, setPets }) {
  const [view, setView] = useState(null);
  const fotos = pet.fotos || [];

  const addFoto = async () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const compressed = await compressImage(file);
        const id = Date.now().toString();
        setPets(ps => ps.map(p => p.id !== pet.id ? p : {
          ...p, fotos:[...(p.fotos||[]), { id, src:compressed, data:new Date().toLocaleDateString("pt-BR") }],
        }));
      } catch { console.warn("Erro ao comprimir imagem"); }
    };
    input.click();
  };

  const remover = id => setPets(ps => ps.map(p =>
    p.id !== pet.id ? p : { ...p, fotos:(p.fotos||[]).filter(f=>f.id!==id) }
  ));

  return (
    <div style={{ padding:"0 16px 24px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div className="serif" style={{ fontSize:16, fontWeight:700, color:T.text }}>
          Álbum de {pet.nome}
        </div>
        <button onClick={addFoto} style={{
          fontSize:13, fontWeight:700, color:T.lav,
          background:T.lavBg, borderRadius:20, padding:"5px 14px",
        }}>
          + Foto
        </button>
      </div>

      {fotos.length === 0 && (
        <div style={{ textAlign:"center", padding:"32px 0", color:T.textMute, fontSize:13 }}>
          Adicione a primeira foto de {pet.nome}.
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
        {fotos.map(f => (
          <div key={f.id} onClick={() => setView(f)} style={{
            aspectRatio:"1", borderRadius:10, overflow:"hidden",
            background:T.bgInput, cursor:"pointer",
            border:`1px solid ${T.border}`,
          }}>
            <img src={f.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        ))}
      </div>

      {/* Visualizador */}
      {view && (
        <div onClick={() => setView(null)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.88)",
          zIndex:700, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:16,
        }}>
          <img src={view.src} alt="" style={{
            maxWidth:"92vw", maxHeight:"72vh",
            objectFit:"contain", borderRadius:12,
          }}/>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.6)" }}>{view.data}</div>
            <button
              onClick={e => { e.stopPropagation(); remover(view.id); setView(null); }}
              style={{
                fontSize:12, fontWeight:700, color:T.danger,
                background:T.dangerBg, borderRadius:20, padding:"5px 14px",
              }}>
              Remover foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PetRotina                                                       */
/* ════════════════════════════════════════════════════════════════ */
function PetRotina({ pet, setPets }) {
  const [form, setForm] = useState(null);
  const banhos = pet.banhos || [];

  const salvar = () => {
    if (!form.data) return;
    const item = form.id ? { ...form } : { ...form, id:Date.now().toString() };
    setPets(ps => ps.map(p => p.id !== pet.id ? p : {
      ...p, banhos: form.id
        ? (p.banhos||[]).map(b => b.id===form.id ? item : b)
        : [...(p.banhos||[]), item],
    }));
    setForm(null);
  };

  const remover = id => setPets(ps => ps.map(p =>
    p.id !== pet.id ? p : { ...p, banhos:(p.banhos||[]).filter(b=>b.id!==id) }
  ));

  return (
    <div style={{ padding:"0 16px 24px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div className="serif" style={{ fontSize:16, fontWeight:700, color:T.text }}>Banhos</div>
        <button onClick={() => setForm({ data:"", local:"", observacao:"" })}
          style={{
            fontSize:13, fontWeight:700, color:T.blue,
            background:T.blueBg, borderRadius:20, padding:"5px 14px",
          }}>
          + Registrar
        </button>
      </div>

      {banhos.length === 0 && (
        <div style={{ textAlign:"center", padding:"32px 0", color:T.textMute, fontSize:13 }}>
          Nenhum banho registrado.
        </div>
      )}

      {banhos.slice().reverse().map(b => (
        <Card key={b.id} style={{ padding:"12px 14px", marginBottom:8,
          display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{b.data}</div>
            {b.local && <div style={{ fontSize:11, color:T.textMute, marginTop:1 }}>{b.local}</div>}
            {b.observacao && <div style={{ fontSize:11, color:T.textSub, marginTop:2, fontStyle:"italic" }}>{b.observacao}</div>}
          </div>
          <IconBtn icon="🗑️" size={13} color={T.danger} onClick={() => remover(b.id)}/>
        </Card>
      ))}

      {form && (
        <Modal title={form.id ? "Editar Banho" : "Registrar Banho"} onClose={() => setForm(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Data"       value={form.data}       onChange={e=>setForm({...form,data:e.target.value})}       type="date"/>
            <Input label="Local"      value={form.local||""}  onChange={e=>setForm({...form,local:e.target.value})}/>
            <Input label="Observação" value={form.observacao||""} onChange={e=>setForm({...form,observacao:e.target.value})}/>
            <ModalActions onCancel={() => setForm(null)} onSave={salvar} color={T.blue}
              onDelete={form.id ? () => { remover(form.id); setForm(null); } : undefined}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* SaudeEditModal                                                  */
/* ════════════════════════════════════════════════════════════════ */
function SaudeEditModal({ type, item, pet, setPets, onClose }) {
  const [form, setForm] = useState(item || defaultForm(type));

  function defaultForm(t) {
    const base = { data:"", proxima:"" };
    if (t === "vacina")     return { ...base, nome:"", fabricante:"", lote:"" };
    if (t === "vermifugo")  return { ...base, produto:"", dose:"" };
    if (t === "antipulga")  return { ...base, produto:"", dose:"" };
    if (t === "consulta")   return { data:"", motivo:"", veterinario:"", observacao:"" };
    if (t === "exame")      return { data:"", tipo:"", resultado:"", arquivo:"" };
    if (t === "cirurgia")   return { data:"", tipo:"", veterinario:"", observacao:"" };
    if (t === "medicamento")return { data:"", nome:"", dose:"", duracao:"", observacao:"" };
    return base;
  }

  const titles = {
    vacina:"Vacina", vermifugo:"Vermífugo", antipulga:"Antipulga",
    consulta:"Consulta", exame:"Exame", cirurgia:"Cirurgia", medicamento:"Medicamento",
  };

  const field = (label, key, tp="text") => (
    <Input label={label} type={tp} value={form[key]||""}
      onChange={e => setForm({...form,[key]:e.target.value})}/>
  );

  const salvar = () => {
    const id  = form.id || Date.now().toString();
    const arr = type + "s";
    setPets(ps => ps.map(p => {
      if (p.id !== pet.id) return p;
      const lista = p[arr] || [];
      return {
        ...p,
        [arr]: form.id ? lista.map(x => x.id===form.id ? form : x) : [...lista, {...form,id}],
      };
    }));
    onClose();
  };

  const remover = () => {
    const arr = type + "s";
    setPets(ps => ps.map(p =>
      p.id !== pet.id ? p : { ...p, [arr]:(p[arr]||[]).filter(x=>x.id!==form.id) }
    ));
    onClose();
  };

  return (
    <Modal title={`${item?"Editar":"Novo"} ${titles[type]||type}`} onClose={onClose}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {type==="vacina"      && <>{field("Nome","nome")}       {field("Data","data","date")} {field("Próxima dose","proxima","date")} {field("Fabricante","fabricante")} {field("Lote","lote")}</>}
        {type==="vermifugo"   && <>{field("Produto","produto")} {field("Data","data","date")} {field("Próxima dose","proxima","date")} {field("Dose","dose")}</>}
        {type==="antipulga"   && <>{field("Produto","produto")} {field("Data","data","date")} {field("Próxima aplicação","proxima","date")} {field("Dose","dose")}</>}
        {type==="consulta"    && <>{field("Motivo","motivo")}   {field("Data","data","date")} {field("Veterinário","veterinario")} {field("Observação","observacao")}</>}
        {type==="exame"       && <>{field("Tipo","tipo")}       {field("Data","data","date")} {field("Resultado","resultado")} {field("Arquivo","arquivo")}</>}
        {type==="cirurgia"    && <>{field("Tipo","tipo")}       {field("Data","data","date")} {field("Veterinário","veterinario")} {field("Observação","observacao")}</>}
        {type==="medicamento" && <>{field("Nome","nome")}       {field("Data início","data","date")} {field("Dose","dose")} {field("Duração","duracao")} {field("Observação","observacao")}</>}
        <ModalActions onCancel={onClose} onSave={salvar}
          onDelete={item ? remover : undefined}/>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* SaudeSection                                                    */
/* ════════════════════════════════════════════════════════════════ */
function SaudeSection({ title, items=[], type, pet, setPets, render, color=T.blue }) {
  const [editing, setEditing] = useState(null);
  const [adding,  setAdding]  = useState(false);
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.textMute, letterSpacing:.4, textTransform:"uppercase" }}>
          {title}
        </div>
        <button onClick={() => setAdding(true)} style={{
          fontSize:11, fontWeight:700, color,
          background:`${color}18`, borderRadius:20, padding:"3px 11px",
        }}>
          + Adicionar
        </button>
      </div>

      {items.length === 0 && (
        <div style={{ fontSize:12, color:T.textMute, fontStyle:"italic", paddingLeft:2 }}>
          Nenhum registro.
        </div>
      )}

      {items.map(item => {
        const r      = render(item);
        const alerts = getPetAlerts ? (getPetAlerts(item, type) || []) : [];
        return (
          <Card key={item.id} style={{ padding:"11px 14px", marginBottom:6,
            display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{r.primary}</div>
              {r.secondary && <div style={{ fontSize:11, color:T.textSub, marginTop:2 }}>{r.secondary}</div>}
              {r.next && (
                <div style={{
                  fontSize:11, fontWeight:600, marginTop:4,
                  color: alerts.length > 0 ? (alerts[0]?.nivel==="danger" ? T.danger : T.alert) : T.moss,
                }}>
                  {r.next}
                </div>
              )}
            </div>
            <IconBtn icon="✏️" size={13} color={T.textMute} onClick={() => setEditing(item)}/>
          </Card>
        );
      })}

      {(adding || editing) && (
        <SaudeEditModal
          type={type} item={editing} pet={pet} setPets={setPets}
          onClose={() => { setAdding(false); setEditing(null); }}/>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PetSaude                                                        */
/* ════════════════════════════════════════════════════════════════ */
function PetSaude({ pet, setPets }) {
  const render = {
    vacina:     v => ({ primary:v.nome,     secondary:`Aplicada: ${v.data}`,    next: v.proxima ? `Próxima: ${v.proxima}` : null }),
    vermifugo:  v => ({ primary:v.produto,  secondary:`Aplicado: ${v.data}`,    next: v.proxima ? `Próximo: ${v.proxima}` : null }),
    antipulga:  v => ({ primary:v.produto,  secondary:`Aplicado: ${v.data}`,    next: v.proxima ? `Próximo: ${v.proxima}` : null }),
    consulta:   c => ({ primary:c.motivo,   secondary:`${c.data} · ${c.veterinario||""}`,  next:null }),
    exame:      e => ({ primary:e.tipo,     secondary:`${e.data}`,              next:null }),
    cirurgia:   c => ({ primary:c.tipo,     secondary:`${c.data} · ${c.veterinario||""}`,  next:null }),
    medicamento:m => ({ primary:m.nome,     secondary:`${m.data} · ${m.dose}`,  next:null }),
  };

  return (
    <div style={{ padding:"0 16px 24px" }}>
      <SaudeSection title="Vacinas"      type="vacina"      items={pet.vacinas||[]}      pet={pet} setPets={setPets} color={T.blue}  render={render.vacina}/>
      <SaudeSection title="Vermífugo"    type="vermifugo"   items={pet.vermifugos||[]}   pet={pet} setPets={setPets} color={T.rose}  render={render.vermifugo}/>
      <SaudeSection title="Antipulga"    type="antipulga"   items={pet.antipulgas||[]}   pet={pet} setPets={setPets} color={T.moss}  render={render.antipulga}/>
      <SaudeSection title="Consultas"    type="consulta"    items={pet.consultas||[]}    pet={pet} setPets={setPets} color={T.terra} render={render.consulta}/>
      <SaudeSection title="Exames"       type="exame"       items={pet.exames||[]}       pet={pet} setPets={setPets} color={T.lav}   render={render.exame}/>
      <SaudeSection title="Cirurgias"    type="cirurgia"    items={pet.cirurgias||[]}    pet={pet} setPets={setPets} color={T.danger}render={render.cirurgia}/>
      <SaudeSection title="Medicamentos" type="medicamento" items={pet.medicamentos||[]} pet={pet} setPets={setPets} color={T.sand}  render={render.medicamento}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PetEditInfo                                                     */
/* ════════════════════════════════════════════════════════════════ */
function PetEditInfo({ pet, setPets, onClose }) {
  const [form, setForm] = useState({
    nome:    pet.nome    || "",
    especie: pet.especie || "cachorro",
    raca:    pet.raca    || "",
    sexo:    pet.sexo    || "fêmea",
    nascimento: pet.nascimento || "",
    peso:    pet.peso    || "",
    cor:     pet.cor     || "",
    chip:    pet.chip    || "",
    castrado: pet.castrado || false,
  });

  const f = (l,k,t="text") => (
    <Input label={l} type={t} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/>
  );

  const salvar = () => {
    setPets(ps => ps.map(p => p.id===pet.id ? {...p,...form} : p));
    onClose();
  };

  return (
    <Modal title="Editar informações" onClose={onClose}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {f("Nome","nome")}
        <Select label="Espécie" value={form.especie} onChange={e=>setForm({...form,especie:e.target.value})}
          options={["cachorro","gato","ave","roedor","réptil","outro"]}/>
        {f("Raça","raca")}
        <Select label="Sexo" value={form.sexo} onChange={e=>setForm({...form,sexo:e.target.value})}
          options={["fêmea","macho"]}/>
        {f("Nascimento","nascimento","date")}
        {f("Peso (kg)","peso","number")}
        {f("Cor/pelagem","cor")}
        {f("Chip","chip")}
        <label style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:T.text }}>
          <input type="checkbox" checked={form.castrado}
            onChange={e=>setForm({...form,castrado:e.target.checked})}/>
          Castrado(a)
        </label>
        <ModalActions onCancel={onClose} onSave={salvar}/>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PetDetail                                                       */
/* ════════════════════════════════════════════════════════════════ */
function PetDetail({ pet, setPets, onBack }) {
  const [aba,       setAba]       = useState("saude");
  const [editInfo,  setEditInfo]  = useState(false);
  const [editFoto,  setEditFoto]  = useState(false);

  const update = patch => setPets(ps => ps.map(p => p.id===pet.id ? {...p,...patch} : p));

  const deletePet = () => {
    if (!window.confirm(`Remover ${pet.nome}?`)) return;
    setPets(ps => ps.filter(p => p.id !== pet.id));
    onBack();
  };

  const idade = pet.nascimento
    ? (() => {
        const d = daysSince(parseDate(pet.nascimento));
        return d < 365 ? `${Math.floor(d/30)}m` : `${Math.floor(d/365)}a`;
      })()
    : null;

  const ABAS = [
    { id:"saude",     l:"Saúde"    },
    { id:"rotina",    l:"Rotina"   },
    { id:"galeria",   l:"Galeria"  },
    { id:"gastos",    l:"Gastos"   },
    { id:"historico", l:"Histórico"},
  ];

  const alerts = (() => {
    try { return getPetAlerts ? (getPetAlerts(pet) || []) : []; }
    catch { return []; }
  })();

  const urgentes = alerts.filter(a => a.nivel==="danger").length;
  const proximos  = alerts.filter(a => a.nivel==="alert").length;

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      <AppHeader
        title={pet.nome}
        onBack={onBack}
        rightAction={
          <button onClick={deletePet} style={{
            padding:"6px 8px", borderRadius:8,
            background:T.dangerBg, display:"flex", alignItems:"center",
          }}>
            <TrashIcon size={13}/>
          </button>
        }
      />

      <div style={{ flex:1, overflowY:"auto" }}>
        {/* Card de perfil */}
        <div style={{ padding:"16px 16px 0" }}>
          <Card style={{ padding:"16px", marginBottom:14 }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              {/* Foto */}
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{
                  width:76, height:76, borderRadius:20,
                  overflow:"hidden", background:T.blueBg,
                  border:`1px solid ${T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {pet.foto
                    ? <img src={pet.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <PawIcon size={32} color={T.blue}/>
                  }
                </div>
                <button
                  onClick={async () => {
                    const input = document.createElement("input");
                    input.type="file"; input.accept="image/*";
                    input.onchange = async e => {
                      const file=e.target.files[0]; if(!file) return;
                      try { const c=await compressImage(file); update({foto:c}); } catch {}
                    };
                    input.click();
                  }}
                  style={{
                    position:"absolute", bottom:-4, right:-4,
                    width:24, height:24, borderRadius:"50%",
                    background:T.blue,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 1px 4px rgba(0,0,0,.2)",
                  }}>
                  <CameraIcon size={11}/>
                </button>
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div className="serif" style={{fontSize:20,fontWeight:700,color:T.text,lineHeight:1.1}}>
                  {pet.nome}
                </div>
                <div style={{fontSize:12,color:T.textSub,marginTop:2}}>
                  {pet.raca || pet.especie}
                  {pet.sexo && ` · ${pet.sexo==="macho" ? "♂" : "♀"}`}
                  {idade && ` · ${idade}`}
                  {pet.castrado && " · castrado(a)"}
                </div>
                {pet.peso && (
                  <div style={{fontSize:11,color:T.textMute,marginTop:2}}>{pet.peso} kg</div>
                )}
                {/* Alertas */}
                {(urgentes > 0 || proximos > 0) && (
                  <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                    {urgentes>0 && <Pill label={`${urgentes} atrasado${urgentes>1?"s":""}`} color={T.danger} bg={T.dangerBg}/>}
                    {proximos>0 && <Pill label={`${proximos} próximo${proximos>1?"s":""}`}  color={T.alert}  bg={T.alertBg}/>}
                  </div>
                )}
              </div>

              {/* Editar */}
              <button onClick={() => setEditInfo(true)} style={{
                fontSize:12, fontWeight:700, color:T.blue,
                background:T.blueBg, borderRadius:20, padding:"5px 12px", flexShrink:0,
              }}>
                Editar
              </button>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div style={{
          display:"flex", gap:0, overflowX:"auto", padding:"0 16px 0",
          borderBottom:`1px solid ${T.border}`, marginBottom:0,
        }}>
          {ABAS.map(a => (
            <button key={a.id} onClick={() => setAba(a.id)} style={{
              padding:"9px 14px", fontSize:12, fontWeight:700,
              color:       aba===a.id ? T.blue     : T.textMute,
              borderBottom:`2px solid ${aba===a.id ? T.blue : "transparent"}`,
              whiteSpace:  "nowrap",
              transition:  "color .15s ease",
            }}>
              {a.l}
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        <div style={{ paddingTop:16 }}>
          {aba==="saude"     && <PetSaude    pet={pet} setPets={setPets}/>}
          {aba==="rotina"    && <PetRotina   pet={pet} setPets={setPets}/>}
          {aba==="galeria"   && <PetGaleria  pet={pet} setPets={setPets}/>}
          {aba==="gastos"    && <PetGastos   pet={pet} setPets={setPets}/>}
          {aba==="historico" && <PetHistorico pet={pet}/>}
        </div>
      </div>

      {editInfo && (
        <PetEditInfo pet={pet} setPets={setPets} onClose={() => setEditInfo(false)}/>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PetsList                                                        */
/* ════════════════════════════════════════════════════════════════ */
function PetsList({ pets, setPets, onOpen, onMenu }) {
  const safePets = Array.isArray(pets) ? pets : [];
  const [adding, setAdding] = useState(false);
  const [form,   setForm]   = useState({ nome:"", especie:"cachorro", raca:"", sexo:"fêmea" });

  const addPet = () => {
    if (!form.nome.trim()) return;
    const novo = {
      id: Date.now().toString(),
      nome:form.nome, especie:form.especie, raca:form.raca, sexo:form.sexo,
      vacinas:[], vermifugos:[], antipulgas:[], consultas:[],
      exames:[], cirurgias:[], medicamentos:[], banhos:[], gastos:[], fotos:[],
    };
    setPets(ps => [...(Array.isArray(ps) ? ps : []), novo]);
    setForm({ nome:"", especie:"cachorro", raca:"", sexo:"fêmea" });
    setAdding(false);
  };

  /* Resumo de alertas — wrapped em try-catch para o bug pets is not defined */
  const alertSummary = (() => {
    try {
      const all     = getAllPetAlerts(safePets);
      const danger  = (all || []).filter(a => a.nivel==="danger").length;
      const alert   = (all || []).filter(a => a.nivel==="alert").length;
      return { all: all || [], danger, alert };
    } catch (e) {
      console.warn("ZenCow pet alerts error:", e);
      return { all:[], danger:0, alert:0 };
    }
  })();

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      <AppHeader title="Pets" onMenu={onMenu}/>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 80px" }}>
        <MascoteHeader secao="pets"/>

        {/* Resumo de alertas */}
        {(alertSummary.danger > 0 || alertSummary.alert > 0) && (
          <Card style={{
            padding:"12px 16px", marginBottom:16,
            background:T.alertBg, border:`1px solid ${T.alert}33`,
          }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:6 }}>
              Alertas da fazenda
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {alertSummary.danger > 0 && (
                <Pill
                  label={`${alertSummary.danger} atrasado${alertSummary.danger>1?"s":""}`}
                  color={T.danger} bg="#fff"/>
              )}
              {alertSummary.alert > 0 && (
                <Pill
                  label={`${alertSummary.alert} próximo${alertSummary.alert>1?"s":""}`}
                  color={T.alert} bg="#fff"/>
              )}
            </div>
          </Card>
        )}

        {/* Lista de pets */}
        {safePets.length === 0 && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <PawIcon size={48} color={T.borderMd}/>
            <div style={{ fontSize:15, color:T.textMute, marginTop:12 }}>
              Seus pets aparecerão aqui
            </div>
          </div>
        )}

        {safePets.map(pet => {
          const alerts  = (() => { try { return getPetAlerts ? (getPetAlerts(pet)||[]) : []; } catch { return []; } })();
          const urgentes = alerts.filter(a => a.nivel==="danger").length;
          const proximos  = alerts.filter(a => a.nivel==="alert").length;

          return (
            <Card key={pet.id} className="zc-card" style={{ marginBottom:10, overflow:"hidden" }}>
              <button onClick={() => onOpen(pet.id)} style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"14px 16px", width:"100%", textAlign:"left",
              }}>
                {/* Foto / avatar */}
                <div style={{
                  width:56, height:56, borderRadius:16, overflow:"hidden",
                  background:T.blueBg, border:`1px solid ${T.border}`,
                  flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {pet.foto
                    ? <img src={pet.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <PawIcon size={24} color={T.blue}/>
                  }
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="serif" style={{fontSize:17,fontWeight:700,color:T.text,lineHeight:1.1}}>
                    {pet.nome}
                  </div>
                  <div style={{fontSize:12,color:T.textSub,marginTop:2}}>
                    {pet.raca || pet.especie}
                    {pet.sexo && (pet.sexo==="macho" ? " · ♂" : " · ♀")}
                  </div>
                  <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                    {urgentes>0
                      ? <Pill label={`${urgentes} atrasado${urgentes>1?"s":""}`} color={T.danger} bg={T.dangerBg}/>
                      : proximos>0
                        ? <Pill label={`${proximos} próximo${proximos>1?"s":""}`} color={T.alert} bg={T.alertBg}/>
                        : <Pill label="em dia" color={T.moss} bg={T.mossBg}/>
                    }
                  </div>
                </div>

                {/* Chevron */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={T.textMute} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </Card>
          );
        })}

        {/* Botão adicionar pet */}
        <button onClick={() => setAdding(true)} style={{
          width:"100%", padding:"13px", borderRadius:14, marginTop:6,
          border:`1.5px dashed ${T.blue}55`, background:T.blueBg,
          fontSize:13, fontWeight:700, color:T.blue,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Adicionar Pet
        </button>
      </div>

      {adding && (
        <Modal title="Novo Pet" onClose={() => setAdding(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Nome" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Nome do pet"/>
            <Select label="Espécie" value={form.especie} onChange={e=>setForm({...form,especie:e.target.value})}
              options={["cachorro","gato","ave","roedor","réptil","outro"]}/>
            <Input label="Raça" value={form.raca} onChange={e=>setForm({...form,raca:e.target.value})}/>
            <Select label="Sexo" value={form.sexo} onChange={e=>setForm({...form,sexo:e.target.value})}
              options={["fêmea","macho"]}/>
            <ModalActions onCancel={() => setAdding(false)} onSave={addPet} color={T.blue}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* TelaPets — export principal                                     */
/* ════════════════════════════════════════════════════════════════ */
export default function TelaPets({ pets = [], setPets, petOpenId, setPetOpenId, onMenu }) {
  /* Garante array mesmo se vier null do estado pai */
  const safePets = Array.isArray(pets) ? pets : [];

  if (petOpenId) {
    const pet = safePets.find(p => p.id === petOpenId);
    if (pet) return (
      <PetDetail
        pet={pet}
        setPets={setPets}
        onBack={() => setPetOpenId(null)}/>
    );
  }

  return (
    <PetsList
      pets={safePets}
      setPets={setPets}
      onOpen={id => setPetOpenId(id)}
      onMenu={onMenu}/>
  );
}
