import { useState, useRef } from "react";
import { T } from "../constants/theme.js";
import { Card, Pill, IconBtn, Modal, Input, Select, ModalActions, MascoteHeader } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { compressImage } from "../utils/image.js";
import { COW_ESTRELA } from "../constants/images.js";

const FASES      = ["Planejamento","Em andamento","Concluído","Sonhos"];
const CATEGORIAS = ["Reforma","Jardinagem","Pomar","Energia solar","Cercas","Paisagismo","Outros"];

/* ── Root ─────────────────────────────────────────────────────────────── */
export default function TelaCasa({ casaTarefas, setCasaTarefas, sitioProjetos, setSitioProjetos, onMenu }) {
  const [tab, setTab] = useState("casa");

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <AppHeader title="Casa & Sítio" onMenu={onMenu}/>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 16px 100px" }}>
        <MascoteHeader secao="casa" sub="Hoje e o sonho de amanhã"/>

        <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14 }}>
          {[{ id:"casa",l:"🏡 Casa"},{id:"sitio",l:"🌳 Sítio"}].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1,padding:"7px 0",borderRadius:8,fontSize:13,fontWeight:700,
              background: tab === t.id ? T.bgCard : "transparent",
              border:     tab === t.id ? `1px solid ${T.border}` : "none",
              color:      tab === t.id ? T.text : T.textMute }}>{t.l}</button>
          ))}
        </div>

        {tab === "casa"  && <CasaTab  tarefas={casaTarefas}  setTarefas={setCasaTarefas}/>}
        {tab === "sitio" && <SitioTab projetos={sitioProjetos} setProjetos={setSitioProjetos}/>}
      </div>
    </div>
  );
}

/* ── Casa Tab ─────────────────────────────────────────────────────────── */
function CasaTab({ tarefas, setTarefas }) {
  const [nova, setNova]  = useState("");
  const [edit, setEdit]  = useState(null);

  const toggle = (id) => setTarefas((ts) => ts.map((t) => t.id === id ? { ...t, feita: !t.feita } : t));
  const deletar = (id) => setTarefas((ts) => ts.filter((t) => t.id !== id));
  const add = () => {
    if (!nova.trim()) return;
    setTarefas((ts) => [...ts, { id: Date.now(), texto: nova.trim(), feita: false }]);
    setNova("");
  };

  const pendentes  = tarefas.filter((t) => !t.feita);
  const concluidas = tarefas.filter((t) =>  t.feita);

  return (
    <>
      {/* Input rápido */}
      <div style={{ display:"flex",gap:8,marginBottom:14 }}>
        <input value={nova} onChange={(e) => setNova(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Adicionar tarefa…"
          style={{ flex:1,padding:"11px 15px",borderRadius:11,
            border:`1px solid ${T.border}`,background:T.bgCard,fontSize:13,color:T.text }}/>
        <button onClick={add} style={{ width:44,height:44,borderRadius:11,
          background:T.moss,color:"#fff",fontSize:20,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 2px 10px rgba(95,122,74,.35)" }}>+</button>
      </div>

      {/* Pendentes */}
      <div style={{ fontSize:11,color:T.textMute,fontWeight:700,
        textTransform:"uppercase",letterSpacing:.8,marginBottom:8 }}>
        Pendentes · {pendentes.length}
      </div>
      <Card style={{ marginBottom:14 }}>
        {pendentes.length === 0 ? (
          <div style={{ padding:"16px",fontSize:13,color:T.textMute,textAlign:"center",fontStyle:"italic" }}>
            Casa em ordem 🏡
          </div>
        ) : pendentes.map((t, i) => (
          <div key={t.id} style={{ display:"flex",alignItems:"center",gap:11,
            padding:"11px 16px",
            borderBottom: i < pendentes.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <button onClick={() => toggle(t.id)} style={{ width:22,height:22,borderRadius:"50%",flexShrink:0,
              border:`2px solid ${T.borderMd}`,background:"transparent" }}/>
            <span style={{ flex:1,fontSize:13,fontWeight:500 }}>{t.texto}</span>
            <IconBtn icon="✏️" onClick={() => setEdit({ ...t })}/>
            <IconBtn icon="🗑️" onClick={() => deletar(t.id)}/>
          </div>
        ))}
      </Card>

      {/* Concluídas */}
      {concluidas.length > 0 && (
        <>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,
            textTransform:"uppercase",letterSpacing:.8,marginBottom:8 }}>
            Concluídas · {concluidas.length}
          </div>
          <Card>
            {concluidas.map((t, i) => (
              <div key={t.id} style={{ display:"flex",alignItems:"center",gap:11,
                padding:"11px 16px",opacity:.55,
                borderBottom: i < concluidas.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <button onClick={() => toggle(t.id)} style={{ width:22,height:22,borderRadius:"50%",flexShrink:0,
                  border:`2px solid ${T.moss}`,background:T.moss,
                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7.5L10 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                </button>
                <span style={{ flex:1,fontSize:13,fontWeight:500,textDecoration:"line-through" }}>{t.texto}</span>
                <IconBtn icon="🗑️" onClick={() => deletar(t.id)}/>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* Modal editar */}
      {edit && (
        <Modal title="Editar Tarefa" onClose={() => setEdit(null)}>
          <input value={edit.texto} onChange={(e) => setEdit((m) => ({ ...m, texto: e.target.value }))}
            style={{ width:"100%",padding:"11px 14px",borderRadius:10,
              border:`1px solid ${T.border}`,background:T.bgInput,fontSize:14,marginBottom:12 }}/>
          <ModalActions onCancel={() => setEdit(null)}
            onSave={() => { setTarefas((ts) => ts.map((t) => t.id === edit.id ? { ...t, texto: edit.texto } : t)); setEdit(null); }}
            color={T.moss}/>
        </Modal>
      )}
    </>
  );
}

/* ── Sítio Tab ────────────────────────────────────────────────────────── */
function SitioTab({ projetos, setProjetos }) {
  const [add,  setAdd]  = useState(false);
  const [edit, setEdit] = useState(null);

  const toggle = (id) => setProjetos((ps) => ps.map((p) => p.id === id ? { ...p, feita: !p.feita } : p));
  const deletar = (id) => setProjetos((ps) => ps.filter((p) => p.id !== id));

  return (
    <>
      {/* Banner do sítio */}
      <Card style={{ padding:"14px 16px",marginBottom:14,background:T.mossBg,border:`1px solid ${T.moss}22` }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <img src={COW_ESTRELA} alt="" style={{ width:50,height:50,objectFit:"contain" }}/>
          <div style={{ flex:1 }}>
            <div className="serif" style={{ fontSize:18,fontWeight:700,color:T.moss }}>O sítio</div>
            <div style={{ fontSize:12,color:T.textSub,fontStyle:"italic",marginTop:1 }}>
              "Pequenos cuidados, grandes sonhos." — Estrela
            </div>
            <div style={{ fontSize:11,color:T.textMute,marginTop:4 }}>
              {projetos.filter((p) => p.feita).length} de {projetos.length} marcos concluídos
            </div>
          </div>
        </div>
      </Card>

      {/* Projetos por fase */}
      {FASES.map((fase) => {
        const itens = projetos.filter((p) => p.fase === fase);
        if (itens.length === 0) return null;
        return (
          <div key={fase} style={{ marginBottom:14 }}>
            <div style={{ fontSize:11,color:T.moss,fontWeight:700,
              textTransform:"uppercase",letterSpacing:.8,marginBottom:8 }}>
              {fase} · {itens.length}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {itens.map((p) => (
                <Card key={p.id} style={{ padding:"12px 14px",opacity: p.feita ? .65 : 1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <button onClick={() => toggle(p.id)} style={{ width:22,height:22,borderRadius:"50%",flexShrink:0,
                      border:`2px solid ${p.feita ? T.moss : T.borderMd}`,
                      background: p.feita ? T.moss : "transparent",
                      display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {p.feita && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4L4 7.5L10 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </button>
                    <span style={{ flex:1,fontSize:13,fontWeight:600,
                      textDecoration: p.feita ? "line-through" : "none" }}>{p.texto}</span>
                    {p.categoria && <Pill label={p.categoria} color={T.moss} bg={T.mossBg}/>}
                    <IconBtn icon="✏️" onClick={() => setEdit({ ...p })}/>
                    <IconBtn icon="🗑️" onClick={() => deletar(p.id)}/>
                  </div>
                  {p.fotos && p.fotos.length > 0 && (
                    <div style={{ display:"flex",gap:6,marginTop:10,overflowX:"auto" }}>
                      {p.fotos.map((foto, i) => (
                        <img key={i} src={foto} alt="" style={{ width:64,height:64,borderRadius:8,objectFit:"cover",flexShrink:0 }}/>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      <button onClick={() => setAdd(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,
        background:T.moss,color:"#fff",fontSize:14,fontWeight:700,
        boxShadow:"0 2px 12px rgba(95,122,74,.3)" }}>+ Novo Projeto</button>

      {add  && <ProjetoModal onClose={() => setAdd(false)}
        onSave={(p) => { setProjetos((ps) => [...ps, { id: Date.now(), ...p, feita: false }]); setAdd(false); }}/>}
      {edit && <ProjetoModal projeto={edit} onClose={() => setEdit(null)}
        onSave={(p) => { setProjetos((ps) => ps.map((x) => x.id === edit.id ? { ...x, ...p } : x)); setEdit(null); }}
        onDelete={() => { setProjetos((ps) => ps.filter((x) => x.id !== edit.id)); setEdit(null); }}/>}
    </>
  );
}

/* ── ProjetoModal ─────────────────────────────────────────────────────── */
function ProjetoModal({ projeto, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(projeto || { texto:"", fase:"Planejamento", categoria:"Outros", fotos:[] });
  const fileRef = useRef();

  const addFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const data = await compressImage(f, 900, 0.85);
    setForm((x) => ({ ...x, fotos: [...(x.fotos || []), data] }));
  };
  const removerFoto = (i) => setForm((x) => ({ ...x, fotos: x.fotos.filter((_, idx) => idx !== i) }));

  return (
    <Modal title={projeto ? "Editar Projeto" : "Novo Projeto"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Input label="Descrição" value={form.texto}
          onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}/>

        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex:1 }}>
            <Select label="Fase" value={form.fase}
              onChange={(e) => setForm((f) => ({ ...f, fase: e.target.value }))}
              options={FASES}/>
          </div>
          <div style={{ flex:1 }}>
            <Select label="Categoria" value={form.categoria}
              onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
              options={CATEGORIAS}/>
          </div>
        </div>

        {/* Fotos da evolução */}
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
            <div style={{ fontSize:11,color:T.textMute,fontWeight:700,letterSpacing:.3 }}>FOTOS DA EVOLUÇÃO</div>
            <button onClick={() => fileRef.current.click()}
              style={{ fontSize:11,fontWeight:700,color:T.moss }}>+ Foto</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={addFoto}/>
          {form.fotos && form.fotos.length > 0 && (
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {form.fotos.map((foto, i) => (
                <div key={i} style={{ position:"relative",width:70,height:70 }}>
                  <img src={foto} alt="" style={{ width:"100%",height:"100%",borderRadius:8,objectFit:"cover" }}/>
                  <button onClick={() => removerFoto(i)} style={{ position:"absolute",top:-4,right:-4,
                    width:20,height:20,borderRadius:"50%",background:T.danger,color:"#fff",fontSize:11,
                    display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.moss}/>
      </div>
    </Modal>
  );
}
