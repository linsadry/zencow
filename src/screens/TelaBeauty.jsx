import { useState, useRef, useMemo } from "react";
import { T } from "../constants/theme.js";
import { Card, Pill, IconBtn, Modal, Input, Select, ModalActions, MascoteHeader } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { compressImage } from "../utils/image.js";
import { COW_CAMELIA } from "../constants/images.js";
import { daysSince } from "../utils/dates.js";

const BEAUTY_CATEGORIAS  = ["Base","Corretivo","Blush","Batom","Sombra","Iluminador","Bronzer","Perfume","Outro"];
const SKINCARE_CATEGORIAS= ["Limpeza","Sérum","Retinol","Hidratante","Vitamina C","Ácidos","Protetor solar","Máscaras"];

/* ── Root ─────────────────────────────────────────────────────────────── */
export default function TelaBeauty({ produtos, setProdutos, makes, setMakes, skProdutos, setSkProdutos, skDiario, setSkDiario, onMenu }) {
  const [tab, setTab] = useState("makeup");

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <AppHeader title="Beauty" onMenu={onMenu}/>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 16px 100px" }}>
        <MascoteHeader secao="beauty" sub="Maquiagem e cuidados com a pele"/>

        <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14 }}>
          {[{ id:"makeup",l:"💄 Maquiagem"},{id:"skincare",l:"🧴 Skincare"}].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1,padding:"7px 0",borderRadius:8,fontSize:13,fontWeight:700,
              background: tab === t.id ? T.bgCard : "transparent",
              border:     tab === t.id ? `1px solid ${T.border}` : "none",
              color:      tab === t.id ? T.text : T.textMute }}>{t.l}</button>
          ))}
        </div>

        {tab === "makeup"   && <MakeupSection   produtos={produtos} setProdutos={setProdutos} makes={makes} setMakes={setMakes}/>}
        {tab === "skincare" && <SkincareSection skProdutos={skProdutos} setSkProdutos={setSkProdutos} skDiario={skDiario} setSkDiario={setSkDiario}/>}
      </div>
    </div>
  );
}

/* ════════════════════════════ MAKEUP ════════════════════════════════════ */
function MakeupSection({ produtos, setProdutos, makes, setMakes }) {
  const [subtab,    setSubtab]  = useState("inventario");
  const [filtro,    setFiltro]  = useState("Todos");
  const [addProd,   setAddProd] = useState(false);
  const [editProd,  setEditProd]= useState(null);
  const [addMake,   setAddMake] = useState(false);
  const [editMake,  setEditMake]= useState(null);

  const favoritosPorCat = BEAUTY_CATEGORIAS.map((cat) => {
    const items = produtos.filter((p) => p.categoria === cat);
    const top   = items.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    return top ? { cat, produto: top } : null;
  }).filter(Boolean);

  return (
    <>
      <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14 }}>
        {[
          { id:"inventario", l:`💄 Inventário (${produtos.length})` },
          { id:"diario",     l:`📔 Diário (${makes.length})`         },
          { id:"favoritos",  l:"⭐ Favoritos"                         },
        ].map((t) => (
          <button key={t.id} onClick={() => setSubtab(t.id)} style={{
            flex:1,padding:"7px 4px",borderRadius:8,fontSize:11,fontWeight:700,
            background: subtab === t.id ? T.bgCard : "transparent",
            border:     subtab === t.id ? `1px solid ${T.border}` : "none",
            color:      subtab === t.id ? T.text : T.textMute }}>{t.l}</button>
        ))}
      </div>

      {/* ── Inventário ─────────────────────────────────────────────────── */}
      {subtab === "inventario" && (
        <>
          <div style={{ display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4 }}>
            {["Todos","Favoritos",...BEAUTY_CATEGORIAS].map((c) => (
              <button key={c} onClick={() => setFiltro(c)} style={{
                padding:"5px 11px",borderRadius:99,fontSize:11,fontWeight:700,
                background: filtro === c ? T.rose : T.bgCard,
                color:      filtro === c ? "#fff"  : T.textSub,
                border:`1px solid ${filtro === c ? T.rose : T.border}`,
                whiteSpace:"nowrap",flexShrink:0 }}>{c}</button>
            ))}
          </div>

          {(() => {
            let f = produtos;
            if (filtro === "Favoritos") f = produtos.filter((p) => p.favorito);
            else if (filtro !== "Todos") f = produtos.filter((p) => p.categoria === filtro);
            return f.length === 0 ? (
              <Card style={{ padding:"24px",textAlign:"center" }}>
                <div style={{ fontSize:13,color:T.textMute }}>Nenhum produto aqui</div>
              </Card>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:14 }}>
                {f.map((p) => (
                  <button key={p.id} onClick={() => setEditProd({ ...p })} style={{
                    display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                    borderRadius:12,background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"left" }}>
                    <div style={{ width:48,height:48,borderRadius:10,background:T.roseBg,
                      display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
                      {p.foto
                        ? <img src={p.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                        : <span style={{ fontSize:11,fontWeight:800,color:T.rose }}>{p.categoria.slice(0,4)}</span>}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:14,fontWeight:700 }}>{p.nome}</div>
                      <div style={{ fontSize:11,color:T.textMute,marginTop:1 }}>{p.marca}{p.cor ? ` · ${p.cor}` : ""}</div>
                    </div>
                    <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2 }}>
                      <div style={{ fontSize:11,color:T.sand }}>
                        {"★".repeat(p.rating || 0)}{"☆".repeat(5 - (p.rating || 0))}
                      </div>
                      {p.favorito && <span style={{ fontSize:14 }}>❤️</span>}
                    </div>
                  </button>
                ))}
              </div>
            );
          })()}
          <button onClick={() => setAddProd(true)} style={{
            width:"100%",padding:"13px",borderRadius:12,background:T.rose,color:"#fff",
            fontSize:14,fontWeight:700,boxShadow:"0 2px 12px rgba(176,122,122,.3)" }}>+ Novo Produto</button>
        </>
      )}

      {/* ── Diário de makes ─────────────────────────────────────────────── */}
      {subtab === "diario" && (
        <>
          {makes.length === 0 ? (
            <Card style={{ padding:"30px 20px",textAlign:"center" }}>
              <img src={COW_CAMELIA} alt="" style={{ width:80,height:80,objectFit:"contain",marginBottom:10 }}/>
              <div className="serif" style={{ fontSize:16,fontWeight:700,marginBottom:4 }}>"Vamos cuidar de você?"</div>
              <div style={{ fontSize:12,color:T.textMute,fontStyle:"italic" }}>— Camélia</div>
            </Card>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
              {makes.map((m) => (
                <button key={m.id} onClick={() => setEditMake({ ...m })} style={{
                  borderRadius:12,overflow:"hidden",background:T.bgCard,
                  border:`1px solid ${T.border}`,textAlign:"left",position:"relative" }}>
                  <div style={{ aspectRatio:"1",background:T.roseBg,
                    display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                    {m.foto
                      ? <img src={m.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                      : <span style={{ fontSize:36 }}>💄</span>}
                  </div>
                  <div style={{ padding:"8px 10px" }}>
                    <div style={{ fontSize:12,fontWeight:700,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m.titulo}</div>
                    <div style={{ fontSize:10,color:T.textMute,marginTop:2 }}>{m.data}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setAddMake(true)} style={{
            width:"100%",padding:"13px",borderRadius:12,background:T.rose,color:"#fff",
            fontSize:14,fontWeight:700,boxShadow:"0 2px 12px rgba(176,122,122,.3)" }}>+ Nova Make</button>
        </>
      )}

      {/* ── Favoritos por categoria ──────────────────────────────────────── */}
      {subtab === "favoritos" && (
        <>
          {favoritosPorCat.length === 0 ? (
            <Card style={{ padding:"24px",textAlign:"center" }}>
              <div style={{ fontSize:13,color:T.textMute,fontStyle:"italic" }}>Adicione produtos com avaliação para ver os favoritos</div>
            </Card>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {favoritosPorCat.map(({ cat, produto }) => (
                <Card key={cat} style={{ padding:"12px 14px" }}>
                  <div style={{ fontSize:11,color:T.textMute,fontWeight:700,letterSpacing:.3,marginBottom:6 }}>
                    MELHOR {cat.toUpperCase()}
                  </div>
                  <button onClick={() => setEditProd({ ...produto })} style={{
                    display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left" }}>
                    <div style={{ width:44,height:44,borderRadius:10,background:T.roseBg,
                      display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
                      {produto.foto
                        ? <img src={produto.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                        : <span style={{ fontSize:18 }}>💄</span>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14,fontWeight:700 }}>{produto.nome}</div>
                      <div style={{ fontSize:11,color:T.textMute,marginTop:1 }}>{produto.marca} · {"★".repeat(produto.rating || 0)}</div>
                    </div>
                  </button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {addProd  && <ProdutoModal onClose={() => setAddProd(false)}  onSave={(p) => { setProdutos((ps) => [...ps, { id: Date.now(), ...p }]); setAddProd(false); }}/>}
      {editProd && <ProdutoModal produto={editProd} onClose={() => setEditProd(null)}
        onSave={(p) => { setProdutos((ps) => ps.map((x) => x.id === editProd.id ? { ...x, ...p } : x)); setEditProd(null); }}
        onDelete={() => { setProdutos((ps) => ps.filter((x) => x.id !== editProd.id)); setEditProd(null); }}/>}
      {addMake  && <MakeModal produtos={produtos} onClose={() => setAddMake(false)}  onSave={(m) => { setMakes((ms) => [...ms, { id: Date.now(), ...m }]); setAddMake(false); }}/>}
      {editMake && <MakeModal produtos={produtos} make={editMake} onClose={() => setEditMake(null)}
        onSave={(m) => { setMakes((ms) => ms.map((x) => x.id === editMake.id ? { ...x, ...m } : x)); setEditMake(null); }}
        onDelete={() => { setMakes((ms) => ms.filter((x) => x.id !== editMake.id)); setEditMake(null); }}/>}
    </>
  );
}

/* ── ProdutoModal ─────────────────────────────────────────────────────── */
function ProdutoModal({ produto, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(produto || { nome:"",categoria:"Batom",marca:"",cor:"",rating:5,foto:null,favorito:false,notas:"" });
  const fileRef = useRef();
  const handleFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setForm((x) => ({ ...x, foto: await compressImage(f, 600, 0.85) }));
  };
  return (
    <Modal title={produto ? "Editar Produto" : "Novo Produto"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <button onClick={() => fileRef.current.click()} style={{
          width:80,height:80,alignSelf:"center",borderRadius:14,
          background:T.roseBg,border:`2px dashed ${form.foto ? T.rose : T.borderMd}`,
          display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
          {form.foto ? <img src={form.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:26 }}>📷</span>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>
        <Input label="Nome" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}/>
        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex:1 }}><Select label="Categoria" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} options={BEAUTY_CATEGORIAS}/></div>
          <div style={{ flex:1 }}><Input label="Marca" value={form.marca} onChange={(e) => setForm((f) => ({ ...f, marca: e.target.value }))}/></div>
        </div>
        <Input label="Cor / Tom" value={form.cor} onChange={(e) => setForm((f) => ({ ...f, cor: e.target.value }))}/>
        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>AVALIAÇÃO</div>
          <div style={{ display:"flex",gap:4 }}>
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setForm((f) => ({ ...f, rating: n }))}
                style={{ fontSize:24, opacity: n <= form.rating ? 1 : 0.3, color: T.sand }}>★</button>
            ))}
          </div>
        </div>
        <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",
          padding:"10px 12px",borderRadius:10,background:T.bgInput,border:`1px solid ${T.border}` }}>
          <input type="checkbox" checked={form.favorito} onChange={(e) => setForm((f) => ({ ...f, favorito: e.target.checked }))}/>
          <span style={{ fontSize:13,fontWeight:600 }}>❤️ Favorito</span>
        </label>
        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.rose}/>
      </div>
    </Modal>
  );
}

/* ── MakeModal ────────────────────────────────────────────────────────── */
function MakeModal({ make, produtos, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(make || {
    titulo:"",data: new Date().toLocaleDateString("pt-BR"),evento:"",
    foto:null,produtosIds:[],notas:"",rating:5,
  });
  const fileRef = useRef();
  const handleFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setForm((x) => ({ ...x, foto: await compressImage(f, 1024, 0.85) }));
  };
  const toggleProd = (id) => setForm((f) => ({
    ...f, produtosIds: f.produtosIds.includes(id) ? f.produtosIds.filter((x) => x !== id) : [...f.produtosIds, id],
  }));
  return (
    <Modal title={make ? "Editar Make" : "Nova Make"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <button onClick={() => fileRef.current.click()} style={{
          width:"100%",aspectRatio:"1",maxHeight:240,borderRadius:14,
          background:T.roseBg,border:`2px dashed ${form.foto ? T.rose : T.borderMd}`,
          display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
          {form.foto ? <img src={form.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (
            <div style={{ textAlign:"center",color:T.textMute }}><div style={{ fontSize:34 }}>📷</div><div style={{ fontSize:12,fontWeight:600,marginTop:6 }}>Foto da make</div></div>)}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>
        <Input label="Título" value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}/>
        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex:1 }}><Input label="Data" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}/></div>
          <div style={{ flex:1 }}><Input label="Evento" value={form.evento} onChange={(e) => setForm((f) => ({ ...f, evento: e.target.value }))}/></div>
        </div>
        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>AVALIAÇÃO</div>
          <div style={{ display:"flex",gap:4 }}>
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setForm((f) => ({ ...f, rating: n }))}
                style={{ fontSize:22, opacity: n <= form.rating ? 1 : 0.3, color: T.sand }}>★</button>
            ))}
          </div>
        </div>
        {produtos.length > 0 && (
          <div>
            <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>PRODUTOS USADOS</div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {produtos.map((p) => {
                const sel = form.produtosIds.includes(p.id);
                return <button key={p.id} onClick={() => toggleProd(p.id)} style={{
                  padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:700,
                  background: sel ? T.rose : T.bgInput, color: sel ? "#fff" : T.textSub,
                  border:`1px solid ${sel ? T.rose : T.border}` }}>{p.nome}</button>;
              })}
            </div>
          </div>
        )}
        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>OBSERVAÇÕES</div>
          <textarea value={form.notas} onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))} rows={2}
            style={{ width:"100%",padding:"10px 13px",borderRadius:10,
              border:`1px solid ${T.border}`,background:T.bgInput,fontSize:13,color:T.text,resize:"none" }}/>
        </div>
        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.rose}/>
      </div>
    </Modal>
  );
}

/* ════════════════════════════ SKINCARE ══════════════════════════════════ */
function SkincareSection({ skProdutos, setSkProdutos, skDiario, setSkDiario }) {
  const [subtab, setSubtab] = useState("produtos");
  return (
    <>
      <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14 }}>
        {[{id:"produtos",l:"🧴 Produtos"},{id:"diario",l:"📔 Diário"},{id:"evolucao",l:"📸 Evolução"}].map((t) => (
          <button key={t.id} onClick={() => setSubtab(t.id)} style={{
            flex:1,padding:"7px 4px",borderRadius:8,fontSize:11,fontWeight:700,
            background: subtab === t.id ? T.bgCard : "transparent",
            border:     subtab === t.id ? `1px solid ${T.border}` : "none",
            color:      subtab === t.id ? T.text : T.textMute }}>{t.l}</button>
        ))}
      </div>
      {subtab === "produtos"  && <SkincareProdutos produtos={skProdutos} setProdutos={setSkProdutos}/>}
      {subtab === "diario"    && <SkincareDiario   diario={skDiario}    setDiario={setSkDiario}/>}
      {subtab === "evolucao"  && <SkincareEvolucao diario={skDiario}    produtos={skProdutos}/>}
    </>
  );
}

function SkincareProdutos({ produtos, setProdutos }) {
  const [add,  setAdd]  = useState(false);
  const [edit, setEdit] = useState(null);
  const [filtro,setFiltro]=useState("Todos");
  const ativos      = produtos.filter((p) => !p.fim);
  const finalizados = produtos.filter((p) => p.fim);

  return (
    <>
      <Card style={{ padding:"12px 14px",marginBottom:12,background:T.roseBg,border:`1px solid ${T.rose}22` }}>
        <div style={{ fontSize:11,color:T.textMute,fontWeight:700 }}>EM USO</div>
        <div className="serif" style={{ fontSize:26,fontWeight:700,color:T.rose,marginTop:2,letterSpacing:-.3 }}>
          {ativos.length} produto{ativos.length !== 1 ? "s" : ""}
        </div>
      </Card>

      <div style={{ display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4 }}>
        {["Todos",...SKINCARE_CATEGORIAS].map((c) => (
          <button key={c} onClick={() => setFiltro(c)} style={{
            padding:"5px 11px",borderRadius:99,fontSize:11,fontWeight:700,
            background: filtro === c ? T.rose : T.bgCard,
            color:      filtro === c ? "#fff"  : T.textSub,
            border:`1px solid ${filtro === c ? T.rose : T.border}`,
            whiteSpace:"nowrap",flexShrink:0 }}>{c}</button>
        ))}
      </div>

      <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:6,letterSpacing:.3 }}>ATUALMENTE EM USO</div>
      {(() => {
        let f = ativos;
        if (filtro !== "Todos") f = ativos.filter((p) => p.categoria === filtro);
        return f.length === 0 ? (
          <Card style={{ padding:"16px",textAlign:"center" }}><div style={{ fontSize:12,color:T.textMute,fontStyle:"italic" }}>Nenhum produto aqui</div></Card>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:14 }}>
            {f.map((p) => {
              const dias = p.inicio ? daysSince(p.inicio) : null;
              return (
                <button key={p.id} onClick={() => setEdit({ ...p })} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                  borderRadius:12,background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"left" }}>
                  <div style={{ width:48,height:48,borderRadius:10,background:T.roseBg,
                    display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
                    {p.foto ? <img src={p.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:18 }}>🧴</span>}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:700 }}>{p.nome}</div>
                    <div style={{ fontSize:11,color:T.textMute,marginTop:1 }}>{p.marca} · {p.categoria}</div>
                    <div style={{ fontSize:10,color:T.rose,marginTop:2,fontWeight:600 }}>{p.frequencia}</div>
                  </div>
                  {dias !== null && dias >= 0 && <Pill label={`${dias}d`} color={T.rose} bg={T.roseBg}/>}
                </button>
              );
            })}
          </div>
        );
      })()}

      {finalizados.length > 0 && (
        <>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:6,letterSpacing:.3 }}>FINALIZADOS</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:14 }}>
            {finalizados.map((p) => (
              <button key={p.id} onClick={() => setEdit({ ...p })} style={{
                display:"flex",alignItems:"center",gap:12,padding:"10px 14px",
                borderRadius:12,background:T.bgInput,opacity:.7,textAlign:"left" }}>
                <div style={{ width:36,height:36,borderRadius:8,background:T.bgCard,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>🧴</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,textDecoration:"line-through" }}>{p.nome}</div>
                  <div style={{ fontSize:10,color:T.textMute }}>{p.inicio} → {p.fim}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <button onClick={() => setAdd(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,background:T.rose,color:"#fff",
        fontSize:14,fontWeight:700,boxShadow:"0 2px 12px rgba(176,122,122,.3)" }}>+ Novo Produto</button>

      {add  && <SkincareProdModal onClose={() => setAdd(false)}  onSave={(p) => { setProdutos((ps) => [...ps, { id: Date.now(), ...p }]); setAdd(false); }}/>}
      {edit && <SkincareProdModal produto={edit} onClose={() => setEdit(null)}
        onSave={(p) => { setProdutos((ps) => ps.map((x) => x.id === edit.id ? { ...x, ...p } : x)); setEdit(null); }}
        onDelete={() => { setProdutos((ps) => ps.filter((x) => x.id !== edit.id)); setEdit(null); }}/>}
    </>
  );
}

function SkincareProdModal({ produto, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(produto || {
    nome:"",marca:"",categoria:"Sérum",
    inicio: new Date().toLocaleDateString("pt-BR"),fim:"",frequencia:"Manhã e noite",foto:null,obs:"",
  });
  const fileRef = useRef();
  const handleFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setForm((x) => ({ ...x, foto: await compressImage(f, 600, 0.85) }));
  };
  return (
    <Modal title={produto ? "Editar Produto" : "Novo Produto"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <button onClick={() => fileRef.current.click()} style={{
          width:80,height:80,alignSelf:"center",borderRadius:14,background:T.roseBg,
          border:`2px dashed ${form.foto ? T.rose : T.borderMd}`,
          display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
          {form.foto ? <img src={form.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:26 }}>📷</span>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>
        <Input label="Nome" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} placeholder="Ex: Sérum Vitamina C"/>
        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex:1 }}><Input label="Marca" value={form.marca} onChange={(e) => setForm((f) => ({ ...f, marca: e.target.value }))}/></div>
          <div style={{ flex:1 }}><Select label="Categoria" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} options={SKINCARE_CATEGORIAS}/></div>
        </div>
        <Input label="Frequência" value={form.frequencia} onChange={(e) => setForm((f) => ({ ...f, frequencia: e.target.value }))} placeholder="Ex: 3x/semana à noite"/>
        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex:1 }}><Input label="Início" value={form.inicio} onChange={(e) => setForm((f) => ({ ...f, inicio: e.target.value }))} placeholder="dd/mm/aaaa"/></div>
          <div style={{ flex:1 }}><Input label="Término" value={form.fim} onChange={(e) => setForm((f) => ({ ...f, fim: e.target.value }))} placeholder="(em uso)"/></div>
        </div>
        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>OBSERVAÇÕES</div>
          <textarea value={form.obs} onChange={(e) => setForm((f) => ({ ...f, obs: e.target.value }))} rows={2}
            style={{ width:"100%",padding:"10px 13px",borderRadius:10,
              border:`1px solid ${T.border}`,background:T.bgInput,fontSize:13,color:T.text,resize:"none" }}/>
        </div>
        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.rose}/>
      </div>
    </Modal>
  );
}

function SkincareDiario({ diario, setDiario }) {
  const [add,  setAdd]  = useState(false);
  const [view, setView] = useState(null);
  return (
    <>
      <Card style={{ padding:"12px 14px",marginBottom:12,background:T.roseBg,border:`1px solid ${T.rose}22` }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <img src={COW_CAMELIA} alt="" style={{ width:40,height:40,objectFit:"contain" }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.text }}>Camélia sugere</div>
            <div style={{ fontSize:11,color:T.textSub,fontStyle:"italic",marginTop:1 }}>"Tire 3 fotos: frontal, perfil direito, perfil esquerdo"</div>
          </div>
        </div>
      </Card>

      {diario.length === 0 ? (
        <Card style={{ padding:"30px 20px",textAlign:"center" }}>
          <div style={{ fontSize:13,color:T.textMute,fontStyle:"italic" }}>Nenhum registro da pele ainda.<br/>Comece registrando hoje 📸</div>
        </Card>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
          {[...diario].reverse().map((d) => (
            <button key={d.id} onClick={() => setView({ ...d })} style={{
              borderRadius:12,overflow:"hidden",background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"left" }}>
              <div style={{ aspectRatio:"1",background:T.roseBg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                {d.fotoFrontal ? <img src={d.fotoFrontal} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:34 }}>👩</span>}
              </div>
              <div style={{ padding:"8px 10px" }}>
                <div style={{ fontSize:12,fontWeight:700 }}>{d.data}</div>
                {d.observacoes && <div style={{ fontSize:10,color:T.textMute,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.observacoes}</div>}
              </div>
            </button>
          ))}
        </div>
      )}

      <button onClick={() => setAdd(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,background:T.rose,color:"#fff",
        fontSize:14,fontWeight:700,boxShadow:"0 2px 12px rgba(176,122,122,.3)" }}>+ Novo Registro</button>

      {add  && <DiarioPeleModal onClose={() => setAdd(false)} onSave={(d) => { setDiario((ds) => [...ds, { id: Date.now(), ...d }]); setAdd(false); }}/>}
      {view && <DiarioPeleModal registro={view} onClose={() => setView(null)}
        onSave={(d) => { setDiario((ds) => ds.map((x) => x.id === view.id ? { ...x, ...d } : x)); setView(null); }}
        onDelete={() => { setDiario((ds) => ds.filter((x) => x.id !== view.id)); setView(null); }}/>}
    </>
  );
}

function DiarioPeleModal({ registro, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(registro || {
    data: new Date().toLocaleDateString("pt-BR"),
    fotoFrontal:null,fotoPerfilD:null,fotoPerfilE:null,
    oleosidade:3,ressecamento:3,sensibilidade:3,manchas:3,flacidez:3,observacoes:"",
  });
  const refF = useRef(); const refD = useRef(); const refE = useRef();
  const handle = async (e, key) => {
    const f = e.target.files[0]; if (!f) return;
    setForm((x) => ({ ...x, [key]: "" }));
    compressImage(f, 900, 0.85).then((data) => setForm((x) => ({ ...x, [key]: data })));
  };

  const FotoBox = ({ label, foto, onClick }) => (
    <div style={{ flex:1 }}>
      <button onClick={onClick} style={{ width:"100%",aspectRatio:"3/4",borderRadius:12,
        background:T.roseBg,border:`2px dashed ${foto ? T.rose : T.borderMd}`,
        display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
        {foto ? <img src={foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:22,color:T.textMute }}>📷</span>}
      </button>
      <div style={{ fontSize:10,color:T.textMute,fontWeight:600,textAlign:"center",marginTop:4 }}>{label}</div>
    </div>
  );

  const Slider = ({ label, value, onChange }) => (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:700,color:T.textSub,marginBottom:4 }}>
        <span>{label}</span><span style={{ color:T.rose }}>{value}/5</span>
      </div>
      <div style={{ display:"flex",gap:4 }}>
        {[1,2,3,4,5].map((n) => (
          <button key={n} onClick={() => onChange(n)} style={{ flex:1,height:28,borderRadius:6,
            background: n <= value ? T.rose : T.bgInput,transition:"background .12s" }}/>
        ))}
      </div>
    </div>
  );

  return (
    <Modal title={registro ? "Editar Registro" : "Novo Registro da Pele"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <Input label="Data" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}/>
        <div style={{ display:"flex",gap:8 }}>
          <FotoBox label="Frontal"  foto={form.fotoFrontal} onClick={() => refF.current.click()}/>
          <FotoBox label="Perfil D" foto={form.fotoPerfilD} onClick={() => refD.current.click()}/>
          <FotoBox label="Perfil E" foto={form.fotoPerfilE} onClick={() => refE.current.click()}/>
        </div>
        <input ref={refF} type="file" accept="image/*" style={{ display:"none" }} onChange={(e) => handle(e,"fotoFrontal")}/>
        <input ref={refD} type="file" accept="image/*" style={{ display:"none" }} onChange={(e) => handle(e,"fotoPerfilD")}/>
        <input ref={refE} type="file" accept="image/*" style={{ display:"none" }} onChange={(e) => handle(e,"fotoPerfilE")}/>
        <Slider label="Oleosidade"    value={form.oleosidade}    onChange={(v) => setForm((f) => ({ ...f, oleosidade: v }))}/>
        <Slider label="Ressecamento"  value={form.ressecamento}  onChange={(v) => setForm((f) => ({ ...f, ressecamento: v }))}/>
        <Slider label="Sensibilidade" value={form.sensibilidade} onChange={(v) => setForm((f) => ({ ...f, sensibilidade: v }))}/>
        <Slider label="Manchas"       value={form.manchas}       onChange={(v) => setForm((f) => ({ ...f, manchas: v }))}/>
        <Slider label="Flacidez"      value={form.flacidez}      onChange={(v) => setForm((f) => ({ ...f, flacidez: v }))}/>
        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>OBSERVAÇÕES</div>
          <textarea value={form.observacoes} onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))} rows={2}
            style={{ width:"100%",padding:"10px 13px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,fontSize:13,color:T.text,resize:"none" }}/>
        </div>
        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.rose}/>
      </div>
    </Modal>
  );
}

function SkincareEvolucao({ diario, produtos }) {
  const sorted = [...diario].sort((a, b) => {
    const da = new Date(a.data.split("/").reverse().join("-"));
    const db = new Date(b.data.split("/").reverse().join("-"));
    return (da && db) ? da - db : 0;
  });
  const primeiro = sorted[0];
  const ultimo   = sorted[sorted.length - 1];
  const dias     = primeiro && ultimo ? Math.round((new Date(ultimo.data.split("/").reverse().join("-")) - new Date(primeiro.data.split("/").reverse().join("-"))) / 86400000) : 0;

  return (
    <>
      <Card style={{ padding:"14px 16px",marginBottom:12,background:T.roseBg,border:`1px solid ${T.rose}22` }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
          <img src={COW_CAMELIA} alt="" style={{ width:36,height:36,objectFit:"contain" }}/>
          <div className="serif" style={{ fontSize:16,fontWeight:700,color:T.rose }}>Evolução</div>
        </div>
        <div style={{ fontSize:12,color:T.textSub,fontStyle:"italic" }}>
          {diario.length < 2
            ? "Registre mais fotos para ver a evolução"
            : `${diario.length} registros · ${dias} dias acompanhados`}
        </div>
      </Card>

      {diario.length >= 2 && primeiro && ultimo && (
        <Card style={{ padding:"14px 16px",marginBottom:12 }}>
          <div className="serif" style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>Antes & Depois</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {[{ data: primeiro.data, foto: primeiro.fotoFrontal, label: primeiro.data, cor: T.textMute },
              { data: ultimo.data,   foto: ultimo.fotoFrontal,   label: `${ultimo.data} ✨`, cor: T.rose }].map((x) => (
              <div key={x.data}>
                <div style={{ fontSize:10,color:x.cor,fontWeight:700,marginBottom:4 }}>{x.label}</div>
                <div style={{ aspectRatio:"3/4",borderRadius:10,overflow:"hidden",background:T.bgInput,
                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                  {x.foto ? <img src={x.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:30 }}>👩</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card style={{ padding:"14px 16px" }}>
        <div className="serif" style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>💡 Insights</div>
        {produtos.length === 0 ? (
          <div style={{ fontSize:12,color:T.textMute,fontStyle:"italic" }}>Adicione produtos para ver insights</div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {produtos.filter((p) => !p.fim).map((p) => {
              const d = daysSince(p.inicio);
              return d !== null ? (
                <div key={p.id} style={{ padding:"8px 10px",background:T.roseBg,borderRadius:8,fontSize:12,color:T.textSub }}>
                  <span style={{ fontWeight:700,color:T.rose }}>{p.nome}</span> em uso há <span style={{ fontWeight:700 }}>{d} dias</span>
                </div>
              ) : null;
            })}
            <div style={{ padding:"8px 10px",background:T.bgInput,borderRadius:8,fontSize:12,color:T.textSub }}>
              <span style={{ fontWeight:700 }}>{produtos.filter((p) => !p.fim).length}</span> produtos na rotina ativa
            </div>
            {diario.length > 0 && (
              <div style={{ padding:"8px 10px",background:T.bgInput,borderRadius:8,fontSize:12,color:T.textSub }}>
                <span style={{ fontWeight:700 }}>{diario.length}</span> registros fotográficos da pele
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
}
