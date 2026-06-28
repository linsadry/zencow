import { T } from "../constants/theme.js";
import { Card, Pill, MascoteHeader } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { getPetAlerts, getAllPetAlerts } from "../utils/pets.js";
import { daysSince } from "../utils/dates.js";

const FREQ_LIMITES = { Diário:1,Semanal:7,Quinzenal:14,Mensal:30,Trimestral:90,Semestral:180,Anual:365 };

export default function TelaHome({ state, pets, pecas, memorias, onMenu }) {
  const { tarefas=[], compras=[], manutencoes=[], beautyProdutos=[], looks=[] } = state;

  const petAlerts   = getAllPetAlerts(pets);
  const petDanger   = petAlerts.filter(a => a.nivel==="danger").length;
  const petAlert    = petAlerts.filter(a => a.nivel==="alert").length;

  const comprasPend = compras.filter(c => !c.feito).length;

  const tarefasAtrasadas = tarefas.filter(t => {
    if (!t.ultimaVez) return true;
    const d = daysSince(t.ultimaVez);
    const lim = FREQ_LIMITES[t.frequencia] || 7;
    return d >= lim;
  }).length;

  const ultimaMemoria = [...memorias].sort((a,b) => {
    const pd = s => { if(!s) return 0; const [d,m,y]=s.split("/"); return new Date(y,m-1,d); };
    return pd(b.data) - pd(a.data);
  })[0];

  const stats = [
    { icon:"🐾", label:"Pets",      value:pets.length,      color:T.blue   },
    { icon:"👗", label:"Peças",     value:pecas.length,     color:T.sand   },
    { icon:"📷", label:"Memórias",  value:memorias.length,  color:T.sand   },
    { icon:"👗", label:"Looks",     value:looks.length,     color:T.sand   },
    { icon:"🧴", label:"Produtos",  value:beautyProdutos.length, color:T.sand },
  ];

  const alerts = [
    petDanger>0    && { icon:"🐾", texto:`${petDanger} pet${petDanger>1?"s":""} com vacina/vermífugo atrasado`, nivel:"danger" },
    petAlert>0     && { icon:"🐾", texto:`${petAlert} pet${petAlert>1?"s":""} com prazo próximo`,               nivel:"alert"  },
    tarefasAtrasadas>0 && { icon:"🧹", texto:`${tarefasAtrasadas} tarefa${tarefasAtrasadas>1?"s":""} de casa atrasada${tarefasAtrasadas>1?"s":""}`, nivel:"alert" },
    comprasPend>0  && { icon:"🛒", texto:`${comprasPend} item${comprasPend>1?"s":""} na lista de compras`,      nivel:"info"   },
  ].filter(Boolean);

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <AppHeader title="ZenCow" onMenu={onMenu}/>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 16px 100px" }}>
        <div style={{ padding:"12px 16px 4px" }}>
  <div className="serif" style={{ fontSize:18,fontWeight:700,color:T.text }}>
    🐄 ZenCow
  </div>
  <div style={{ fontSize:12,color:T.textMute,marginTop:2 }}>Bem-vinda à sua fazendinha 🌿</div>
</div>

        {/* stats row */}
        <div style={{ display:"flex",gap:8,overflowX:"auto",marginBottom:14,paddingBottom:4 }}>
          {stats.map(s => (
            <div key={s.label} style={{ flexShrink:0,padding:"10px 14px",borderRadius:14,
              background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"center",minWidth:68 }}>
              <div style={{ fontSize:22 }}>{s.icon}</div>
              <div className="serif" style={{ fontSize:20,fontWeight:700,color:s.color,marginTop:2 }}>{s.value}</div>
              <div style={{ fontSize:9,color:T.textMute,fontWeight:700,letterSpacing:.3,
                textTransform:"uppercase",marginTop:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* alerts */}
        {alerts.length>0 && (
          <Card style={{ padding:"12px 14px",marginBottom:14,
            background:T.alertBg,border:`1px solid ${T.alert}33` }}>
            <div style={{ fontSize:12,fontWeight:800,color:T.text,marginBottom:8 }}>🔔 Atenção</div>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              {alerts.map((a,i) => (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:16 }}>{a.icon}</span>
                  <span style={{ fontSize:12,color:T.text,flex:1 }}>{a.texto}</span>
                  {a.nivel==="danger" && <Pill label="urgente" color={T.danger} bg={T.dangerBg}/>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* última memória */}
        {ultimaMemoria && (
          <Card style={{ padding:"14px 16px",marginBottom:14 }}>
            <div className="serif" style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>📷 Última memória</div>
            <div style={{ display:"flex",gap:12,alignItems:"center" }}>
              {ultimaMemoria.foto && (
                <div style={{ width:60,height:60,borderRadius:12,overflow:"hidden",flexShrink:0 }}>
                  <img src={ultimaMemoria.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                </div>
              )}
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13,fontWeight:700,color:T.text,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                  {ultimaMemoria.titulo||"Sem título"}
                </div>
                <div style={{ fontSize:11,color:T.textMute,marginTop:2 }}>{ultimaMemoria.data}</div>
                {ultimaMemoria.texto && (
                  <div style={{ fontSize:11,color:T.textSub,marginTop:4,
                    overflow:"hidden",display:"-webkit-box",
                    WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>
                    {ultimaMemoria.texto}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* pets resumo */}
        {pets.length>0 && (
          <Card style={{ padding:"14px 16px",marginBottom:14 }}>
            <div className="serif" style={{ fontSize:15,fontWeight:700,marginBottom:10 }}>🐾 Meus pets</div>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              {pets.map(p => {
                const alerts = getPetAlerts(p);
                const danger = alerts.filter(a=>a.nivel==="danger").length;
                const alert  = alerts.filter(a=>a.nivel==="alert").length;
                return (
                  <div key={p.id} style={{ display:"flex",alignItems:"center",gap:10,
                    padding:"8px 10px",background:T.bgInput,borderRadius:10 }}>
                    <div style={{ width:36,height:36,borderRadius:10,overflow:"hidden",flexShrink:0,
                      background:T.blueBg,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {p.foto
                        ? <img src={p.foto} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                        : <span style={{ fontSize:18 }}>🐾</span>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:700,color:T.text }}>{p.nome}</div>
                      <div style={{ fontSize:10,color:T.textMute }}>{p.raca}</div>
                    </div>
                    {danger>0 && <Pill label={`⚠️ ${danger}`} color={T.danger} bg={T.dangerBg}/>}
                    {alert>0  && <Pill label={`⏰ ${alert}`}  color={T.alert}  bg={T.alertBg}/>}
                    {danger===0&&alert===0 && <Pill label="em dia" color={T.moss} bg={T.mossBg}/>}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {alerts.length===0 && pets.length===0 && memorias.length===0 && (
          <Card style={{ padding:"30px",textAlign:"center" }}>
            <div style={{ fontSize:40,marginBottom:10 }}>🐄</div>
            <div className="serif" style={{ fontSize:16,fontWeight:700,marginBottom:4 }}>
              Bem-vinda ao ZenCow!
            </div>
            <div style={{ fontSize:12,color:T.textMute }}>
              Use o menu abaixo para começar a organizar sua vida 🌿
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
