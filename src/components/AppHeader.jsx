import { T } from "../constants/theme.js";
import { LOGO } from "../constants/mascotes.js";

export default function AppHeader({ title, showLogo=false, onMenu, onBack=null, rightAction=null }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"13px 18px 11px",background:T.bgPage,
      borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
      {onBack ? (
        <button onClick={onBack} style={{width:34,height:34,borderRadius:10,
          background:T.bgCard,border:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
            <path d="M7 1L1 6.5L7 12" stroke={T.textSub} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      ) : (
        <button onClick={onMenu} style={{width:34,height:34,borderRadius:10,
          background:T.bgCard,border:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
            <rect width="15" height="2" rx="1" fill={T.textSub}/>
            <rect y="5" width="10" height="2" rx="1" fill={T.textSub}/>
            <rect y="10" width="6" height="2" rx="1" fill={T.textSub}/>
          </svg>
        </button>
      )}
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        {showLogo && <img src={LOGO} alt="" style={{width:25,height:25,borderRadius:7,objectFit:"cover"}}/>}
        <span className="serif" style={{fontSize:showLogo?22:18,fontWeight:700,color:showLogo?T.terra:T.text,letterSpacing:-.3}}>{title}</span>
      </div>
      {rightAction || <div style={{width:34}}/>}
    </div>
  );
}
