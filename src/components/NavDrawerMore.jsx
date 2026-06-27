import { T } from "../constants/theme.js";
import { MASCOTES, COW_IMG } from "../constants/mascotes.js";
import { LOGO } from "../constants/images.js";
import { Modal } from "./primitives.jsx";

/* ── DRAWER ─────────────────────────────────────────────────────────────── */
export function Drawer({ onClose, onNav }) {
  const items = [
    { id:"hoje",     label:"Hoje",         cor:T.terra, nome:"Flora"   },
    { id:"pets",     label:"Pets",         cor:T.blue,  nome:"Margarida"},
    { id:"closet",   label:"Closet",       cor:T.sand,  nome:"Lola"    },
    { id:"beauty",   label:"Beauty",       cor:T.rose,  nome:"Camélia" },
    { id:"casa",     label:"Casa & Sítio", cor:T.moss,  nome:"Estrela" },
    { id:"memorias", label:"Memórias",     cor:T.lav,   nome:"Mimosa"  },
    { id:"agenda",   label:"Agenda",       cor:T.terra, nome:"Flora"   },
  ];

  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,display:"flex",background:"rgba(0,0,0,.35)" }}
      onClick={onClose}>
      <div className="slide-in" onClick={(e) => e.stopPropagation()} style={{
        width:268,height:"100%",background:T.bgCard,
        borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column" }}>

        <div style={{ padding:"52px 20px 18px",borderBottom:`1px solid ${T.border}`,
          background:T.bgPage,display:"flex",alignItems:"center",gap:12 }}>
          <img src={LOGO} alt="" style={{ width:44,height:44,borderRadius:13,objectFit:"cover" }}/>
          <div>
            <div className="serif" style={{ fontWeight:700,fontSize:20,color:T.terra,letterSpacing:-.3 }}>ZenCow</div>
            <div style={{ fontSize:11,color:T.textMute,fontStyle:"italic" }}>Minha pequena fazenda da vida</div>
          </div>
        </div>

        <div style={{ flex:1,padding:"10px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto" }}>
          {items.map((it) => (
            <button key={it.id} onClick={() => { onNav(it.id); onClose(); }} style={{
              display:"flex",alignItems:"center",gap:12,
              padding:"10px 12px",borderRadius:12,textAlign:"left" }}>
              <div style={{ width:42,height:42,borderRadius:12,background:`${it.cor}18`,
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <img src={COW_IMG[it.id]} alt="" style={{ width:30,height:30,objectFit:"contain" }}/>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:14,fontWeight:700,color:T.text }}>{it.label}</div>
                <div style={{ fontSize:10,color:T.textMute,fontStyle:"italic" }}>com {it.nome}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding:"12px 20px 28px",borderTop:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11,color:T.textMute,textAlign:"center" }}>ZenCow v3.0 · Diário visual</div>
        </div>
      </div>
    </div>
  );
}

/* ── NAV BAR ─────────────────────────────────────────────────────────────── */
import { COW_FLORA, COW_MARGARIDA, COW_LOLA, COW_CAMELIA } from "../constants/images.js";

const TABS = [
  { id:"hoje",   label:"Hoje",   color:T.terra, cow:null /* set below */ },
  { id:"pets",   label:"Pets",   color:T.blue,  cow:null },
  { id:"closet", label:"Closet", color:T.sand,  cow:null },
  { id:"beauty", label:"Beauty", color:T.rose,  cow:null },
  { id:"mais",   label:"Mais",   color:T.moss,  cow:null },
];

export function NavBar({ active, onSelect, openMore }) {
  const cows = [COW_FLORA, COW_MARGARIDA, COW_LOLA, COW_CAMELIA, null];
  const isMore = ["casa","memorias","agenda","mais"].includes(active);

  return (
    <div style={{ flexShrink:0,background:T.bgCard,borderTop:`1px solid ${T.border}`,
      display:"flex",paddingBottom:"env(safe-area-inset-bottom,4px)",zIndex:200 }}>
      {TABS.map((t, i) => {
        const on    = t.id === "mais" ? isMore : active === t.id;
        const cow   = cows[i];
        const click = () => t.id === "mais" ? openMore() : onSelect(t.id);
        return (
          <button key={t.id} onClick={click} style={{
            flex:1,display:"flex",flexDirection:"column",
            alignItems:"center",gap:1,padding:"6px 0 3px" }}>
            <div style={{ width:38,height:32,borderRadius:10,
              background: on ? `${t.color}1A` : "transparent",
              display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s" }}>
              {cow ? (
                <img src={cow} alt="" style={{
                  width: on ? 27 : 21, height: on ? 27 : 21, objectFit:"contain",
                  transition:"all .15s", filter: on ? "none" : "grayscale(40%) opacity(0.65)" }}/>
              ) : (
                <span style={{ fontSize: on ? 22 : 18, color: on ? t.color : T.textMute, fontWeight:800, letterSpacing:1 }}>⋯</span>
              )}
            </div>
            <span style={{ fontSize:9.5, fontWeight: on ? 800 : 500, color: on ? t.color : T.textMute }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── MORE SHEET ──────────────────────────────────────────────────────────── */
export function MoreSheet({ onClose, onNav, active }) {
  const items = [
    { id:"agenda",   label:"Agenda",       cor:T.terra, nome:"Flora",   sub:"Calendário e compromissos" },
    { id:"casa",     label:"Casa & Sítio", cor:T.moss,  nome:"Estrela", sub:"Tarefas e o sonho do sítio" },
    { id:"memorias", label:"Memórias",     cor:T.lav,   nome:"Mimosa",  sub:"Sua linha do tempo" },
  ];
  return (
    <Modal title="Mais" onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {items.map((it) => (
          <button key={it.id} onClick={() => { onNav(it.id); onClose(); }} style={{
            display:"flex",alignItems:"center",gap:14,
            padding:"14px 16px",borderRadius:14,
            background: active === it.id ? `${it.cor}18` : T.bgInput,
            border:`1px solid ${active === it.id ? `${it.cor}55` : "transparent"}`,
            textAlign:"left",transition:"all .12s" }}>
            <div style={{ width:50,height:50,borderRadius:14,background:`${it.cor}22`,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <img src={COW_IMG[it.id]} alt="" style={{ width:38,height:38,objectFit:"contain" }}/>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div className="serif" style={{ fontSize:17,fontWeight:700,color:T.text }}>{it.label}</div>
              <div style={{ fontSize:11,color:T.textMute,fontStyle:"italic",marginTop:1 }}>com {it.nome}</div>
              <div style={{ fontSize:11,color:T.textSub,marginTop:2 }}>{it.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
