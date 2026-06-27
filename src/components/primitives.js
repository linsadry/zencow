import { useMemo } from "react";
import { T } from "../constants/theme.js";
import { MASCOTES } from "../constants/mascotes.js";

/* ── Atoms ─────────────────────────────────────────────────────────────── */
export const Card = ({ children, style = {} }) => (
  <div style={{ background: T.bgCard, borderRadius: 18, border: `1px solid ${T.border}`, ...style }}>
    {children}
  </div>
);

export const Pill = ({ label, color, bg }) => (
  <span style={{ fontSize: 11, fontWeight: 700, color, background: bg,
    borderRadius: 99, padding: "3px 10px", whiteSpace: "nowrap" }}>{label}</span>
);

export const IconBtn = ({ icon, onClick, color = T.textMute, size = 15 }) => (
  <button onClick={onClick} style={{ fontSize: size, color, padding: "4px", lineHeight: 1 }}>{icon}</button>
);

/* ── Modal ─────────────────────────────────────────────────────────────── */
export const Modal = ({ title, children, onClose }) => (
  <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:600,
    display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
    <div className="fade-up" onClick={(e) => e.stopPropagation()} style={{
      width:"100%",maxWidth:430,background:T.bgCard,
      borderRadius:"22px 22px 0 0",padding:"20px 20px 38px",
      maxHeight:"85vh",overflowY:"auto" }}>
      <div style={{ width:36,height:4,borderRadius:99,background:T.borderMd,margin:"0 auto 16px" }}/>
      {title && (
        <div className="serif" style={{ fontWeight:700,fontSize:20,marginBottom:16,color:T.text }}>{title}</div>
      )}
      {children}
    </div>
  </div>
);

/* ── MascoteHeader ──────────────────────────────────────────────────────── */
export const MascoteHeader = ({ secao, sub }) => {
  const m = MASCOTES[secao];
  const fala = useMemo(
    () => m.saudacoes[Math.floor(Math.random() * m.saudacoes.length)],
    [secao]
  );
  return (
    <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18 }}>
      <img src={m.img} alt={m.nome} className="float-y" style={{
        width:72,height:72,objectFit:"contain",flexShrink:0,
        filter:"drop-shadow(0 4px 10px rgba(0,0,0,.12))" }}/>
      <div style={{ flex:1,minWidth:0 }}>
        <div className="serif" style={{ fontSize:24,fontWeight:700,color:m.cor,letterSpacing:-.4,lineHeight:1.1 }}>{m.nome}</div>
        <div style={{ fontSize:12,color:T.textSub,marginTop:3,fontStyle:"italic",lineHeight:1.4 }}>"{fala}"</div>
        {sub && (
          <div style={{ fontSize:11,color:T.textMute,marginTop:3,fontWeight:600,letterSpacing:.3,textTransform:"uppercase" }}>{sub}</div>
        )}
      </div>
    </div>
  );
};

/* ── Form fields ────────────────────────────────────────────────────────── */
export const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    {label && (
      <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>
        {label.toUpperCase()}
      </div>
    )}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width:"100%",padding:"11px 14px",borderRadius:10,
        border:`1px solid ${T.border}`,background:T.bgInput,fontSize:14,color:T.text }}/>
  </div>
);

export const Select = ({ label, value, onChange, options }) => (
  <div>
    {label && (
      <div style={{ fontSize:11,color:T.textMute,fontWeight:700,marginBottom:5,letterSpacing:.3 }}>
        {label.toUpperCase()}
      </div>
    )}
    <select value={value} onChange={onChange}
      style={{ width:"100%",padding:"10px 12px",borderRadius:10,
        border:`1px solid ${T.border}`,background:T.bgInput,fontSize:13,color:T.text }}>
      {options.map((o) => (
        <option key={typeof o === "string" ? o : o.v} value={typeof o === "string" ? o : o.v}>
          {typeof o === "string" ? o : o.l}
        </option>
      ))}
    </select>
  </div>
);

export const ModalActions = ({ onCancel, onSave, saveLabel = "Salvar", color = T.terra, onDelete }) => (
  <div style={{ display:"flex",gap:10,marginTop:8 }}>
    {onDelete && (
      <button onClick={onDelete} style={{ padding:"12px 14px",borderRadius:10,
        background:T.dangerBg,color:T.danger,fontSize:18 }}>🗑️</button>
    )}
    <button onClick={onCancel} style={{ flex:1,padding:"12px",borderRadius:10,
      fontSize:14,fontWeight:700,background:T.bgInput,color:T.textSub }}>Cancelar</button>
    <button onClick={onSave} style={{ flex:2,padding:"12px",borderRadius:10,
      fontSize:14,fontWeight:700,background:color,color:"#fff",
      boxShadow:`0 2px 10px ${color}55` }}>{saveLabel}</button>
  </div>
);
