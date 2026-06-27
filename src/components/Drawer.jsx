import { T } from "../constants/theme.js";
import { LOGO, COW_IMG } from "../constants/mascotes.js";

export default function Drawer({ onClose, onNav }) {
  const items = [
    {id:"hoje",     label:"Hoje",         cor:T.terra, nome:"Flora"},
    {id:"pets",     label:"Pets",         cor:T.blue,  nome:"Margarida"},
    {id:"closet",   label:"Closet",       cor:T.sand,  nome:"Lola"},
    {id:"beauty",   label:"Beauty",       cor:T.rose,  nome:"Camélia"},
    {id:"casa",     label:"Casa & Sítio", cor:T.moss,  nome:"Estrela"},
    {id:"memorias", label:"Memórias",     cor:T.lav,   nome:"Mimosa"},
    {id:"agenda",   label:"Agenda",       cor:T.terra, nome:"Flora"},
  ];
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",background:"rgba(0,0,0,.35)"}} onClick={onClose}>
      <div className="slide-in" onClick={e=>e.stopPropagation()} style={{
        width:268,height:"100%",background:T.bgCard,
        borderRight:`1px solid ${T.border}`,
        display:"flex",flexDirection:"column"}}>
        <div style={{padding:"52px 20px 18px",borderBottom:`1px solid ${T.border}`,
          background:T.bgPage,display:"flex",alignItems:"center",gap:12}}>
          <img src={LOGO} alt="" style={{width:44,height:44,borderRadius:13,objectFit:"cover"}}/>
          <div>
            <div className="serif" style={{fontWeight:700,fontSize:20,color:T.terra,letterSpacing:-.3}}>ZenCow</div>
            <div style={{fontSize:11,color:T.textMute,fontStyle:"italic"}}>Minha pequena fazenda da vida</div>
          </div>
        </div>
        <div style={{flex:1,padding:"10px 10px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
          {items.map(it => (
            <button key={it.id} onClick={()=>{onNav(it.id);onClose();}} style={{
              display:"flex",alignItems:"center",gap:12,
              padding:"10px 12px",borderRadius:12,textAlign:"left",transition:"background .12s"}}>
              <div style={{width:42,height:42,borderRadius:12,background:it.cor+"18",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <img src={COW_IMG[it.id]} alt="" style={{width:30,height:30,objectFit:"contain"}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>{it.label}</div>
                <div style={{fontSize:10,color:T.textMute,fontStyle:"italic"}}>com {it.nome}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{padding:"12px 20px 28px",borderTop:`1px solid ${T.border}`}}>
          <div style={{fontSize:11,color:T.textMute,textAlign:"center"}}>ZenCow v3.0 · Diário visual</div>
        </div>
      </div>
    </div>
  );
}
