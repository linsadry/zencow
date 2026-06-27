import { T } from "../constants/theme.js";
import { COW_IMG } from "../constants/mascotes.js";
import { Modal } from "./primitives.jsx";

export default function MoreSheet({ onClose, onNav, active }) {
  const items = [
    {id:"agenda",   label:"Agenda",       cor:T.terra, nome:"Flora",   sub:"Calendário e compromissos"},
    {id:"casa",     label:"Casa & Sítio", cor:T.moss,  nome:"Estrela", sub:"Tarefas e o sonho do sítio"},
    {id:"memorias", label:"Memórias",     cor:T.lav,   nome:"Mimosa",  sub:"Sua linha do tempo"},
  ];
  return (
    <Modal title="Mais" onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {items.map(it => (
          <button key={it.id} onClick={()=>{onNav(it.id);onClose();}} style={{
            display:"flex",alignItems:"center",gap:14,
            padding:"14px 16px",borderRadius:14,
            background:active===it.id?it.cor+"18":T.bgInput,
            border:`1px solid ${active===it.id?it.cor+"55":"transparent"}`,
            textAlign:"left",transition:"all .12s"}}>
            <div style={{width:50,height:50,borderRadius:14,background:it.cor+"22",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <img src={COW_IMG[it.id]} alt="" style={{width:38,height:38,objectFit:"contain"}}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="serif" style={{fontSize:17,fontWeight:700,color:T.text}}>{it.label}</div>
              <div style={{fontSize:11,color:T.textMute,fontStyle:"italic",marginTop:1}}>com {it.nome}</div>
              <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{it.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
