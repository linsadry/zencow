import { T } from "../constants/index.js";
import { MASCOTES } from "../constants/mascotes.js";

/* ── SVG icon helper (mapeia emojis → SVG) ─────────────────────── */
function SvgIcon({ name, size = 14, color = "currentColor" }) {
  const emojiMap = { "🗑️":"trash", "✏️":"pencil", "📷":"camera", "🔔":"bell",
                     "🐾":"paw",   "⚠️":"alert",  "➕":"plus",   "✕":"x"    };
  const key = emojiMap[name] || name;

  const defs = {
    trash:  <><polyline points="3 6 5 6 21 6"/>
               <path d="M19 6l-1 14H6L5 6"/>
               <path d="M9 6V4h6v2"/>
               <line x1="10" y1="11" x2="10" y2="17"/>
               <line x1="14" y1="11" x2="14" y2="17"/></>,
    pencil: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
               <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/></>,
    camera: <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
               <circle cx="12" cy="13" r="4"/></>,
    bell:   <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
               <path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    paw:    <><circle cx="4.5" cy="9.5" r="2"/>
               <circle cx="9"   cy="4.5" r="2"/>
               <circle cx="15"  cy="4.5" r="2"/>
               <circle cx="19.5" cy="9.5" r="2"/>
               <path d="M12 14c-2.5 0-4 1-4 3s2 3 4 3 4-1 4-3-1.5-3-4-3z"/></>,
    alert:  <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
               <line x1="12" y1="9"  x2="12"   y2="13"/>
               <line x1="12" y1="17" x2="12.01" y2="17"/></>,
    plus:   <><line x1="12" y1="5" x2="12" y2="19"/>
               <line x1="5"  y1="12" x2="19" y2="12"/></>,
    x:      <><line x1="18" y1="6" x2="6"  y2="18"/>
               <line x1="6"  y1="6" x2="18" y2="18"/></>,
    chevR:  <polyline points="9 18 15 12 9 6"/>,
    eye:    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
               <circle cx="12" cy="12" r="3"/></>,
  };

  if (!defs[key]) {
    /* fallback: renderiza o emoji original dentro de um span */
    return <span style={{ fontSize:size, lineHeight:1 }}>{name}</span>;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      style={{
        width:size, height:size, display:"block", flexShrink:0,
        fill:"none", stroke:color, strokeWidth:"1.8",
        strokeLinecap:"round", strokeLinejoin:"round",
      }}
    >
      {defs[key]}
    </svg>
  );
}

/* ── Card ────────────────────────────────────────────────────────── */
export const Card = ({ children, style = {} }) => (
  <div
    className="zc-card"
    style={{
      background:  T.bgCard,
      borderRadius: 18,
      border:      `1px solid ${T.border}`,
      boxShadow:   "0 1px 8px rgba(0,0,0,.04)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Pill ────────────────────────────────────────────────────────── */
export const Pill = ({ label, color, bg }) => (
  <span style={{
    fontSize:11, fontWeight:700, color,
    background:  bg || "transparent",
    borderRadius: 99, padding:"3px 10px",
    whiteSpace:  "nowrap", letterSpacing:.15,
  }}>
    {label}
  </span>
);

/* ── IconBtn ─────────────────────────────────────────────────────── */
export const IconBtn = ({ icon, onClick, color = T.textMute, size = 15 }) => (
  <button
    onClick={onClick}
    style={{
      padding:5, lineHeight:1, borderRadius:6,
      display:"flex", alignItems:"center", justifyContent:"center",
      color, transition:"background .15s ease",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.07)"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
  >
    <SvgIcon name={icon} size={size} color={color}/>
  </button>
);

/* ── Modal ───────────────────────────────────────────────────────── */
export const Modal = ({ title, children, onClose }) => {
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
  return (
    <div
      style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,.45)",
        zIndex:600, display:"flex",
        alignItems:    isDesktop ? "center"   : "flex-end",
        justifyContent: "center",
        padding:       isDesktop ? "20px"     : 0,
      }}
      onClick={onClose}
    >
      <div
        className="fade-up"
        onClick={e => e.stopPropagation()}
        style={{
          width:"100%",
          maxWidth:    isDesktop ? 480         : 430,
          background:  T.bgCard,
          borderRadius:isDesktop ? 22          : "22px 22px 0 0",
          padding:     isDesktop ? "28px 28px 32px" : "20px 20px 38px",
          maxHeight:"85vh", overflowY:"auto",
          boxShadow:"0 20px 60px rgba(0,0,0,.12)",
        }}
      >
        {/* Handle bar só no mobile */}
        {!isDesktop && (
          <div style={{
            width:36, height:4, borderRadius:99,
            background:T.borderMd, margin:"0 auto 16px",
          }}/>
        )}
        {title && (
          <div className="serif" style={{
            fontWeight:700, fontSize:20, marginBottom:16, color:T.text,
          }}>
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

/* ── Input ───────────────────────────────────────────────────────── */
export const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    {label && (
      <div style={{
        fontSize:11, color:T.textMute, fontWeight:700,
        marginBottom:5, letterSpacing:.3,
      }}>
        {label.toUpperCase()}
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width:"100%", padding:"11px 14px", borderRadius:10,
        border:`1px solid ${T.border}`, background:T.bgInput,
        fontSize:14, color:T.text, outline:"none",
        transition:"border-color .15s ease, box-shadow .15s ease",
      }}
      onFocus={e => {
        e.target.style.borderColor = T.terra;
        e.target.style.boxShadow   = `0 0 0 3px ${T.terraBg}`;
      }}
      onBlur={e => {
        e.target.style.borderColor = T.border;
        e.target.style.boxShadow   = "none";
      }}
    />
  </div>
);

/* ── Select ──────────────────────────────────────────────────────── */
export const Select = ({ label, value, onChange, options }) => (
  <div>
    {label && (
      <div style={{
        fontSize:11, color:T.textMute, fontWeight:700,
        marginBottom:5, letterSpacing:.3,
      }}>
        {label.toUpperCase()}
      </div>
    )}
    <select
      value={value}
      onChange={onChange}
      style={{
        width:"100%", padding:"10px 12px", borderRadius:10,
        border:`1px solid ${T.border}`, background:T.bgInput,
        fontSize:13, color:T.text, outline:"none",
      }}
    >
      {options.map(o => (
        <option key={typeof o === "string" ? o : o.v} value={typeof o === "string" ? o : o.v}>
          {typeof o === "string" ? o : o.l}
        </option>
      ))}
    </select>
  </div>
);

/* ── ModalActions ────────────────────────────────────────────────── */
export const ModalActions = ({ onCancel, onSave, saveLabel = "Salvar", color = T.terra, onDelete }) => (
  <div style={{ display:"flex", gap:10, marginTop:8 }}>
    {onDelete && (
      <button
        onClick={onDelete}
        style={{
          padding:"11px 14px", borderRadius:10,
          background:T.dangerBg, color:T.danger,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"filter .15s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.filter="brightness(.93)"}
        onMouseLeave={e => e.currentTarget.style.filter="none"}
      >
        <SvgIcon name="trash" size={16} color={T.danger}/>
      </button>
    )}
    <button
      onClick={onCancel}
      style={{
        flex:1, padding:"12px", borderRadius:10,
        fontSize:14, fontWeight:700,
        background:T.bgInput, color:T.textSub,
        transition:"background .15s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.background = T.border}
      onMouseLeave={e => e.currentTarget.style.background = T.bgInput}
    >
      Cancelar
    </button>
    <button
      onClick={onSave}
      style={{
        flex:2, padding:"12px", borderRadius:10,
        fontSize:14, fontWeight:700,
        background:color, color:"#fff",
        boxShadow:`0 2px 10px ${color}55`,
        transition:"opacity .15s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity=".86"}
      onMouseLeave={e => e.currentTarget.style.opacity="1"}
    >
      {saveLabel}
    </button>
  </div>
);

/* ── MascoteHeader ───────────────────────────────────────────────── */
export const MascoteHeader = ({ secao, sub }) => {
  const m = MASCOTES[secao];
  if (!m) return null;
  const fala = m.saudacoes[Math.floor(Math.random() * m.saudacoes.length)];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
      <img
        src={m.img} alt={m.nome}
        className="float-y"
        style={{
          width:72, height:72, objectFit:"contain", flexShrink:0,
          filter:"drop-shadow(0 4px 10px rgba(0,0,0,.12))",
        }}
      />
      <div style={{ flex:1, minWidth:0 }}>
        <div className="serif" style={{
          fontSize:24, fontWeight:700, color:m.cor,
          letterSpacing:-.4, lineHeight:1.1,
        }}>
          {m.nome}
        </div>
        <div style={{
          fontSize:12, color:T.textSub, marginTop:3,
          fontStyle:"italic", lineHeight:1.4,
        }}>
          "{fala}"
        </div>
        {sub && (
          <div style={{
            fontSize:11, color:T.textMute, marginTop:3,
            fontWeight:600, letterSpacing:.3, textTransform:"uppercase",
          }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
};
