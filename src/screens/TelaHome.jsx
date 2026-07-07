import { T }                              from "../constants/theme.js";
import { Card, Pill }                    from "../components/primitives.jsx";
import AppHeader                         from "../components/AppHeader.jsx";
import { getPetAlerts, getAllPetAlerts } from "../utils/pets.js";

/* daysSince inline — sem import de dates.js */
function daysSince(dateStr) {
  if (!dateStr) return 0;
  try {
    const [d, m, y] = String(dateStr).split("/");
    return Math.floor((new Date() - new Date(+y, +m - 1, +d)) / 86400000);
  } catch { return 0; }
}

const FREQ = { Diário:1, Semanal:7, Quinzenal:14, Mensal:30, Trimestral:90, Semestral:180, Anual:365 };

function SI({ type, size=20, color="currentColor" }) {
  const s={width:size,height:size,display:"block",margin:"0 auto",fill:"none",stroke:color,strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"};
  if(type==="pets") return <svg viewBox="0 0 24 24" style={s}><circle cx="4.5" cy="9.5" r="2"/><circle cx="9" cy="4.5" r="2"/><circle cx="15" cy="4.5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M12 14c-2.5 0-4 1-4 3s2 3 4 3 4-1 4-3-1.5-3-4-3z"/></svg>;
  if(type==="pecas") return <svg viewBox="0 0 24 24" style={s}><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57A1 1 0 004 10h.19v10a2 2 0 002 2h11.62a2 2 0 002-2V10H20a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.19-2.13z"/></svg>;
  if(type==="memorias") return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
  if(type==="looks") return <svg viewBox="0 0 24 24" style={s}><line x1="12" y1="2" x2="12" y2="6"/><path d="M8 6h8l2 14H6z"/><path d="M9 6c0 1.66 1.34 3 3 3s3-1.34 3-3"/></svg>;
  if(type==="produtos") return <svg viewBox="0 0 24 24" style={s}><path d="M9 2h6l1 7H8z"/><path d="M8 9c0 5 1.5 9 4 11 2.5-2 4-6 4-11"/><line x1="12" y1="2" x2="12" y2="9"/></svg>;
  if(type==="pets-al") return <svg viewBox="0 0 24 24" style={s}><circle cx="4.5" cy="9.5" r="2"/><circle cx="9" cy="4.5" r="2"/><circle cx="15" cy="4.5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M12 14c-2.5 0-4 1-4 3s2 3 4 3 4-1 4-3-1.5-3-4-3z"/></svg>;
  if(type==="casa") return <svg viewBox="0 0 24 24" style={s}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>;
  if(type==="compras") return <svg viewBox="0 0 24 24" style={s}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.57L23 6H6"/></svg>;
  if(type==="paw") return <svg viewBox="0 0 24 24" style={s}><circle cx="4.5" cy="9.5" r="2"/><circle cx="9" cy="4.5" r="2"/><circle cx="15" cy="4.5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M12 14c-2.5 0-4 1-4 3s2 3 4 3 4-1 4-3-1.5-3-4-3z"/></svg>;
  return null;
}

export default function TelaHome({ state={}, pets=[], pecas=[], memorias=[], onMenu }) {
  const { tarefas=[], compras=[], beautyProdutos=[], looks=[] } = state;
  const sP=Array.isArray(pets)?pets:[], sM=Array.isArray(memorias)?memorias:[];

  const petAlerts = (()=>{ try{ return getAllPetAlerts(sP)||[]; } catch{ return []; } })();
  const petD = petAlerts.filter(a=>a.nivel==="danger").length;
  const petA = petAlerts.filter(a=>a.nivel==="alert").length;
  const compPend = (Array.isArray(compras)?compras:[]).filter(c=>!c.feito).length;
  const tarefasAt = (Array.isArray(tarefas)?tarefas:[]).reduce(
    (sum, comodo) => sum + (Array.isArray(comodo.pendencias) ? comodo.pendencias.filter(p => !p.feita).length : 0),
    0
  );

  const ultimaMem = [...sM].sort((a,b)=>{
    const p=s=>{if(!s)return 0;const[d,m,y]=s.split("/");return new Date(+y,+m-1,+d);};
    return p(b.data)-p(a.data);
  })[0];

  const stats=[
    {type:"pets",     label:"Pets",    value:sP.length,                                          color:T.blue},
    {type:"pecas",    label:"Peças",   value:(Array.isArray(pecas)?pecas:[]).length,              color:T.sand},
    {type:"memorias", label:"Memórias",value:sM.length,                                          color:T.lav},
    {type:"looks",    label:"Looks",   value:(Array.isArray(looks)?looks:[]).length,              color:T.sand},
    {type:"produtos", label:"Produtos",value:(Array.isArray(beautyProdutos)?beautyProdutos:[]).length, color:T.rose},
  ];
  const alerts=[
    petD>0       &&{type:"pets-al", texto:`${petD} pet${petD>1?"s":""} com atraso`,      nivel:"danger"},
    petA>0       &&{type:"pets-al", texto:`${petA} pet${petA>1?"s":""} com prazo próximo`,nivel:"alert"},
    tarefasAt>0  &&{type:"casa",    texto:`${tarefasAt} tarefa${tarefasAt>1?"s":""} atrasada${tarefasAt>1?"s":""}`, nivel:"alert"},
    compPend>0   &&{type:"compras", texto:`${compPend} item${compPend>1?"s":""} na lista`, nivel:"info"},
  ].filter(Boolean);
  const isEmpty = alerts.length===0 && sP.length===0 && sM.length===0;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <AppHeader title="ZenCow" onMenu={onMenu}/>
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px 100px"}}>

        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <img src="/cow-zen.png" alt="" style={{width:48,height:48,objectFit:"contain",flexShrink:0}}/>
          <div>
            <div className="serif" style={{fontSize:20,fontWeight:700,color:T.text,lineHeight:1.1}}>ZenCow</div>
            <div style={{fontSize:11,color:T.textMute,marginTop:2}}>Bem-vinda à sua fazendinha</div>
          </div>
        </div>

        <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
          {stats.map(s=>(
            <div key={s.label} style={{flexShrink:0,padding:"10px 14px",borderRadius:14,
              background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"center",minWidth:68}}>
              <SI type={s.type} size={20} color={s.color}/>
              <div className="serif" style={{fontSize:20,fontWeight:700,color:s.color,marginTop:4}}>{s.value}</div>
              <div style={{fontSize:9,color:T.textMute,fontWeight:700,letterSpacing:.3,textTransform:"uppercase",marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>

        {alerts.length>0 && (
          <Card style={{padding:"12px 14px",marginBottom:14,background:T.alertBg,border:`1px solid ${T.alert}33`}}>
            <div style={{fontSize:12,fontWeight:800,color:T.text,marginBottom:8}}>Atenção</div>
            {alerts.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginTop:i?4:0}}>
                <SI type={a.type} size={14} color={a.nivel==="danger"?T.danger:T.alert}/>
                <span style={{fontSize:12,color:T.text,flex:1}}>{a.texto}</span>
                {a.nivel==="danger"&&<Pill label="urgente" color={T.danger} bg={T.dangerBg}/>}
              </div>
            ))}
          </Card>
        )}

        {ultimaMem && (
          <Card style={{padding:"14px 16px",marginBottom:14}}>
            <div className="serif" style={{fontSize:15,fontWeight:700,marginBottom:10,color:T.text}}>Última memória</div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              {ultimaMem.foto&&<div style={{width:60,height:60,borderRadius:12,overflow:"hidden",flexShrink:0}}><img src={ultimaMem.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ultimaMem.titulo||"Sem título"}</div>
                <div style={{fontSize:11,color:T.textMute,marginTop:2}}>{ultimaMem.data}</div>
                {ultimaMem.texto&&<div style={{fontSize:11,color:T.textSub,marginTop:4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ultimaMem.texto}</div>}
              </div>
            </div>
          </Card>
        )}

        {sP.length>0 && (
          <Card style={{padding:"14px 16px",marginBottom:14}}>
            <div className="serif" style={{fontSize:15,fontWeight:700,marginBottom:10,color:T.text}}>Meus pets</div>
            {sP.map(p=>{
              const al=(()=>{try{return getPetAlerts(p)||[];}catch{return [];}})();
              const dg=al.filter(x=>x.nivel==="danger").length;
              const av=al.filter(x=>x.nivel==="alert").length;
              return(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:T.bgInput,borderRadius:10,marginBottom:4}}>
                  <div style={{width:36,height:36,borderRadius:10,overflow:"hidden",flexShrink:0,background:T.blueBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {p.foto?<img src={p.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<SI type="paw" size={16} color={T.blue}/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.text}}>{p.nome}</div>
                    <div style={{fontSize:10,color:T.textMute}}>{p.raca||p.especie}</div>
                  </div>
                  {dg>0&&<Pill label={`${dg} atrasado${dg>1?"s":""}`} color={T.danger} bg={T.dangerBg}/>}
                  {av>0&&<Pill label={`${av} próximo${av>1?"s":""}`}  color={T.alert}  bg={T.alertBg}/>}
                  {dg===0&&av===0&&<Pill label="em dia" color={T.moss} bg={T.mossBg}/>}
                </div>
              );
            })}
          </Card>
        )}

        {isEmpty&&(
          <Card style={{padding:"36px 24px",textAlign:"center"}}>
            <img src="/cow-zen.png" alt="" style={{width:96,height:96,objectFit:"contain",margin:"0 auto 16px"}}/>
            <div className="serif" style={{fontSize:16,fontWeight:700,marginBottom:6,color:T.text}}>Bem-vinda ao ZenCow!</div>
            <div style={{fontSize:12,color:T.textMute,lineHeight:1.6}}>Use o menu para começar a organizar sua vida</div>
          </Card>
        )}
      </div>
    </div>
  );
}
