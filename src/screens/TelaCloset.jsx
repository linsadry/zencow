import { useState, useRef } from "react";
import { T } from "../constants/theme.js";
import { Card, Pill, IconBtn, Modal, Input, Select, ModalActions, MascoteHeader } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { compressImage } from "../utils/image.js";
import { COW_LOLA } from "../constants/images.js";

const CLOSET_CATEGORIAS = ["Vestido","Camisa","Blusa","Calça","Saia","Sapato","Acessório","Casaco","Bolsa","Outro"];
const CLOSET_OCASIOES   = ["Trabalho","Casual","Congresso","Viagem","Evento","Plantão","Festa"];
const CLOSET_ESTACOES   = ["Verão","Outono","Inverno","Primavera","Todas"];

/* ── Root ─────────────────────────────────────────────────────────────── */
export default function TelaCloset({ pecas, setPecas, looks, setLooks, onMenu }) {
  const [tab,     setTab]     = useState("looks");
  const [addPeca, setAddPeca] = useState(false);
  const [addLook, setAddLook] = useState(false);
  const [editPeca,setEditPeca]= useState(null);
  const [editLook,setEditLook]= useState(null);
  const [filtro,  setFiltro]  = useState("Todos");

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <AppHeader title="Closet" onMenu={onMenu}/>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 16px 100px" }}>
        <MascoteHeader secao="closet" sub="Diário de estilo"/>

        {/* Sub-tabs */}
        <div style={{ display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14,overflowX:"auto" }}>
          {[
            { id:"looks",  l:`👗 Looks (${looks.length})`  },
            { id:"pecas",  l:`👚 Peças (${pecas.length})`  },
            { id:"stats",  l:"📊 Estatísticas"             },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:"1 0 auto",padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:700,
              background: tab === t.id ? T.bgCard : "transparent",
              border:     tab === t.id ? `1px solid ${T.border}` : "none",
              color:      tab === t.id ? T.text : T.textMute,whiteSpace:"nowrap" }}>{t.l}</button>
          ))}
        </div>

        {tab === "looks"  && (
          <LooksTab looks={looks} setLooks={setLooks} pecas={pecas} setPecas={setPecas}
            filtro={filtro} setFiltro={setFiltro}
            addLook={addLook} setAddLook={setAddLook}
            editLook={editLook} setEditLook={setEditLook}/>
        )}
        {tab === "pecas"  && (
          <PecasTab pecas={pecas} setPecas={setPecas}
            filtro={filtro} setFiltro={setFiltro}
            addPeca={addPeca} setAddPeca={setAddPeca}
            editPeca={editPeca} setEditPeca={setEditPeca}/>
        )}
        {tab === "stats"  && <ClosetStats pecas={pecas} looks={looks}/>}
      </div>
    </div>
  );
}

/* ── Looks Tab ─────────────────────────────────────────────────────────── */
function LooksTab({ looks, setLooks, pecas, setPecas, filtro, setFiltro, addLook, setAddLook, editLook, setEditLook }) {
  const filtered = (() => {
    if (filtro === "Favoritos") return looks.filter((l) => l.favorito);
    if (filtro !== "Todos")     return looks.filter((l) => l.ocasiao === filtro);
    return looks;
  })();

  return (
    <>
      <div style={{ display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4 }}>
        {["Todos","Favoritos",...CLOSET_OCASIOES].map((c) => (
          <button key={c} onClick={() => setFiltro(c)} style={{
            padding:"5px 11px",borderRadius:99,fontSize:11,fontWeight:700,
            background: filtro === c ? T.sand : T.bgCard,
            color:      filtro === c ? "#fff" : T.textSub,
            border:`1px solid ${filtro === c ? T.sand : T.border}`,
            whiteSpace:"nowrap",flexShrink:0 }}>{c}</button>
        ))}
      </div>

      {looks.length === 0 ? (
        <Card style={{ padding:"30px 20px",textAlign:"center" }}>
          <img src={COW_LOLA} alt="" style={{ width:80,height:80,objectFit:"contain",marginBottom:10 }}/>
          <div className="serif" style={{ fontSize:16,fontWeight:700,marginBottom:4 }}>"Vamos começar?"</div>
          <div style={{ fontSize:12,color:T.textMute,fontStyle:"italic" }}>— Lola</div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card style={{ padding:"24px",textAlign:"center" }}>
          <div style={{ fontSize:13,color:T.textMute }}>Nenhum look nesse filtro</div>
        </Card>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
          {filtered.map((l) => (
            <button key={l.id} onClick={() => setEditLook({ ...l })} style={{
              borderRadius:14,overflow:"hidden",background:T.bgCard,
              border:`1px solid ${T.border}`,textAlign:"left",position:"relative" }}>
              <div style={{ aspectRatio:"3/4",background:T.sandBg,
                display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                {l.foto
                  ? <img src={l.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                  : <span style={{ fontSize:36 }}>👗</span>}
              </div>
              <div style={{ padding:"8px 10px" }}>
                <div style={{ fontSize:12,fontWeight:700,color:T.text,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{l.titulo || "Sem título"}</div>
                <div style={{ fontSize:10,color:T.textMute,marginTop:2 }}>{l.ocasiao} · {l.data}</div>
              </div>
              {l.favorito && <div style={{ position:"absolute",top:6,right:6,fontSize:16 }}>❤️</div>}
            </button>
          ))}
        </div>
      )}

      <button onClick={() => setAddLook(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,
        background:T.sand,color:"#fff",fontSize:14,fontWeight:700,
        boxShadow:"0 2px 12px rgba(196,169,106,.3)" }}>+ Novo Look</button>

      {addLook && (
        <LookModal pecas={pecas} onClose={() => setAddLook(false)}
          onSave={(l) => {
            setLooks((ls) => [...ls, { id: Date.now(), ...l }]);
            if (l.pecasIds) setPecas((ps) => ps.map((p) =>
              l.pecasIds.includes(p.id) ? { ...p, usos: (p.usos || 0) + 1 } : p));
            setAddLook(false);
          }}/>
      )}
      {editLook && (
        <LookModal pecas={pecas} look={editLook} onClose={() => setEditLook(null)}
          onSave={(l) => { setLooks((ls) => ls.map((x) => x.id === editLook.id ? { ...x, ...l } : x)); setEditLook(null); }}
          onDelete={() => { setLooks((ls) => ls.filter((x) => x.id !== editLook.id)); setEditLook(null); }}/>
      )}
    </>
  );
}

/* ── Peças Tab ─────────────────────────────────────────────────────────── */
function PecasTab({ pecas, setPecas, filtro, setFiltro, addPeca, setAddPeca, editPeca, setEditPeca }) {
  const filtered = (() => {
    if (filtro === "Favoritos") return pecas.filter((p) => p.favorito);
    if (filtro !== "Todos")     return pecas.filter((p) => p.categoria === filtro);
    return pecas;
  })();

  return (
    <>
      <div style={{ display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4 }}>
        {["Todos","Favoritos",...CLOSET_CATEGORIAS].map((c) => (
          <button key={c} onClick={() => setFiltro(c)} style={{
            padding:"5px 11px",borderRadius:99,fontSize:11,fontWeight:700,
            background: filtro === c ? T.sand : T.bgCard,
            color:      filtro === c ? "#fff" : T.textSub,
            border:`1px solid ${filtro === c ? T.sand : T.border}`,
            whiteSpace:"nowrap",flexShrink:0 }}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card style={{ padding:"24px",textAlign:"center" }}>
          <div style={{ fontSize:13,color:T.textMute }}>Nenhuma peça aqui</div>
        </Card>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
          {filtered.map((p) => (
            <button key={p.id} onClick={() => setEditPeca({ ...p })} style={{
              borderRadius:12,overflow:"hidden",background:T.bgCard,
              border:`1px solid ${T.border}`,textAlign:"left",position:"relative" }}>
              <div style={{ aspectRatio:"1",background:T.sandBg,
                display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                {p.foto
                  ? <img src={p.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                  : <span style={{ fontSize:30 }}>👚</span>}
              </div>
              <div style={{ padding:"8px 10px" }}>
                <div style={{ fontSize:12,fontWeight:700,color:T.text,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.nome}</div>
                <div style={{ fontSize:10,color:T.textMute,marginTop:2 }}>{p.categoria} · {p.cor}</div>
              </div>
              {p.favorito && <div style={{ position:"absolute",top:6,right:6,fontSize:14 }}>❤️</div>}
            </button>
          ))}
        </div>
      )}

      <button onClick={() => setAddPeca(true)} style={{
        width:"100%",padding:"13px",borderRadius:12,
        background:T.sand,color:"#fff",fontSize:14,fontWeight:700,
        boxShadow:"0 2px 12px rgba(196,169,106,.3)" }}>+ Nova Peça</button>

      {addPeca && (
        <PecaModal onClose={() => setAddPeca(false)}
          onSave={(p) => { setPecas((ps) => [...ps, { id: Date.now(), ...p, usos: 0 }]); setAddPeca(false); }}/>
      )}
      {editPeca && (
        <PecaModal peca={editPeca} onClose={() => setEditPeca(null)}
          onSave={(p) => { setPecas((ps) => ps.map((x) => x.id === editPeca.id ? { ...x, ...p } : x)); setEditPeca(null); }}
          onDelete={() => { setPecas((ps) => ps.filter((x) => x.id !== editPeca.id)); setEditPeca(null); }}/>
      )}
    </>
  );
}

/* ── ClosetStats ───────────────────────────────────────────────────────── */
function ClosetStats({ pecas, looks }) {
  const top = [...pecas].sort((a, b) => (b.usos || 0) - (a.usos || 0)).slice(0, 5);
  const cores = {};
  looks.forEach((l) => (l.pecasIds || []).forEach((pid) => {
    const p = pecas.find((x) => x.id === pid);
    if (p?.cor) cores[p.cor] = (cores[p.cor] || 0) + 1;
  }));
  const topCores = Object.entries(cores).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const favLooks = looks.filter((l) => l.favorito);

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <Card style={{ padding:"14px 16px",background:T.sandBg,border:`1px solid ${T.sand}22` }}>
        <div style={{ fontSize:11,color:T.textMute,fontWeight:700 }}>RESUMO</div>
        <div style={{ display:"flex",gap:14,marginTop:8 }}>
          {[{ v:pecas.length,l:"peças"},{v:looks.length,l:"looks"},{v:favLooks.length,l:"favoritos"}].map((x) => (
            <div key={x.l}>
              <div className="serif" style={{ fontSize:24,fontWeight:700,color:T.sand }}>{x.v}</div>
              <div style={{ fontSize:10,color:T.textMute,fontWeight:600 }}>{x.l}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding:"14px 16px" }}>
        <div className="serif" style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>🏆 Peças mais usadas</div>
        {top.every((p) => !p.usos) ? (
          <div style={{ fontSize:12,color:T.textMute,fontStyle:"italic" }}>Registre looks para ver as peças mais usadas</div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {top.filter((p) => p.usos).map((p, i) => (
              <div key={p.id} style={{ display:"flex",alignItems:"center",gap:10,
                padding:"6px 8px",background:T.bgInput,borderRadius:8 }}>
                <span style={{ fontSize:11,fontWeight:800,color:T.sand,width:18 }}>#{i + 1}</span>
                <span style={{ flex:1,fontSize:13,fontWeight:600 }}>{p.nome}</span>
                <Pill label={`${p.usos}x`} color={T.sand} bg={T.sandBg}/>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card style={{ padding:"14px 16px" }}>
        <div className="serif" style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>🎨 Cores mais utilizadas</div>
        {topCores.length === 0 ? (
          <div style={{ fontSize:12,color:T.textMute,fontStyle:"italic" }}>Crie looks para ver as cores mais usadas</div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {topCores.map(([c, n]) => (
              <div key={c} style={{ display:"flex",alignItems:"center",gap:10,
                padding:"6px 8px",background:T.bgInput,borderRadius:8 }}>
                <span style={{ flex:1,fontSize:13,fontWeight:600 }}>{c}</span>
                <Pill label={`${n}x`} color={T.sand} bg={T.sandBg}/>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── PecaModal ─────────────────────────────────────────────────────────── */
function PecaModal({ peca, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(peca || {
    nome:"",categoria:"Vestido",cor:"",ocasiao:"Casual",estacao:"Todas",foto:null,favorito:false,
  });
  const fileRef = useRef();
  const handleFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setForm((x) => ({ ...x, foto: await compressImage(f, 800, 0.85) }));
  };

  return (
    <Modal title={peca ? "Editar Peça" : "Nova Peça"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <button onClick={() => fileRef.current.click()} style={{
          width:"100%",aspectRatio:"1",maxHeight:200,borderRadius:14,
          background:T.sandBg,border:`2px dashed ${form.foto ? T.sand : T.borderMd}`,
          display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
          {form.foto
            ? <img src={form.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            : <div style={{ textAlign:"center",color:T.textMute }}>
                <div style={{ fontSize:32 }}>📷</div>
                <div style={{ fontSize:12,fontWeight:600,marginTop:6 }}>Toque para foto</div>
              </div>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>

        <Input label="Nome" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}/>

        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex:1 }}>
            <Select label="Categoria" value={form.categoria}
              onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
              options={CLOSET_CATEGORIAS}/>
          </div>
          <div style={{ flex:1 }}>
            <Input label="Cor" value={form.cor} onChange={(e) => setForm((f) => ({ ...f, cor: e.target.value }))}/>
          </div>
        </div>

        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex:1 }}>
            <Select label="Ocasião" value={form.ocasiao}
              onChange={(e) => setForm((f) => ({ ...f, ocasiao: e.target.value }))}
              options={CLOSET_OCASIOES}/>
          </div>
          <div style={{ flex:1 }}>
            <Select label="Estação" value={form.estacao}
              onChange={(e) => setForm((f) => ({ ...f, estacao: e.target.value }))}
              options={CLOSET_ESTACOES}/>
          </div>
        </div>

        <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",
          padding:"10px 12px",borderRadius:10,background:T.bgInput,border:`1px solid ${T.border}` }}>
          <input type="checkbox" checked={form.favorito}
            onChange={(e) => setForm((f) => ({ ...f, favorito: e.target.checked }))}/>
          <span style={{ fontSize:13,fontWeight:600 }}>❤️ Favorita</span>
        </label>

        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.sand}/>
      </div>
    </Modal>
  );
}

/* ── LookModal ─────────────────────────────────────────────────────────── */
function LookModal({ look, pecas, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(look || {
    titulo:"",ocasiao:"Trabalho",local:"",
    data: new Date().toLocaleDateString("pt-BR"),
    foto:null,pecasIds:[],notas:"",favorito:false,
  });
  const fileRef = useRef();
  const handleFoto = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    setForm((x) => ({ ...x, foto: await compressImage(f, 1024, 0.85) }));
  };
  const togglePeca = (id) => setForm((f) => ({
    ...f, pecasIds: f.pecasIds.includes(id) ? f.pecasIds.filter((x) => x !== id) : [...f.pecasIds, id],
  }));

  return (
    <Modal title={look ? "Editar Look" : "Novo Look"} onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <button onClick={() => fileRef.current.click()} style={{
          width:"100%",aspectRatio:"3/4",maxHeight:260,borderRadius:14,
          background:T.sandBg,border:`2px dashed ${form.foto ? T.sand : T.borderMd}`,
          display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
          {form.foto
            ? <img src={form.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            : <div style={{ textAlign:"center",color:T.textMute }}>
                <div style={{ fontSize:34 }}>📷</div>
                <div style={{ fontSize:12,fontWeight:600,marginTop:6 }}>Foto do look</div>
              </div>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto}/>

        <Input label="Título" value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}/>

        <div style={{ display:"flex",gap:10 }}>
          <div style={{ flex:1 }}>
            <Select label="Ocasião" value={form.ocasiao}
              onChange={(e) => setForm((f) => ({ ...f, ocasiao: e.target.value }))}
              options={CLOSET_OCASIOES}/>
          </div>
          <div style={{ flex:1 }}>
            <Input label="Data" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}/>
          </div>
        </div>

        <Input label="Local (opcional)" value={form.local}
          onChange={(e) => setForm((f) => ({ ...f, local: e.target.value }))}/>

        {pecas.length > 0 && (
          <div>
            <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>PEÇAS USADAS</div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {pecas.map((p) => {
                const sel = form.pecasIds.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePeca(p.id)} style={{
                    padding:"5px 10px",borderRadius:99,fontSize:11,fontWeight:700,
                    background: sel ? T.sand : T.bgInput,
                    color:      sel ? "#fff"  : T.textSub,
                    border:`1px solid ${sel ? T.sand : T.border}` }}>{p.nome}</button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>NOTAS</div>
          <textarea value={form.notas} onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))} rows={2}
            placeholder="Como você se sentiu..."
            style={{ width:"100%",padding:"10px 13px",borderRadius:10,
              border:`1px solid ${T.border}`,background:T.bgInput,fontSize:13,color:T.text,resize:"none" }}/>
        </div>

        <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",
          padding:"10px 12px",borderRadius:10,background:T.bgInput,border:`1px solid ${T.border}` }}>
          <input type="checkbox" checked={form.favorito}
            onChange={(e) => setForm((f) => ({ ...f, favorito: e.target.checked }))}/>
          <span style={{ fontSize:13,fontWeight:600 }}>❤️ Favorito</span>
        </label>

        <ModalActions onCancel={onClose} onSave={() => onSave(form)} onDelete={onDelete} color={T.sand}/>
      </div>
    </Modal>
  );
}
