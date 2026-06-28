import { useState, useRef } from "react";
import { T } from "../constants/theme.js";
import { Card, Pill, IconBtn, Modal, Input, Select, ModalActions, MascoteHeader } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { compressImage } from "../utils/image.js";

const MEMORIA_TAGS   = ["Família","Viagem","Pet","Trabalho","Saúde","Conquista","Especial","Cotidiano"];
const MEMORIA_HUMORES = ["","😄 Feliz","😍 Apaixonada","😌 Tranquila","😤 Estressada","😢 Triste","🤩 Animada","😴 Cansada"];
const MONTH_NAMES    = ["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const parseDate = s => {
  if (!s) return 0;
  const [d,m,y] = s.split("/");
  return new Date(y, m-1, d);
};

export default function TelaMemorias({ memorias, setMemorias, onMenu }) {
  const [tab, setTab] = useState("album");
  const fotos  = memorias.filter(m => m.tipo==="foto").length;
  const textos = memorias.filter(m => m.tipo==="texto").length;

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <AppHeader title="Memórias" onMenu={onMenu}/>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 16px 100px" }}>
        <MascoteHeader secao="memorias" sub="Registros que importam"/>

        <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14 }}>
          {[
            { id:"album",    l:`📷 Álbum (${fotos})`    },
            { id:"diario",   l:`📝 Diário (${textos})`  },
            { id:"timeline", l:"⏳ Timeline"             },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1,padding:"7px 8px",borderRadius:8,fontSize:11,fontWeight:700,
              background: tab===t.id ? T.bgCard : "transparent",
              border:     tab===t.id ? `1px solid ${T.border}` : "none",
              color:      tab===t.id ? T.text : T.textMute }}>{t.l}</button>
          ))}
        </div>

        {tab==="album"    && <AlbumTab    memorias={memorias} setMemorias={setMemorias}/>}
        {tab==="diario"   && <DiarioTab   memorias={memorias} setMemorias={setMemorias}/>}
        {tab==="timeline" && <TimelineTab memorias={memorias}/>}
      </div>
    </div>
  );
}

/* ── AlbumTab ─────────────────────────────────────────────────── */
function AlbumTab({ memorias, setMemorias }) {
  const [addModal, setAddModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [filtro,   setFiltro]   = useState("Todos");

  const fotos    = memorias.filter(m => m.tipo==="foto");
  const filtered = filtro==="Todos" ? fotos : fotos.filter(m => (m.tags||[]).includes(filtro));

  return (
    <>
      <div style={{ display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4 }}>
        {["Todos",...MEMORIA_TAGS].map(t => (
          <button key={t} onClick={() => setFiltro(t)} style={{
            padding:"5px 11px",borderRadius:99,fontSize:11,fontWeight:700,
            background: filtro===t ? T.sand : T.bgCard,
            color:      filtro===t ? "#fff" : T.textSub,
            border:`1px solid ${filtro===t ? T.sand : T.border}`,
            whiteSpace:"nowrap",flexShrink:0 }}>{t}</button>
        ))}
      </div>

      {filtered.length===0 ? (
        <Card style={{ padding:"30px",textAlign:"center" }}>
          <div style={{ fontSize:32,marginBottom:8 }}>📷</div>
          <div style={{ fontSize:13,color:T.textMute }}>Nenhuma foto aqui ainda</div>
        </Card>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14 }}>
          {filtered.map(m => (
            <button key={m.id} onClick={() => setViewItem(m)} style={{
              aspectRatio:"1",borderRadius:10,overflow:"hidden",
              border:`1px solid ${T.border}`,padding:0,background:T.bgInput }}>
              <img src={m.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            </button>
          ))}
        </div>
      )}

      <button onClick={() => setAddModal(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,
        background:T.sand,color:"#fff",fontSize:14,fontWeight:700,
        boxShadow:"0 2px 12px rgba(196,169,106,.3)" }}>+ Adicionar Foto</button>

      {addModal && (
        <MemoriaModal tipo="foto" onClose={() => setAddModal(false)}
          onSave={m => { setMemorias(ms => [...ms, {id:Date.now(),tipo:"foto",...m}]); setAddModal(false); }}/>
      )}

      {viewItem && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:700,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20 }}
          onClick={() => setViewItem(null)}>
          <img src={viewItem.foto} alt="" style={{ maxWidth:"100%",maxHeight:"65%",borderRadius:14 }}/>
          <div style={{ color:"#fff",marginTop:12,fontSize:14,fontWeight:700 }}>{viewItem.titulo||""}</div>
          <div style={{ color:"#ffffff88",marginTop:4,fontSize:12 }}>{viewItem.data}</div>
          {(viewItem.tags||[]).length>0 && (
            <div style={{ display:"flex",gap:6,marginTop:8,flexWrap:"wrap",justifyContent:"center" }}>
              {viewItem.tags.map(tag => (
                <Pill key={tag} label={tag} color="#fff" bg="rgba(255,255,255,.15)"/>
              ))}
            </div>
          )}
          <button
            onClick={e => { e.stopPropagation(); setMemorias(ms => ms.filter(x=>x.id!==viewItem.id)); setViewItem(null); }}
            style={{ marginTop:20,padding:"8px 18px",borderRadius:99,
              background:T.dangerBg,color:T.danger,fontSize:13,fontWeight:700 }}>🗑️ Remover</button>
        </div>
      )}
    </>
  );
}

/* ── DiarioTab ────────────────────────────────────────────────── */
function DiarioTab({ memorias, setMemorias }) {
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const sorted = [...memorias.filter(m => m.tipo==="texto")]
    .sort((a,b) => parseDate(b.data) - parseDate(a.data));

  return (
    <>
      <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:14 }}>
        {sorted.length===0 ? (
          <Card style={{ padding:"30px",textAlign:"center" }}>
            <div style={{ fontSize:32,marginBottom:8 }}>📝</div>
            <div style={{ fontSize:13,color:T.textMute }}>Comece a escrever suas memórias</div>
          </Card>
        ) : sorted.map(m => (
          <button key={m.id} onClick={() => setEditItem({...m})} style={{
            padding:"14px 16px",borderRadius:14,background:T.bgCard,
            border:`1px solid ${T.border}`,textAlign:"left" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:T.text }}>{m.titulo||"Sem título"}</div>
                <div style={{ fontSize:10,color:T.textMute,marginTop:1 }}>{m.data}</div>
              </div>
              {m.humor&&<span style={{ fontSize:20 }}>{m.humor.split(" ")[0]}</span>}
            </div>
            {m.texto&&(
              <div style={{ fontSize:12,color:T.textSub,lineHeight:1.4,
                overflow:"hidden",display:"-webkit-box",
                WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{m.texto}</div>
            )}
            {(m.tags||[]).length>0&&(
              <div style={{ display:"flex",gap:4,marginTop:8,flexWrap:"wrap" }}>
                {m.tags.map(tag => <Pill key={tag} label={tag} color={T.sand} bg={T.sandBg}/>)}
              </div>
            )}
          </button>
        ))}
      </div>

      <button onClick={() => setAddModal(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,
        background:T.sand,color:"#fff",fontSize:14,fontWeight:700,
        boxShadow:"0 2px 12px rgba(196,169,106,.3)" }}>+ Nova Entrada</button>

      {addModal && (
        <MemoriaModal tipo="texto" onClose={() => setAddModal(false)}
          onSave={m => { setMemorias(ms => [...ms, {id:Date.now(),tipo:"texto",...m}]); setAddModal(false); }}/>
      )}
      {editItem && (
        <MemoriaModal tipo="texto" memoria={editItem} onClose={() => setEditItem(null)}
          onSave={m => { setMemorias(ms => ms.map(x => x.id===editItem.id ? {...x,...m} : x)); setEditItem(null); }}
          onDelete={() => { setMemorias(ms => ms.filter(x => x.id!==editItem.id)); setEditItem(null); }}/>
      )}
    </>
  );
}

/* ── TimelineTab ──────────────────────────────────────────────── */
function TimelineTab({ memorias }) {
  const sorted = [...memorias].sort((a,b) => parseDate(b.data) - parseDate(a.data));

  if (sorted.length===0) return (
    <Card style={{ padding:"30px",textAlign:"center" }}>
      <div style={{ fontSize:32,marginBottom:8 }}>⏳</div>
      <div style={{ fontSize:13,color:T.textMute }}>
        Adicione fotos e entradas de diário para ver a linha do tempo
      </div>
    </Card>
  );

  const byMonth = {};
  sorted.forEach(m => {
    const parts = (m.data||"").split("/");
    const key   = parts.length===3 ? `${parts[1]}/${parts[2]}` : "—";
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(m);
  });

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      {Object.entries(byMonth).map(([key, items]) => {
        const [mes,ano] = key.split("/");
        const label = key==="—" ? "Sem data" : `${MONTH_NAMES[parseInt(mes)]||mes} ${ano}`;
        return (
          <div key={key}>
            <div style={{ fontSize:12,fontWeight:800,color:T.textMute,marginBottom:8,
              letterSpacing:.5,textTransform:"uppercase" }}>{label}</div>
            <div style={{ display:"flex",flexDirection:"column",gap:6,
              paddingLeft:14,borderLeft:`2px solid ${T.border}` }}>
              {items.map(m => (
                <div key={m.id} style={{ padding:"10px 12px",borderRadius:12,
                  background:T.bgCard,border:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:18 }}>{m.tipo==="foto" ? "📷" : "📝"}</span>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:12,fontWeight:700,color:T.text,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                        {m.titulo||"Sem título"}
                      </div>
                      <div style={{ fontSize:10,color:T.textMute,marginTop:1 }}>{m.data}</div>
                    </div>
                    {m.foto&&(
                      <div style={{ width:38,height:38,borderRadius:8,overflow:"hidden",flexShrink:0 }}>
                        <img src={m.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                      </div>
                    )}
                    {m.humor&&<span style={{ fontSize:18,flexShrink:0 }}>{m.humor.split(" ")[0]}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── MemoriaModal ─────────────────────────────────────────────── */
function MemoriaModal({ tipo, memoria, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(memoria || {
    titulo:"", data:new Date().toLocaleDateString("pt-BR"),
    foto:null, tags:[], texto:"", humor:"",
  });
  const fileRef = useRef();
 const handleFoto = async e => {
  const f = e.target.files[0]; if (!f) return;
  const foto = await compressImage(f, 1200, 0.85);
  setForm(x => ({ ...x, foto }));
};
  const toggleTag = tag => setForm(f => ({
    ...f, tags: f.tags.includes(tag) ? f.tags.filter(t=>t!==tag) : [...f.tags, tag],
  }));

  return (
    <Modal title={memoria ? "Editar" : tipo==="foto" ? "Nova Foto" : "Nova Entrada"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Input label="Título" value={form.titulo}
          onChange={e=>setForm(f=>({...f,titulo:e.target.value}))}/>
        <Input label="Data" value={form.data}
          onChange={e=>setForm(f=>({...f,data:e.target.value}))} placeholder="dd/mm/aaaa"/>

        <button onClick={() => fileRef.current.click()} style={{
          width:"100%",height:150,borderRadius:14,overflow:"hidden",
          background:T.sandBg,border:`2px dashed ${form.foto ? T.sand : T.borderMd}`,
          display:"flex",alignItems:"center",justifyContent:"center" }}>
          {form.foto
            ? <img src={form.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            : <div style={{ textAlign:"center",color:T.textMute }}>
                <div style={{ fontSize:30 }}>📷</div>
                <div style={{ fontSize:11,fontWeight:600,marginTop:4 }}>
                  {tipo==="foto" ? "Foto" : "Foto (opcional)"}
                </div>
              </div>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>

        {tipo==="texto" && (
          <>
            <Select label="Humor" value={form.humor}
              onChange={e=>setForm(f=>({...f,humor:e.target.value}))} options={MEMORIA_HUMORES}/>
            <div>
              <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>TEXTO</div>
              <textarea value={form.texto} onChange={e=>setForm(f=>({...f,texto:e.target.value}))} rows={4}
                placeholder="O que aconteceu hoje..."
                style={{ width:"100%",padding:"10px 13px",borderRadius:10,
                  border:`1px solid ${T.border}`,background:T.bgInput,
                  fontSize:13,color:T.text,resize:"none" }}/>
            </div>
          </>
        )}

        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:6,letterSpacing:.3 }}>TAGS</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {MEMORIA_TAGS.map(tag => {
              const sel = form.tags.includes(tag);
              return (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding:"4px 10px",borderRadius:99,fontSize:11,fontWeight:700,
                  background: sel ? T.sand : T.bgInput,
                  color:      sel ? "#fff" : T.textSub,
                  border:`1px solid ${sel ? T.sand : T.border}` }}>{tag}</button>
              );
            })}
          </div>
        </div>

        <ModalActions onCancel={onClose} onSave={() => onSave(form)}
          onDelete={onDelete} color={T.sand}/>
      </div>
    </Modal>
  );
}
