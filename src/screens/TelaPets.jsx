import { useState, useRef, useMemo } from "react";
import { T } from "../constants/theme.js";
import { Card, Pill, IconBtn, Modal, MascoteHeader, Input, Select, ModalActions } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { compressImage } from "../utils/image.js";
import { parseDate, daysSince, formatDays } from "../utils/dates.js";
import { getPetAlerts, getAllPetAlerts } from "../utils/pets.js";
import imgMargarida from "../assets/cow-margarida.png";

const now = new Date();

/* ── PetHistorico ─────────────────────────────────────────────── */
function PetHistorico({ pet }) {
  const eventos = [];
  pet.vacinas.forEach(v => eventos.push({tipo:"💉 Vacina", titulo:v.nome, data:v.data}));
  pet.vermifugos.forEach(v => eventos.push({tipo:"💊 Vermífugo", titulo:v.produto, data:v.data}));
  pet.antipulgas.forEach(v => eventos.push({tipo:"🐛 Antipulga", titulo:v.produto, data:v.data}));
  pet.consultas.forEach(v => eventos.push({tipo:"🏥 Consulta", titulo:v.motivo||"Consulta", data:v.data}));
  pet.exames.forEach(v => eventos.push({tipo:"🔬 Exame", titulo:v.tipo, data:v.data}));
  (pet.cirurgias||[]).forEach(v => eventos.push({tipo:"✂️ Cirurgia", titulo:v.tipo, data:v.data}));
  pet.banhos.forEach(v => eventos.push({tipo:"🛁 Banho", titulo:"Banho", data:v.data}));

  const sorted = eventos.sort((a, b) => {
    const da = parseDate(a.data); const db = parseDate(b.data);
    if (!da || !db) return 0; return db - da;
  });

  if (sorted.length === 0) {
    return (
      <Card style={{padding:"24px",textAlign:"center"}}>
        <div style={{fontSize:13,color:T.textMute,fontStyle:"italic"}}>Nenhum evento registrado ainda.</div>
      </Card>
    );
  }
  return (
    <Card style={{padding:"14px 16px"}}>
      <div className="serif" style={{fontSize:15,fontWeight:700,marginBottom:14}}>📋 Linha do tempo</div>
      <div style={{position:"relative",paddingLeft:18}}>
        <div style={{position:"absolute",left:5,top:5,bottom:5,width:2,background:T.border}}/>
        {sorted.map((ev, i) => (
          <div key={i} style={{position:"relative",marginBottom:14}}>
            <div style={{position:"absolute",left:-18,top:4,width:12,height:12,borderRadius:"50%",
              background:T.blue,border:`2px solid ${T.bgCard}`}}/>
            <div style={{fontSize:11,color:T.textMute,fontWeight:600}}>{ev.data}</div>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginTop:1}}>
              {ev.tipo}: {ev.titulo}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── PetGastos ────────────────────────────────────────────────── */
function PetGastos({ pet, update }) {
  const [add, setAdd] = useState(false);
  const [form, setForm] = useState({categoria:"Veterinário",valor:"",data:"",descricao:""});
  const cats = ["Veterinário","Ração","Medicamentos","Banho e tosa","Acessórios","Outros"];

  const adicionar = () => {
    if (!form.valor) return;
    update({gastos:[...(pet.gastos||[]), {id:Date.now(),...form,valor:parseFloat(form.valor)||0}]});
    setForm({categoria:"Veterinário",valor:"",data:"",descricao:""});
    setAdd(false);
  };
  const remover = id => update({gastos:pet.gastos.filter(g=>g.id!==id)});
  const total = (pet.gastos||[]).reduce((s,g) => s+(g.valor||0), 0);
  const porCat = {};
  (pet.gastos||[]).forEach(g => { porCat[g.categoria]=(porCat[g.categoria]||0)+(g.valor||0); });

  return (
    <>
      <Card style={{padding:"14px 16px",marginBottom:12,background:T.blueBg,border:`1px solid ${T.blue}22`}}>
        <div style={{fontSize:11,color:T.textMute,fontWeight:700,letterSpacing:.3}}>TOTAL GASTO</div>
        <div className="serif" style={{fontSize:28,fontWeight:700,color:T.blue,marginTop:2,letterSpacing:-.4}}>
          R$ {total.toFixed(2).replace(".",",")}
        </div>
        {Object.keys(porCat).length > 0 && (
          <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:10}}>
            {Object.entries(porCat).map(([c,v]) => (
              <div key={c} style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                <span style={{color:T.textSub}}>{c}</span>
                <span style={{fontWeight:700,color:T.text}}>R$ {v.toFixed(2).replace(".",",")}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span className="serif" style={{fontSize:15,fontWeight:700}}>💰 Histórico</span>
          <button onClick={() => setAdd(true)} style={{
            fontSize:11,fontWeight:700,color:T.blue,padding:"4px 10px",borderRadius:99,
            background:T.blueBg,border:`1px solid ${T.blue}33`}}>+ Gasto</button>
        </div>
        {(!pet.gastos||pet.gastos.length===0) ? (
          <div style={{fontSize:12,color:T.textMute,padding:"6px 0",fontStyle:"italic"}}>Nenhum gasto registrado.</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[...pet.gastos].reverse().map(g => (
              <div key={g.id} style={{padding:"8px 10px",borderRadius:8,background:T.bgInput,
                display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700}}>{g.categoria}</div>
                  <div style={{fontSize:11,color:T.textMute,marginTop:1}}>{g.data}{g.descricao&&` · ${g.descricao}`}</div>
                </div>
                <div style={{fontSize:13,fontWeight:800,color:T.blue}}>R$ {(g.valor||0).toFixed(2).replace(".",",")}</div>
                <IconBtn icon="🗑️" onClick={() => remover(g.id)} size={13}/>
              </div>
            ))}
          </div>
        )}
      </Card>
      {add && (
        <Modal title="Novo Gasto" onClose={() => setAdd(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Select label="Categoria" value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} options={cats}/>
            <Input label="Valor" type="number" value={form.valor} onChange={e=>setForm(f=>({...f,valor:e.target.value}))} placeholder="0,00"/>
            <Input label="Data" value={form.data} onChange={e=>setForm(f=>({...f,data:e.target.value}))} placeholder="dd/mm/aaaa"/>
            <Input label="Descrição" value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))}/>
            <ModalActions onCancel={() => setAdd(false)} onSave={adicionar} color={T.blue}/>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ── PetGaleria ───────────────────────────────────────────────── */
function PetGaleria({ pet, update }) {
  const fileRef = useRef();
  const [view, setView] = useState(null);
  const handleFoto = async e => {
    const f = e.target.files[0]; if (!f) return;
    const data = await compressImage(f, 1024, 0.85);
    update({galeria:[...(pet.galeria||[]), {id:Date.now(),foto:data,data:now.toLocaleDateString("pt-BR")}]});
  };
  const remover = id => update({galeria:pet.galeria.filter(g=>g.id!==id)});

  return (
    <>
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span className="serif" style={{fontSize:15,fontWeight:700}}>📷 Álbum de {pet.nome}</span>
          <button onClick={() => fileRef.current.click()} style={{
            fontSize:11,fontWeight:700,color:T.blue,padding:"4px 10px",borderRadius:99,
            background:T.blueBg,border:`1px solid ${T.blue}33`}}>+ Foto</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFoto}/>
        {(!pet.galeria||pet.galeria.length===0) ? (
          <div style={{textAlign:"center",padding:"24px 0",fontSize:13,color:T.textMute,fontStyle:"italic"}}>
            Adicione fotos para criar o álbum do {pet.nome}
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            {pet.galeria.map(g => (
              <button key={g.id} onClick={() => setView(g)} style={{
                aspectRatio:"1",borderRadius:8,overflow:"hidden",
                border:`1px solid ${T.border}`,padding:0,background:"none"}}>
                <img src={g.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </button>
            ))}
          </div>
        )}
      </Card>
      {view && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:700,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={() => setView(null)}>
          <img src={view.foto} alt="" style={{maxWidth:"100%",maxHeight:"70%",borderRadius:14}}/>
          <div style={{color:"#fff",marginTop:14,fontSize:13}}>{view.data}</div>
          <button onClick={e=>{e.stopPropagation();remover(view.id);setView(null);}} style={{
            marginTop:18,padding:"8px 18px",borderRadius:99,
            background:T.dangerBg,color:T.danger,fontSize:13,fontWeight:700}}>🗑️ Remover</button>
        </div>
      )}
    </>
  );
}

/* ── PetRotina ────────────────────────────────────────────────── */
function PetRotina({ pet, update }) {
  const [addBanho, setAddBanho] = useState(false);
  const [data, setData] = useState("");
  const adicionarBanho = () => {
    if (!data.trim()) return;
    update({banhos:[...pet.banhos, {id:Date.now(),data:data.trim()}]});
    setData(""); setAddBanho(false);
  };
  const deletar = id => update({banhos:pet.banhos.filter(b=>b.id!==id)});
  const ultimoBanho = pet.banhos[pet.banhos.length-1];
  const diasDesde = ultimoBanho ? daysSince(ultimoBanho.data) : null;

  return (
    <>
      <Card style={{padding:"14px 16px",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span className="serif" style={{fontSize:15,fontWeight:700}}>🛁 Banhos</span>
          <button onClick={() => setAddBanho(true)} style={{
            fontSize:11,fontWeight:700,color:T.blue,padding:"4px 10px",borderRadius:99,
            background:T.blueBg,border:`1px solid ${T.blue}33`}}>+ Registrar</button>
        </div>
        {ultimoBanho ? (
          <>
            <div style={{padding:"10px 12px",background:T.blueBg,borderRadius:10,marginBottom:8}}>
              <div style={{fontSize:11,color:T.textMute,fontWeight:700,letterSpacing:.3}}>ÚLTIMO BANHO</div>
              <div className="serif" style={{fontSize:17,fontWeight:700,color:T.blue,marginTop:2}}>
                {diasDesde===0?"Hoje":diasDesde===1?"Ontem":`${diasDesde} dias atrás`}
              </div>
              <div style={{fontSize:12,color:T.textSub,marginTop:1}}>{ultimoBanho.data}</div>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:T.textMute,marginBottom:6}}>HISTÓRICO</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {[...pet.banhos].reverse().map(b => (
                <div key={b.id} style={{display:"flex",alignItems:"center",gap:8,
                  padding:"6px 10px",background:T.bgInput,borderRadius:8}}>
                  <span style={{fontSize:12,color:T.text,flex:1}}>{b.data}</span>
                  <IconBtn icon="🗑️" onClick={() => deletar(b.id)} size={13}/>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{fontSize:12,color:T.textMute,padding:"6px 0",fontStyle:"italic"}}>Nenhum banho registrado.</div>
        )}
      </Card>
      {addBanho && (
        <Modal title="Registrar Banho" onClose={() => setAddBanho(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input label="Data" value={data} onChange={e=>setData(e.target.value)} placeholder="dd/mm/aaaa"/>
            <ModalActions onCancel={() => setAddBanho(false)} onSave={adicionarBanho} color={T.blue}/>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ── SaudeEditModal ───────────────────────────────────────────── */
function SaudeEditModal({ type, item, pet, update, onClose }) {
  const defaults = {
    vacina:{nome:"",data:"",proxima:"",lote:""},
    vermifugo:{produto:"",data:"",proxima:""},
    antipulga:{produto:"",data:"",proxima:""},
    consulta:{data:"",motivo:"",vet:"",observacoes:""},
    exame:{tipo:"",data:"",resultado:""},
    cirurgia:{tipo:"",data:"",observacoes:""},
    medicamento:{nome:"",dose:"",frequencia:""},
  };
  const titles = {vacina:"Vacina",vermifugo:"Vermífugo",antipulga:"Antipulga",
    consulta:"Consulta",exame:"Exame",cirurgia:"Cirurgia",medicamento:"Medicamento"};
  const fields = {
    vacina:[{k:"nome",l:"Nome"},{k:"data",l:"Data aplicada",p:"dd/mm/aaaa"},{k:"proxima",l:"Próxima",p:"dd/mm/aaaa"},{k:"lote",l:"Lote (opcional)"}],
    vermifugo:[{k:"produto",l:"Produto"},{k:"data",l:"Data",p:"dd/mm/aaaa"},{k:"proxima",l:"Próxima",p:"dd/mm/aaaa"}],
    antipulga:[{k:"produto",l:"Produto"},{k:"data",l:"Data",p:"dd/mm/aaaa"},{k:"proxima",l:"Próxima",p:"dd/mm/aaaa"}],
    consulta:[{k:"data",l:"Data",p:"dd/mm/aaaa"},{k:"motivo",l:"Motivo"},{k:"vet",l:"Veterinário"},{k:"observacoes",l:"Observações"}],
    exame:[{k:"tipo",l:"Tipo de exame"},{k:"data",l:"Data",p:"dd/mm/aaaa"},{k:"resultado",l:"Resultado"}],
    cirurgia:[{k:"tipo",l:"Tipo de cirurgia"},{k:"data",l:"Data",p:"dd/mm/aaaa"},{k:"observacoes",l:"Observações"}],
    medicamento:[{k:"nome",l:"Nome"},{k:"dose",l:"Dose"},{k:"frequencia",l:"Frequência"}],
  };
  const fieldKey = {vacina:"vacinas",vermifugo:"vermifugos",antipulga:"antipulgas",
    consulta:"consultas",exame:"exames",cirurgia:"cirurgias",medicamento:"medicamentos"};

  const [form, setForm] = useState(item || defaults[type]);
  const salvar = () => {
    const k = fieldKey[type];
    const list = pet[k] || [];
    if (item) { update({[k]:list.map(x => x.id===item.id ? {...x,...form} : x)}); }
    else      { update({[k]:[...list, {...form,id:Date.now()}]}); }
    onClose();
  };

  return (
    <Modal title={`${item?"Editar":"Novo"} ${titles[type]}`} onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {fields[type].map(f => (
          <Input key={f.k} label={f.l} value={form[f.k]||""}
            onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
            placeholder={f.p}/>
        ))}
        <ModalActions onCancel={onClose} onSave={salvar} color={T.blue} saveLabel={item?"Salvar":"Adicionar"}/>
      </div>
    </Modal>
  );
}

/* ── SaudeSection ─────────────────────────────────────────────── */
function SaudeSection({ title, items, render, onAdd, onEdit, onDelete }) {
  return (
    <Card style={{padding:"14px 16px",marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:items.length?10:0}}>
        <span className="serif" style={{fontSize:15,fontWeight:700,color:T.text}}>{title}</span>
        <button onClick={onAdd} style={{
          fontSize:11,fontWeight:700,color:T.blue,padding:"4px 10px",borderRadius:99,
          background:T.blueBg,border:`1px solid ${T.blue}33`}}>+ Adicionar</button>
      </div>
      {items.length === 0 ? (
        <div style={{fontSize:12,color:T.textMute,padding:"6px 0",fontStyle:"italic"}}>Nada registrado ainda.</div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {items.map(item => {
            const r = render(item);
            return (
              <div key={item.id} style={{padding:"8px 10px",borderRadius:8,background:T.bgInput,
                display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>{r.primary}</div>
                  <div style={{fontSize:11,color:T.textMute,marginTop:1}}>{r.secondary}</div>
                  {r.next && <div style={{fontSize:11,color:T.blue,marginTop:1,fontWeight:600}}>{r.next}</div>}
                </div>
                <IconBtn icon="✏️" onClick={() => onEdit(item)}/>
                <IconBtn icon="🗑️" onClick={() => onDelete(item.id)}/>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ── PetSaude ─────────────────────────────────────────────────── */
function PetSaude({ pet, update }) {
  const [editType, setEditType] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const openAdd  = type => { setEditItem(null); setEditType(type); };
  const openEdit = (type, item) => { setEditItem(item); setEditType(type); };

  return (
    <>
      <SaudeSection title="💉 Vacinas" items={pet.vacinas}
        onAdd={() => openAdd("vacina")}
        onEdit={i => openEdit("vacina",i)}
        onDelete={id => update({vacinas:pet.vacinas.filter(v=>v.id!==id)})}
        render={v => ({primary:v.nome, secondary:`Aplicada: ${v.data}`, next:`Próxima: ${v.proxima}`})}/>
      <SaudeSection title="💊 Vermífugo" items={pet.vermifugos}
        onAdd={() => openAdd("vermifugo")}
        onEdit={i => openEdit("vermifugo",i)}
        onDelete={id => update({vermifugos:pet.vermifugos.filter(v=>v.id!==id)})}
        render={v => ({primary:v.produto, secondary:`Aplicado: ${v.data}`, next:`Próximo: ${v.proxima}`})}/>
      <SaudeSection title="🐛 Antipulgas" items={pet.antipulgas}
        onAdd={() => openAdd("antipulga")}
        onEdit={i => openEdit("antipulga",i)}
        onDelete={id => update({antipulgas:pet.antipulgas.filter(v=>v.id!==id)})}
        render={v => ({primary:v.produto, secondary:`Aplicado: ${v.data}`, next:`Próximo: ${v.proxima}`})}/>
      <SaudeSection title="🏥 Consultas" items={pet.consultas}
        onAdd={() => openAdd("consulta")}
        onEdit={i => openEdit("consulta",i)}
        onDelete={id => update({consultas:pet.consultas.filter(v=>v.id!==id)})}
        render={v => ({primary:v.motivo||"Consulta", secondary:`${v.data} · ${v.vet||"—"}`, next:v.observacoes})}/>
      <SaudeSection title="🔬 Exames" items={pet.exames}
        onAdd={() => openAdd("exame")}
        onEdit={i => openEdit("exame",i)}
        onDelete={id => update({exames:pet.exames.filter(v=>v.id!==id)})}
        render={v => ({primary:v.tipo, secondary:v.data, next:v.resultado})}/>
      <SaudeSection title="✂️ Cirurgias" items={pet.cirurgias||[]}
        onAdd={() => openAdd("cirurgia")}
        onEdit={i => openEdit("cirurgia",i)}
        onDelete={id => update({cirurgias:(pet.cirurgias||[]).filter(v=>v.id!==id)})}
        render={v => ({primary:v.tipo, secondary:v.data, next:v.observacoes})}/>
      <SaudeSection title="💊 Medicamentos" items={pet.medicamentos}
        onAdd={() => openAdd("medicamento")}
        onEdit={i => openEdit("medicamento",i)}
        onDelete={id => update({medicamentos:pet.medicamentos.filter(v=>v.id!==id)})}
        render={v => ({primary:v.nome, secondary:v.dose, next:v.frequencia})}/>
      {editType && <SaudeEditModal type={editType} item={editItem} pet={pet} update={update}
        onClose={() => {setEditType(null);setEditItem(null);}}/>}
    </>
  );
}

/* ── PetEditInfo ──────────────────────────────────────────────── */
function PetEditInfo({ pet, onSave, onClose }) {
  const [form, setForm] = useState({
    nome:pet.nome, raca:pet.raca, sexo:pet.sexo,
    peso:pet.peso||"", obs:pet.obs||"", nascimento:pet.nascimento||"",
  });
  return (
    <Modal title="Editar Informações" onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Input label="Nome" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))}/>
        <Input label="Raça" value={form.raca} onChange={e=>setForm(f=>({...f,raca:e.target.value}))}/>
        <Select label="Sexo" value={form.sexo} onChange={e=>setForm(f=>({...f,sexo:e.target.value}))}
          options={[{v:"M",l:"Macho"},{v:"F",l:"Fêmea"}]}/>
        <Input label="Peso" value={form.peso} onChange={e=>setForm(f=>({...f,peso:e.target.value}))} placeholder="Ex: 28 kg"/>
        <Input label="Nascimento" value={form.nascimento} onChange={e=>setForm(f=>({...f,nascimento:e.target.value}))} placeholder="dd/mm/aaaa"/>
        <div>
          <div style={{fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3}}>OBSERVAÇÕES</div>
          <textarea value={form.obs} onChange={e=>setForm(f=>({...f,obs:e.target.value}))} rows={3}
            style={{width:"100%",padding:"10px 13px",borderRadius:10,
              border:`1px solid ${T.border}`,background:T.bgInput,fontSize:13,color:T.text,resize:"none"}}/>
        </div>
        <ModalActions onCancel={onClose} onSave={() => onSave(form)} color={T.blue}/>
      </div>
    </Modal>
  );
}

/* ── PetDetail ────────────────────────────────────────────────── */
function PetDetail({ pet, setPets, onBack }) {
  const [tab, setTab] = useState("saude");
  const [editInfo, setEditInfo] = useState(false);
  const fotoRef = useRef();
  const update = patch => setPets(ps => ps.map(p => p.id===pet.id ? {...p,...patch} : p));
  const handleFoto = async e => {
    const f = e.target.files[0]; if (!f) return;
    const data = await compressImage(f, 800, 0.85);
    update({foto:data});
  };
  const deletePet = () => {
    if (window.confirm(`Remover ${pet.nome}? Esta ação é permanente.`)) {
      setPets(ps => ps.filter(p => p.id !== pet.id));
      onBack();
    }
  };
  const alertas = getPetAlerts(pet);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <AppHeader title={pet.nome} onBack={onBack}
        rightAction={
          <button onClick={deletePet} style={{width:34,height:34,borderRadius:10,
            background:T.bgCard,border:`1px solid ${T.border}`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🗑️</button>
        }/>
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px 100px"}}>

        <Card style={{padding:"18px 16px",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <button onClick={() => fotoRef.current.click()} style={{
              width:84,height:84,borderRadius:24,background:T.blueBg,
              display:"flex",alignItems:"center",justifyContent:"center",
              flexShrink:0,overflow:"hidden",position:"relative",
              border:`2px solid ${T.blue}33`}}>
              {pet.foto
                ? <img src={pet.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : <span style={{fontSize:38}}>🐾</span>}
              <div style={{position:"absolute",bottom:3,right:3,width:22,height:22,
                borderRadius:"50%",background:T.blue,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,color:"#fff",border:`2px solid ${T.bgCard}`}}>📷</div>
            </button>
            <input ref={fotoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFoto}/>
            <div style={{flex:1,minWidth:0}}>
              <div className="serif" style={{fontSize:22,fontWeight:700,color:T.text,letterSpacing:-.3}}>{pet.nome}</div>
              <div style={{fontSize:13,color:T.textSub,marginTop:2}}>
                {pet.raca} · {pet.sexo==="M"?"Macho":"Fêmea"}
              </div>
              {pet.peso && <div style={{fontSize:12,color:T.textMute,marginTop:1}}>{pet.peso}</div>}
              <button onClick={() => setEditInfo(true)} style={{
                fontSize:11,fontWeight:700,color:T.blue,marginTop:8,
                padding:"3px 10px",borderRadius:99,
                background:T.blueBg,border:`1px solid ${T.blue}33`}}>
                ✏️ Editar
              </button>
            </div>
          </div>
          {pet.obs && (
            <div style={{padding:"10px 12px",background:T.bgInput,borderRadius:10,
              fontSize:12,color:T.textSub,fontStyle:"italic"}}>
              "{pet.obs}"
            </div>
          )}
        </Card>

        {alertas.length > 0 && (
          <Card style={{padding:"12px 14px",marginBottom:14,
            background:alertas[0].nivel==="danger"?T.dangerBg:T.alertBg,
            border:`1px solid ${alertas[0].nivel==="danger"?T.danger:T.alert}33`}}>
            <div style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
              <img src={imgMargarida} alt="" style={{width:24,height:24,objectFit:"contain"}}/>
              Atenção
            </div>
            {alertas.map((a, i) => {
              const cor = a.nivel==="danger" ? T.danger : T.alert;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,
                  padding:"5px 0",borderTop:i>0?`1px solid ${cor}22`:"none"}}>
                  <span style={{fontSize:12,fontWeight:700,color:T.text,flex:1}}>{a.tipo}: {a.nome}</span>
                  <Pill label={formatDays(a.dias)} color={cor} bg="#fff"/>
                </div>
              );
            })}
          </Card>
        )}

        <div style={{display:"flex",background:T.bgInput,borderRadius:11,padding:3,gap:3,marginBottom:14,overflowX:"auto"}}>
          {[
            {id:"saude",    l:"💉 Saúde"},
            {id:"rotina",   l:"🛁 Rotina"},
            {id:"galeria",  l:"📷 Galeria"},
            {id:"gastos",   l:"💰 Gastos"},
            {id:"historico",l:"📋 Histórico"},
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:"1 0 auto",padding:"7px 12px",borderRadius:8,fontSize:11,fontWeight:700,
              background:tab===t.id?T.bgCard:"transparent",
              border:tab===t.id?`1px solid ${T.border}`:"none",
              color:tab===t.id?T.text:T.textMute,whiteSpace:"nowrap"}}>{t.l}</button>
          ))}
        </div>

        {tab==="saude"    && <PetSaude    pet={pet} update={update}/>}
        {tab==="rotina"   && <PetRotina   pet={pet} update={update}/>}
        {tab==="galeria"  && <PetGaleria  pet={pet} update={update}/>}
        {tab==="gastos"   && <PetGastos   pet={pet} update={update}/>}
        {tab==="historico"&& <PetHistorico pet={pet}/>}
      </div>

      {editInfo && (
        <PetEditInfo pet={pet} onSave={patch=>{update(patch);setEditInfo(false);}} onClose={() => setEditInfo(false)}/>
      )}
    </div>
  );
}

/* ── PetsList ─────────────────────────────────────────────────── */
function PetsList({ pets, setPets, onOpen, onMenu }) {
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({nome:"",raca:"",sexo:"M",obs:"",foto:null});
  const fileRefAdd = useRef();

  const adicionar = () => {
    if (!form.nome.trim()) return;
    setPets(ps => [...ps, {id:Date.now(),nome:form.nome.trim(),raca:form.raca.trim(),
      sexo:form.sexo,nascimento:"",foto:form.foto,peso:"",obs:form.obs.trim(),
      vacinas:[],vermifugos:[],antipulgas:[],consultas:[],exames:[],
      medicamentos:[],banhos:[],gastos:[],galeria:[]}]);
    setForm({nome:"",raca:"",sexo:"M",obs:"",foto:null});
    setAddModal(false);
  };
  const handleFotoAdd = async e => {
    const f = e.target.files[0]; if (!f) return;
    const data = await compressImage(f, 800, 0.85);
    setForm(x => ({...x, foto:data}));
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <AppHeader title="Pets" onMenu={onMenu}/>
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px 100px"}}>
        <MascoteHeader secao="pets" sub={`${pets.length} cachorros na família`}/>

        {(() => {
          const all = getAllPetAlerts(pets);
          if (all.length === 0) return null;
          const danger = all.filter(a=>a.nivel==="danger").length;
          const alert  = all.filter(a=>a.nivel==="alert").length;
          return (
            <Card style={{padding:"12px 14px",marginBottom:14,
              background:T.alertBg,border:`1px solid ${T.alert}33`}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:6}}>🔔 Resumo geral</div>
              <div style={{display:"flex",gap:8}}>
                {danger>0&&<Pill label={`${danger} atrasado${danger>1?"s":""}`} color={T.danger} bg="#fff"/>}
                {alert>0 &&<Pill label={`${alert} próximo${alert>1?"s":""}`}   color={T.alert}  bg="#fff"/>}
              </div>
            </Card>
          );
        })()}

        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
          {pets.map((p, idx) => {
            const alertas = getPetAlerts(p);
            const urgentes = alertas.filter(a=>a.nivel==="danger").length;
            const proximos = alertas.filter(a=>a.nivel==="alert").length;
            return (
              <button key={p.id} onClick={() => onOpen(p.id)} style={{
                display:"flex",alignItems:"center",gap:14,
                padding:"14px 16px",borderRadius:18,
                background:T.bgCard,border:`1px solid ${T.border}`,
                textAlign:"left"}}>
                <div style={{width:62,height:62,borderRadius:20,background:T.blueBg,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:30,flexShrink:0,overflow:"hidden",
                  border:`1.5px solid ${T.blue}33`}}>
                  {p.foto
                    ? <img src={p.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <span>🐾</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                    <span className="serif" style={{fontSize:18,fontWeight:700,color:T.text}}>{p.nome}</span>
                    <span style={{fontSize:10,color:T.textMute,fontWeight:700}}>#{idx+1}</span>
                  </div>
                  <div style={{fontSize:12,color:T.textSub,marginTop:1}}>
                    {p.raca}{p.sexo?` · ${p.sexo==="M"?"♂":"♀"}`:""}
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    {urgentes>0&&<Pill label={`⚠️ ${urgentes}`} color={T.danger} bg={T.dangerBg}/>}
                    {proximos>0&&<Pill label={`⏰ ${proximos}`} color={T.alert}  bg={T.alertBg}/>}
                    {urgentes===0&&proximos===0&&<Pill label="em dia" color={T.moss} bg={T.mossBg}/>}
                  </div>
                </div>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke={T.textMute} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            );
          })}
        </div>

        <button onClick={() => setAddModal(true)} style={{
          width:"100%",padding:"13px",borderRadius:12,
          background:T.blue,color:"#fff",fontSize:14,fontWeight:700,
          boxShadow:"0 2px 12px rgba(106,143,170,.3)"}}>+ Adicionar Pet</button>
      </div>

      {addModal && (
        <Modal title="Novo Pet" onClose={() => setAddModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <button onClick={() => fileRefAdd.current.click()} style={{
                width:62,height:62,borderRadius:18,background:T.blueBg,
                display:"flex",alignItems:"center",justifyContent:"center",
                flexShrink:0,overflow:"hidden",
                border:`2px dashed ${form.foto?T.blue:T.borderMd}`}}>
                {form.foto
                  ? <img src={form.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : <span style={{fontSize:24}}>🐾</span>}
              </button>
              <input ref={fileRefAdd} type="file" accept="image/*" style={{display:"none"}} onChange={handleFotoAdd}/>
              <div style={{fontSize:12,color:T.textMute}}>Toque para foto</div>
            </div>
            <Input label="Nome" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))}/>
            <Input label="Raça" value={form.raca} onChange={e=>setForm(f=>({...f,raca:e.target.value}))}/>
            <Select label="Sexo" value={form.sexo} onChange={e=>setForm(f=>({...f,sexo:e.target.value}))}
              options={[{v:"M",l:"Macho"},{v:"F",l:"Fêmea"}]}/>
            <ModalActions onCancel={() => setAddModal(false)} onSave={adicionar} saveLabel="Adicionar" color={T.blue}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── TelaPets (root) ──────────────────────────────────────────── */
export default function TelaPets({ pets, setPets, petOpenId, setPetOpenId, onMenu }) {
  if (petOpenId) {
    const pet = pets.find(p => p.id === petOpenId);
    if (pet) return <PetDetail pet={pet} setPets={setPets} onBack={() => setPetOpenId(null)}/>;
  }
  return <PetsList pets={pets} setPets={setPets} onOpen={id=>setPetOpenId(id)} onMenu={onMenu}/>;
}
