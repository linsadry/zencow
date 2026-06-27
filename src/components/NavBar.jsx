import { T } from "../constants/theme.js";
import imgFlora     from "../assets/cow-flora.png";
import imgMargarida from "../assets/cow-margarida.png";
import imgLola      from "../assets/cow-lola.png";
import imgCamelia   from "../assets/cow-camelia.png";

const TABS = [
  {id:"hoje",   label:"Hoje",   color:T.terra, cow:imgFlora},
  {id:"pets",   label:"Pets",   color:T.blue,  cow:imgMargarida},
  {id:"closet", label:"Closet", color:T.sand,  cow:imgLola},
  {id:"beauty", label:"Beauty", color:T.rose,  cow:imgCamelia},
  {id:"mais",   label:"Mais",   color:T.moss,  cow:null},
];

export default function NavBar({ active, onSelect, openMore }) {
  const isMore = active==="casa"||active==="memorias"||active==="agenda"||active==="mais";
  return (
    <div style={{flexShrink:0,background:T.bgCard,borderTop:`1px solid ${T.border}`,
      display:"flex",paddingBottom:"env(safe-area-inset-bottom,4px)",zIndex:200}}>
      {TABS.map(t => {
        const on = t.id==="mais" ? isMore : active===t.id;
        const handleClick = () => { if (t.id==="mais") openMore(); else onSelect(t.id); };
        return (
          <button key={t.id} onClick={handleClick} style={{
            flex:1,display:"flex",flexDirection:"column",
            alignItems:"center",gap:1,padding:"6px 0 3px"}}>
            <div style={{width:38,height:32,borderRadius:10,
              background:on?t.color+"1A":"transparent",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"background .15s"}}>
              {t.cow
                ? <img src={t.cow} alt="" style={{
                    width:on?27:21,height:on?27:21,objectFit:"contain",
                    transition:"all .15s",
                    filter:on?"none":"grayscale(40%) opacity(0.65)"}}/>
                : <span style={{fontSize:on?22:18,color:on?t.color:T.textMute,fontWeight:800,letterSpacing:1}}>⋯</span>
              }
            </div>
            <span style={{fontSize:9.5,fontWeight:on?800:500,
              color:on?t.color:T.textMute}}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
