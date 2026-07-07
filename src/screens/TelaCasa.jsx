import { useState, useRef } from "react";
import { T } from "../constants/theme.js";
import { Card, Pill, IconBtn, Modal, Input, Select, ModalActions, MascoteHeader, SvgIcon } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { compressImage } from "../utils/image.js";
import { COW_ESTRELA } from "../constants/images.js";

const FASES      = ["Planejamento","Em andamento","Concluído","Sonhos"];
const CATEGORIAS = ["Reforma","Jardinagem","Pomar","Energia solar","Cercas","Paisagismo","Outros"];
const FOTO_TIPOS = ["Antes","Depois","Evolução"];

/* ── Root ─────────────────────────────────────────────────────────────── */
export default function TelaCasa({ tarefas=[], setTarefas, compras=[], setCompras, manutencoes=[], setManutencoes, onMenu }) {
  const [tab, setTab] = useState("casa");

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <AppHeader title="Casa & Sítio" onMenu={onMenu}/>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 16px 100px" }}>
        <MascoteHeader secao="casa" sub="Hoje e o sonho de amanhã"/>

        <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14 }}>
          {[{ id:"casa",icon:"home",label:"Casa"},{id:"sitio",icon:"tree",label:"Sítio"}].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1,padding:"7px 0",borderRadius:8,fontSize:13,fontWeight:700,
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              background: tab === t.id ? T.bgCard : "transparent",
              border:     tab === t.id ? `1px solid ${T.border}` : "none",
              color:      tab === t.id ? T.text : T.textMute }}>
              <SvgIcon name={t.icon} size={14}/>{t.label}
            </button>
          ))}
        </div>

        {tab === "casa"  && <CasaTab  comodos={tarefas}     setComodos={setTarefas}/>}
        {tab === "sitio" && <SitioTab projetos={manutencoes} setProjetos={setManutencoes}/>} 
      </div>
    </div>
  );
}

/* ── Casa Tab — pendências por cômodo ─────────────────────────────────── */
function CasaTab({ comodos, setComodos }) {
  const [novoComodo, setNovoComodo] = useState("");
  const [editComodo, setEditComodo] = useState(null); // {id} sendo renomeado
  const [editPend,   setEditPend]   = useState(null); // {comodoId, pend}

  const safeComodos = Array.isArray(comodos) ? comodos : [];

  const addComodo = () => {
    if (!novoComodo.trim()) return;
    setComodos(cs => [...(Array.isArray(cs)?cs:[]), { id:Date.now().toString(), nome:novoComodo.trim(), pendencias:[] }]);
    setNovoComodo("");
  };

  const removerComodo = (id) => {
    if (!window.confirm("Remover este cômodo e todas as suas pendências?")) return;
    setComodos(cs => cs.filter(c => c.id !== id));
  };

  const renomearComodo = (id, nome) => {
    setComodos(cs => cs.map(c => c.id===id ? {...c, nome} : c));
    setEditComodo(null);
  };

  const togglePend = (comodoId, pendId) => setComodos(cs => cs.map(c =>
    c.id !== comodoId ? c : { ...c, pendencias: c.pendencias.map(p => p.id===pendId ? {...p, feita:!p.feita} : p) }
  ));

  const removerPend = (comodoId, pendId) => setComodos(cs => cs.map(c =>
    c.id !== comodoId ? c : { ...c, pendencias: c.pendencias.filter(p => p.id !== pendId) }
  ));

  const salvarPend = (comodoId, pend) => setComodos(cs => cs.map(c => {
    if (c.id !== comodoId) return c;
    const existe = pend.id && c.pendencias.some(p => p.id === pend.id);
    return {
      ...c,
      pendencias: existe
        ? c.pendencias.map(p => p.id===pend.id ? pend : p)
        : [...c.pendencias, { ...pend, id: pend.id || Date.now().toString() }],
    };
  }));

  return (
    <>
      {/* Input novo cômodo */}
      <div style={{ display:"flex",gap:8,marginBottom:16 }}>
        <input value={novoComodo} onChange={(e) => setNovoComodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addComodo()}
          placeholder="Nome do cômodo (ex: Cozinha, Sala...)"
          style={{ flex:1,padding:"11px 15px",borderRadius:11,
            border:`1px solid ${T.border}`,background:T.bgCard,fontSize:13,color:T.text }}/>
        <button onClick={addComodo} style={{ width:44,height:44,borderRadius:11,
          background:T.moss,color:"#fff",fontSize:20,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 2px 10px rgba(95,122,74,.35)" }}>+</button>
      </div>

      {safeComodos.length === 0 && (
        <Card style={{ padding:"30px 20px",textAlign:"center" }}>
          <SvgIcon name="home" size={30} color={T.textMute}/>
          <div style={{ fontSize:13,color:T.textMute,marginTop:10 }}>
            Adicione um cômodo pra começar sua lista de reforminhas.
          </div>
        </Card>
      )}

      {safeComodos.map(comodo => {
        const pends = comodo.pendencias || [];
        const pendentes  = pends.filter(p => !p.feita);
        const concluidas = pends.filter(p => p.feita);
        return (
          <Card key={comodo.id} style={{ padding:"14px 16px",marginBottom:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
              {editComodo === comodo.id ? (
                <input autoFocus defaultValue={comodo.nome}
                  onBlur={(e) => renomearComodo(comodo.id, e.target.value.trim() || comodo.nome)}
                  onKeyDown={(e) => e.key === "Enter" && renomearComodo(comodo.id, e.target.value.trim() || comodo.nome)}
                  style={{ flex:1,fontSize:15,fontWeight:700,fontFamily:"inherit",
                    border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 8px",background:T.bgInput }}/>
              ) : (
                <div className="serif" style={{ flex:1,fontSize:16,fontWeight:700,color:T.text }}
                  onClick={() => setEditComodo(comodo.id)}>
                  {comodo.nome}
                </div>
              )}
              <Pill label={`${pendentes.length} pendente${pendentes.length!==1?"s":""}`}
                color={pendentes.length>0 ? T.terra : T.moss} bg={pendentes.length>0 ? T.terraBg : T.mossBg}/>
              <IconBtn icon="pencil" onClick={() => setEditComodo(comodo.id)}/>
              <IconBtn icon="trash" onClick={() => removerComodo(comodo.id)}/>
            </div>

            {pends.length === 0 && (
              <div style={{ fontSize:12,color:T.textMute,fontStyle:"italic",marginBottom:10 }}>
                Nenhuma pendência ainda.
              </div>
            )}

            <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:10 }}>
              {[...pendentes, ...concluidas].map(p => (
                <div key={p.id} style={{ borderRadius:10,background:T.bgInput,padding:"9px 10px",opacity:p.feita?.6:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                    <button onClick={() => togglePend(comodo.id, p.id)} style={{
                      width:19,height:19,borderRadius:"50%",flexShrink:0,
                      border:`2px solid ${p.feita ? T.moss : T.borderMd}`,
                      background: p.feita ? T.moss : "transparent",
                      display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {p.feita && (
                        <svg width="9" height="7" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4L4 7.5L10 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </button>
                    <span style={{ flex:1,fontSize:13,fontWeight:500,textDecoration:p.feita?"line-through":"none" }}>
                      {p.texto}
                    </span>
                    {(p.fotos||[]).length > 0 && (
                      <Pill label={`${p.fotos.length}`} color={T.lav} bg={T.lavBg}/>
                    )}
                    <IconBtn icon="pencil" size={13} onClick={() => setEditPend({ comodoId:comodo.id, pend:{...p} })}/>
                    <IconBtn icon="trash" size={13} onClick={() => removerPend(comodo.id, p.id)}/>
                  </div>
                  {(p.fotos||[]).length > 0 && (
                    <div style={{ display:"flex",gap:6,marginTop:8,overflowX:"auto",paddingLeft:28 }}>
                      {p.fotos.map((f,i) => (
                        <div key={i} style={{ position:"relative",flexShrink:0 }}>
                          <img src={f.src} alt="" style={{ width:54,height:54,borderRadius:8,objectFit:"cover" }}/>
                          {f.tipo && (
                            <div style={{ position:"absolute",bottom:2,left:2,right:2,textAlign:"center",
                              background:"rgba(0,0,0,.55)",borderRadius:4,padding:"1px 0" }}>
                              <span style={{ fontSize:8,fontWeight:700,color:"#fff" }}>{f.tipo}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => setEditPend({ comodoId:comodo.id, pend:{ texto:"", feita:false, fotos:[] } })}
              style={{ fontSize:12,fontWeight:700,color:T.moss,
                background:T.mossBg,borderRadius:20,padding:"6px 14px" }}>
              + Pendência
            </button>
          </Card>
        );
      })}

      {editPend && (
        <PendenciaModal
          pend={editPend.pend}
          onClose={() => setEditPend(null)}
          onSave={(p) => { salvarPend(editPend.comodoId, p); setEditPend(null); }}
          onDelete={editPend.pend.id ? () => { removerPend(editPend.comodoId, editPend.pend.id); setEditPend(null); } : undefined}/>
      )}
    </>
  );
}

/* ── PendenciaModal ───────────────────────────────────────────────────── */
function PendenciaModal({ pend, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(pend);
  const fileRef = useRef();
  const tipoPendenteRef = useRef("Evolução");

  const addFoto = (tipo) => {
    tipoPendenteRef.current = tipo;
    fileRef.current.click();
  };

  const handleFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const data = await compressImage(f, 900, 0.85);
    setForm((x) => ({ ...x, fotos: [...(x.fotos || []), { src:data, tipo:tipoPendenteRef.current }] }));
  };
  const removerFoto = (i) => setForm((x) => ({ ...x, fotos: x.fotos.filter((_, idx) => idx !== i) }));

  return (
    <Modal title={pend.id ? "Editar Pendência" : "Nova Pendência"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Input label="O que precisa ser feito" value={form.texto}
          onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}/>

        <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",
          padding:"10px 12px",borderRadius:10,background:T.bgInput,border:`1px solid ${T.border}` }}>
          <input type="checkbox" checked={!!form.feita}
            onChange={(e) => setForm((f) => ({ ...f, feita: e.target.checked }))}/>
          <span style={{ fontSize:13,fontWeight:600 }}>Concluída</span>
        </label>

        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>
        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:6,letterSpacing:.3 }}>FOTOS</div>
          <div style={{ display:"flex",gap:6,marginBottom:10 }}>
            {FOTO_TIPOS.map(t => (
              <button key={t} onClick={() => addFoto(t)} style={{
                flex:1,padding:"7px 4px",borderRadius:9,fontSize:11,fontWeight:700,
                background:T.mossBg,color:T.moss,border:`1px solid ${T.moss}33` }}>
                + {t}
              </button>
            ))}
          </div>
          {(form.fotos||[]).length > 0 && (
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {form.fotos.map((f, i) => (
                <div key={i} style={{ position:"relative",width:76,height:76 }}>
                  <img src={f.src} alt="" style={{ width:"100%",height:"100%",borderRadius:10,objectFit:"cover" }}/>
                  {f.tipo && (
                    <div style={{ position:"absolute",bottom:3,left:3,right:3,textAlign:"center",
                      background:"rgba(0,0,0,.6)",borderRadius:5,padding:"2px 0" }}>
                      <span style={{ fontSize:9,fontWeight:700,color:"#fff" }}>{f.tipo}</span>
                    </div>
                  )}
                  <button onClick={() => removerFoto(i)} style={{ position:"absolute",top:-5,right:-5,
                    width:20,height:20,borderRadius:"50%",background:T.danger,color:"#fff",fontSize:11,
                    display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <ModalActions onCancel={onClose} onSave={() => { if(!form.texto?.trim()) return; onSave(form); }}
          onDelete={onDelete} color={T.moss}/>
      </div>
    </Modal>
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
                    <IconBtn icon="pencil" onClick={() => setEdit({ ...p })}/>
                    <IconBtn icon="trash" onClick={() => deletar(p.id)}/>
                  </div>
                  {p.fotos && p.fotos.length > 0 && (
                    <div style={{ display:"flex",gap:6,marginTop:10,overflowX:"auto" }}>
                      {p.fotos.map((foto, i) => {
                        const src = typeof foto === "string" ? foto : foto.src;
                        const tipo = typeof foto === "string" ? null : foto.tipo;
                        return (
                          <div key={i} style={{ position:"relative",flexShrink:0 }}>
                            <img src={src} alt="" style={{ width:64,height:64,borderRadius:8,objectFit:"cover" }}/>
                            {tipo && (
                              <div style={{ position:"absolute",bottom:2,left:2,right:2,textAlign:"center",
                                background:"rgba(0,0,0,.55)",borderRadius:4,padding:"1px 0" }}>
                                <span style={{ fontSize:8,fontWeight:700,color:"#fff" }}>{tipo}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
  const tipoPendenteRef = useRef("Evolução");

  const addFoto = (tipo) => { tipoPendenteRef.current = tipo; fileRef.current.click(); };

  const handleFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const data = await compressImage(f, 900, 0.85);
    setForm((x) => ({ ...x, fotos: [...(x.fotos || []), { src:data, tipo:tipoPendenteRef.current }] }));
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

        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>
        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:6,letterSpacing:.3 }}>FOTOS DA EVOLUÇÃO</div>
          <div style={{ display:"flex",gap:6,marginBottom:10 }}>
            {FOTO_TIPOS.map(t => (
              <button key={t} onClick={() => addFoto(t)} style={{
                flex:1,padding:"7px 4px",borderRadius:9,fontSize:11,fontWeight:700,
                background:T.mossBg,color:T.moss,border:`1px solid ${T.moss}33` }}>
                + {t}
              </button>
            ))}
          </div>
          {form.fotos && form.fotos.length > 0 && (
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {form.fotos.map((foto, i) => {
                const src = typeof foto === "string" ? foto : foto.src;
                const tipo = typeof foto === "string" ? null : foto.tipo;
                return (
                  <div key={i} style={{ position:"relative",width:70,height:70 }}>
                    <img src={src} alt="" style={{ width:"100%",height:"100%",borderRadius:8,objectFit:"cover" }}/>
                    {tipo && (
                      <div style={{ position:"absolute",bottom:2,left:2,right:2,textAlign:"center",
                        background:"rgba(0,0,0,.55)",borderRadius:4,padding:"1px 0" }}>
                        <span style={{ fontSize:8,fontWeight:700,color:"#fff" }}>{tipo}</span>
                      </div>
                    )}
                    <button onClick={() => removerFoto(i)} style={{ position:"absolute",top:-4,right:-4,
                      width:20,height:20,borderRadius:"50%",background:T.danger,color:"#fff",fontSize:11,
                      display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.moss}/>
      </div>
    </Modal>
  );
}
