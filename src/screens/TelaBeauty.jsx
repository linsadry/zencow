import { useState, useRef } from "react";
import { T } from "../constants/theme.js";
import { Card, Pill, IconBtn, Modal, Input, Select, ModalActions, MascoteHeader, SvgIcon } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { compressImage } from "../utils/image.js";

const BEAUTY_CATS    = ["Limpeza","Tônico","Sérum","Hidratante","Protetor Solar","Esfoliante","Máscara","Contorno dos olhos","Maquiagem","Cabelo","Corpo","Outro"];
const BEAUTY_ROUTINE = ["Manhã","Noite","Ambos"];
const SKIN_CONDS     = ["Normal","Oleosa","Seca","Acneica","Sensível","Opaca","Radiante"];

const fmtPreco = v => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;
const getStatus = p => p.status || "tenho";

export default function TelaBeauty({ produtos, setProdutos, diario, setDiario, onMenu }) {
  const [tab, setTab] = useState("rotina");

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <AppHeader title="Beauty & Skincare" onMenu={onMenu}/>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 16px 100px" }}>
        <MascoteHeader secao="beauty" sub="Rotina de cuidados"/>

        <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14 }}>
          {[
            { id:"rotina",   icon:"sparkle",  label:"Rotina"                        },
            { id:"produtos", icon:"bottle",   label:`Produtos (${produtos.length})` },
            { id:"diario",   icon:"notebook", label:`Diário (${diario.length})`     },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,fontWeight:700,
              display:"flex",alignItems:"center",justifyContent:"center",gap:5,
              background: tab===t.id ? T.bgCard : "transparent",
              border:     tab===t.id ? `1px solid ${T.border}` : "none",
              color:      tab===t.id ? T.text : T.textMute }}>
              <SvgIcon name={t.icon} size={13}/>{t.label}
            </button>
          ))}
        </div>

        {tab==="rotina"   && <RotinaTab   produtos={produtos}/>}
        {tab==="produtos" && <ProdutosTab produtos={produtos} setProdutos={setProdutos}/>}
        {tab==="diario"   && <DiarioTab   diario={diario}     setDiario={setDiario}/>}
      </div>
    </div>
  );
}

/* ── RotinaTab ────────────────────────────────────────────────── */
function RotinaTab({ produtos }) {
  const owned = produtos.filter(p => getStatus(p)==="tenho");
  const sort = items => [...items].sort((a,b) => (a.ordem||99)-(b.ordem||99));
  const manha = sort(owned.filter(p => p.rotina==="Manhã" || p.rotina==="Ambos"));
  const noite  = sort(owned.filter(p => p.rotina==="Noite"  || p.rotina==="Ambos"));

  const Block = ({ titulo, icon, items }) => (
    <Card style={{ padding:"14px 16px",marginBottom:12 }}>
      <div className="serif" style={{ fontSize:15,fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:7 }}>
        <SvgIcon name={icon} size={15}/>{titulo}
      </div>
      {items.length===0 ? (
        <div style={{ fontSize:12,color:T.textMute,fontStyle:"italic" }}>
          Adicione produtos com rotina "{titulo}" para ver aqui
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          {items.map((p,i) => (
            <div key={p.id} style={{ display:"flex",alignItems:"center",gap:10,
              padding:"8px 10px",background:T.bgInput,borderRadius:10 }}>
              <div style={{ width:34,height:34,borderRadius:10,overflow:"hidden",flexShrink:0,
                background:T.sandBg,display:"flex",alignItems:"center",justifyContent:"center" }}>
                {p.foto
                  ? <img src={p.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                  : <SvgIcon name="bottle" size={16} color={T.sand}/>}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:12,fontWeight:700,color:T.text,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.nome}</div>
                <div style={{ fontSize:10,color:T.textMute,marginTop:1 }}>{p.marca||p.categoria}</div>
              </div>
              <Pill label={`${i+1}°`} color={T.sand} bg={T.sandBg}/>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <>
      <Block titulo="Manhã" icon="sun"  items={manha}/>
      <Block titulo="Noite" icon="moon" items={noite}/>
      <Card style={{ padding:"12px 14px",background:T.sandBg,border:`1px solid ${T.sand}22` }}>
        <div style={{ fontSize:11,color:T.textMute,fontWeight:700,display:"flex",alignItems:"center",gap:5 }}>
          <SvgIcon name="bulb" size={13}/>DICA
        </div>
        <div style={{ fontSize:12,color:T.textSub,marginTop:4 }}>
          Cadastre produtos, defina rotina e ordem numérica para organizá-los automaticamente aqui.
        </div>
      </Card>
    </>
  );
}

/* ── ProdutosTab ──────────────────────────────────────────────── */
function ProdutosTab({ produtos, setProdutos }) {
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filtro,   setFiltro]   = useState("Todos");
  const [subTab,   setSubTab]   = useState("tenho"); // "tenho" | "wishlist"

  const tenhoCount    = produtos.filter(p => getStatus(p)==="tenho").length;
  const wishlistCount = produtos.filter(p => getStatus(p)==="wishlist").length;

  let base = produtos.filter(p => getStatus(p)===subTab);
  let filtered = filtro==="Todos"     ? base
    : filtro==="Favoritos" ? base.filter(p => p.favorito)
    : base.filter(p => p.categoria===filtro);

  if (subTab==="wishlist") {
    filtered = [...filtered].sort((a,b) => (a.preco ?? Infinity) - (b.preco ?? Infinity));
  }

  return (
    <>
      <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:12 }}>
        {[
          { id:"tenho",    icon:"bottle", label:`Tenho (${tenhoCount})`       },
          { id:"wishlist", icon:"gift",   label:`Wishlist (${wishlistCount})` },
        ].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            flex:1,padding:"7px 10px",borderRadius:8,fontSize:12,fontWeight:700,
            display:"flex",alignItems:"center",justifyContent:"center",gap:5,
            background: subTab===t.id ? T.bgCard : "transparent",
            border:     subTab===t.id ? `1px solid ${T.border}` : "none",
            color:      subTab===t.id ? T.text : T.textMute }}>
            <SvgIcon name={t.icon} size={13}/>{t.label}
          </button>
        ))}
      </div>

      <div style={{ display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4 }}>
        {["Todos","Favoritos",...BEAUTY_CATS].map(c => (
          <button key={c} onClick={() => setFiltro(c)} style={{
            padding:"5px 11px",borderRadius:99,fontSize:11,fontWeight:700,
            background: filtro===c ? T.sand : T.bgCard,
            color:      filtro===c ? "#fff" : T.textSub,
            border:`1px solid ${filtro===c ? T.sand : T.border}`,
            whiteSpace:"nowrap",flexShrink:0 }}>{c}</button>
        ))}
      </div>

      {filtered.length===0 ? (
        <Card style={{ padding:"24px",textAlign:"center" }}>
          <div style={{ fontSize:13,color:T.textMute }}>
            {subTab==="wishlist" ? "Nenhum item na wishlist" : "Nenhum produto aqui"}
          </div>
        </Card>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:14 }}>
          {filtered.map(p => (
            <button key={p.id} onClick={() => setEditItem({...p})} style={{
              display:"flex",alignItems:"center",gap:12,padding:"10px 12px",
              borderRadius:12,background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"left" }}>
              <div style={{ width:50,height:50,borderRadius:12,overflow:"hidden",flexShrink:0,
                background:T.sandBg,display:"flex",alignItems:"center",justifyContent:"center" }}>
                {p.foto
                  ? <img src={p.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                  : <SvgIcon name="bottle" size={22} color={T.sand}/>}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13,fontWeight:700,color:T.text,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.nome}</div>
                <div style={{ fontSize:11,color:T.textMute,marginTop:2 }}>
                  {p.marca&&`${p.marca} · `}{p.categoria}
                </div>
                <div style={{ display:"flex",gap:4,marginTop:4,flexWrap:"wrap",alignItems:"center" }}>
                  {subTab==="tenho" && <Pill label={p.rotina} color={T.sand} bg={T.sandBg}/>}
                  {p.preco!=null && <Pill label={fmtPreco(p.preco)} color={T.terra} bg={T.terraBg}/>}
                  {p.favorito && <Pill label={<SvgIcon name="heart" size={10} color={T.sand}/>} color={T.sand} bg={T.sandBg}/>}
                </div>
              </div>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 1L7 7L1 13" stroke={T.textMute} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          ))}
        </div>
      )}

      <button onClick={() => setAddModal(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,
        background:T.sand,color:"#fff",fontSize:14,fontWeight:700,
        boxShadow:"0 2px 12px rgba(196,169,106,.3)" }}>
        + Novo Produto
      </button>

      {addModal && (
        <ProdutoModal defaultStatus={subTab} onClose={() => setAddModal(false)}
          onSave={p => { setProdutos(ps => [...ps, {id:Date.now(),...p}]); setAddModal(false); }}/>
      )}
      {editItem && (
        <ProdutoModal produto={editItem} onClose={() => setEditItem(null)}
          onSave={p => { setProdutos(ps => ps.map(x => x.id===editItem.id ? {...x,...p} : x)); setEditItem(null); }}
          onDelete={() => { setProdutos(ps => ps.filter(x => x.id!==editItem.id)); setEditItem(null); }}/>
      )}
    </>
  );
}

/* ── DiarioTab ────────────────────────────────────────────────── */
function DiarioTab({ diario, setDiario }) {
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const parseDate = s => {
    if (!s) return 0;
    const [d,m,y] = s.split("/");
    return new Date(y, m-1, d);
  };
  const sorted = [...diario].sort((a,b) => parseDate(b.data) - parseDate(a.data));

  return (
    <>
      <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:14 }}>
        {sorted.length===0 ? (
          <Card style={{ padding:"30px",textAlign:"center" }}>
            <div style={{ marginBottom:8,display:"flex",justifyContent:"center" }}>
              <SvgIcon name="notebook" size={32} color={T.textMute}/>
            </div>
            <div style={{ fontSize:13,color:T.textMute }}>Comece a registrar sua pele</div>
          </Card>
        ) : sorted.map(e => (
          <button key={e.id} onClick={() => setEditItem({...e})} style={{
            display:"flex",gap:12,padding:"12px 14px",borderRadius:12,
            background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"left" }}>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                <span style={{ fontSize:11,fontWeight:700,color:T.textMute }}>{e.data}</span>
                {e.condicao&&<Pill label={e.condicao} color={T.sand} bg={T.sandBg}/>}
              </div>
              {e.notas&&<div style={{ fontSize:12,color:T.textSub,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{e.notas}</div>}
            </div>
            {e.foto&&(
              <div style={{ width:44,height:44,borderRadius:10,overflow:"hidden",flexShrink:0 }}>
                <img src={e.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
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
        <DiarioModal onClose={() => setAddModal(false)}
          onSave={e => { setDiario(ds => [...ds, {id:Date.now(),...e}]); setAddModal(false); }}/>
      )}
      {editItem && (
        <DiarioModal entrada={editItem} onClose={() => setEditItem(null)}
          onSave={e => { setDiario(ds => ds.map(x => x.id===editItem.id ? {...x,...e} : x)); setEditItem(null); }}
          onDelete={() => { setDiario(ds => ds.filter(x => x.id!==editItem.id)); setEditItem(null); }}/>
      )}
    </>
  );
}

/* ── ProdutoModal ─────────────────────────────────────────────── */
function ProdutoModal({ produto, defaultStatus, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(produto || {
    nome:"",marca:"",categoria:"Hidratante",rotina:"Ambos",ordem:1,foto:null,favorito:false,
    status: defaultStatus || "tenho", preco:"",
  });
  const fileRef = useRef();
  const handleFoto = async e => {
    const f = e.target.files[0]; if (!f) return;
    const foto = await compressImage(f, 600, 0.85);
    setForm(x => ({ ...x, foto }));
  };

  const status = form.status || "tenho";

  return (
    <Modal title={produto ? "Editar Produto" : "Novo Produto"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3 }}>
          {[
            { id:"tenho",    icon:"bottle", label:"Tenho"    },
            { id:"wishlist", icon:"gift",   label:"Wishlist" },
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setForm(f=>({...f,status:t.id}))} style={{
              flex:1,padding:"8px 10px",borderRadius:8,fontSize:12,fontWeight:700,
              display:"flex",alignItems:"center",justifyContent:"center",gap:5,
              background: status===t.id ? T.bgCard : "transparent",
              border:     status===t.id ? `1px solid ${T.border}` : "none",
              color:      status===t.id ? T.text : T.textMute }}>
              <SvgIcon name={t.icon} size={13}/>{t.label}
            </button>
          ))}
        </div>

        <button onClick={() => fileRef.current.click()} style={{
          width:"100%",height:130,borderRadius:14,overflow:"hidden",
          background:T.sandBg,border:`2px dashed ${form.foto ? T.sand : T.borderMd}`,
          display:"flex",alignItems:"center",justifyContent:"center" }}>
          {form.foto
            ? <img src={form.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            : <div style={{ textAlign:"center",color:T.textMute }}>
                <SvgIcon name="camera" size={28} color={T.textMute}/>
                <div style={{ fontSize:11,fontWeight:600,marginTop:4 }}>Foto do produto</div>
              </div>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>

        <Input label="Nome" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))}/>
        <Input label="Marca (opcional)" value={form.marca||""} onChange={e=>setForm(f=>({...f,marca:e.target.value}))}/>

        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex: status==="tenho" ? 2 : 1 }}>
            <Select label="Categoria" value={form.categoria}
              onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} options={BEAUTY_CATS}/>
          </div>
          <div style={{ flex:1 }}>
            <Input label="Preço (opcional)" type="number" value={form.preco ?? ""}
              placeholder="R$"
              onChange={e=>setForm(f=>({...f,preco: e.target.value===""? "" : parseFloat(e.target.value)}))}/>
          </div>
        </div>

        {status==="tenho" && (
          <div style={{ display:"flex",gap:10 }}>
            <div style={{ flex:2 }}>
              <Select label="Rotina" value={form.rotina||"Ambos"}
                onChange={e=>setForm(f=>({...f,rotina:e.target.value}))} options={BEAUTY_ROUTINE}/>
            </div>
            <div style={{ flex:1 }}>
              <Input label="Ordem" type="number" value={form.ordem||1}
                onChange={e=>setForm(f=>({...f,ordem:parseInt(e.target.value)||1}))}/>
            </div>
          </div>
        )}

        <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",
          padding:"10px 12px",borderRadius:10,background:T.bgInput,border:`1px solid ${T.border}` }}>
          <input type="checkbox" checked={form.favorito}
            onChange={e=>setForm(f=>({...f,favorito:e.target.checked}))}/>
          <span style={{ fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6 }}>
            <SvgIcon name="heart" size={13} color={T.sand}/>Favorito
          </span>
        </label>

        <ModalActions onCancel={onClose} onSave={() => {
          if(!form.nome.trim()) return;
          onSave({ ...form, preco: form.preco===""? null : form.preco });
        }} onDelete={onDelete} color={T.sand}/>
      </div>
    </Modal>
  );
}

/* ── DiarioModal ──────────────────────────────────────────────── */
function DiarioModal({ entrada, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(entrada || {
    data: new Date().toLocaleDateString("pt-BR"),
    condicao:"Normal", notas:"", foto:null,
  });
  const fileRef = useRef();
  const handleFoto = async e => {
    const f = e.target.files[0]; if (!f) return;
    const foto = await compressImage(f, 600, 0.85);
    setForm(x => ({ ...x, foto }));
  };

  return (
    <Modal title={entrada ? "Editar Entrada" : "Nova Entrada"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Input label="Data" value={form.data} onChange={e=>setForm(f=>({...f,data:e.target.value}))} placeholder="dd/mm/aaaa"/>
        <Select label="Condição da pele" value={form.condicao}
          onChange={e=>setForm(f=>({...f,condicao:e.target.value}))} options={SKIN_CONDS}/>

        <button onClick={() => fileRef.current.click()} style={{
          width:"100%",height:110,borderRadius:12,overflow:"hidden",
          background:T.sandBg,border:`2px dashed ${form.foto ? T.sand : T.borderMd}`,
          display:"flex",alignItems:"center",justifyContent:"center" }}>
          {form.foto
            ? <img src={form.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            : <div style={{ textAlign:"center",color:T.textMute }}>
                <SvgIcon name="camera" size={22} color={T.textMute}/>
                <div style={{ fontSize:11,fontWeight:600,marginTop:4 }}>Selfie da pele (opcional)</div>
              </div>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>

        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>NOTAS</div>
          <textarea value={form.notas} onChange={e=>setForm(f=>({...f,notas:e.target.value}))} rows={3}
            placeholder="Como sua pele está hoje? Irritações, reações..."
            style={{ width:"100%",padding:"10px 13px",borderRadius:10,
              border:`1px solid ${T.border}`,background:T.bgInput,
              fontSize:13,color:T.text,resize:"none" }}/>
        </div>

        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.sand}/>
      </div>
    </Modal>
  );
}
