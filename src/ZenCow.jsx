import { useState, useEffect, useRef, useCallback } from "react";
import { T } from "./constants/theme.js";
import TelaHome     from "./screens/TelaHome.jsx";
import TelaPets     from "./screens/TelaPets.jsx";
import TelaCloset   from "./screens/TelaCloset.jsx";
import TelaBeauty   from "./screens/TelaBeauty.jsx";
import TelaCasa     from "./screens/TelaCasa.jsx";
import TelaMemorias from "./screens/TelaMemorias.jsx";

/* ── Supabase ─────────────────────────────────────────────────── */
const SUPABASE_URL = "https://uxkjvbjlsbgmbalokisf.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const DATA_ID      = "zencow-main";

const sbHeaders = () => ({
  apikey:        SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
});

/* ── Estado inicial ───────────────────────────────────────────── */
const INIT_STATE = {
  pets: [], petOpenId: null, pecas: [], looks: [],
  beautyProdutos: [], beautyDiario: [],
  tarefas: [], compras: [], manutencoes: [], memorias: [],
};

/* ── Nav config ───────────────────────────────────────────────── */
const NAV = [
  { id:"home",     label:"Início",   color: T.terra },
  { id:"pets",     label:"Pets",     color: T.blue  },
  { id:"closet",   label:"Closet",   color: T.sand  },
  { id:"beauty",   label:"Beauty",   color: T.rose  },
  { id:"casa",     label:"Casa",     color: T.moss  },
  { id:"memorias", label:"Memórias", color: T.lav   },
];

/* ── SVG Nav Icons ────────────────────────────────────────────── */
function NavIcon({ id, size = 20, color = "currentColor" }) {
  const s = { width:size, height:size, display:"block", flexShrink:0,
    fill:"none", stroke:color, strokeWidth:"1.8",
    strokeLinecap:"round", strokeLinejoin:"round" };
  switch (id) {
    case "home": return (
      <svg viewBox="0 0 24 24" style={s}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    );
    case "pets": return (
      <svg viewBox="0 0 24 24" style={s}>
        <path d="M10 5.17C10 3.78 8.42 2.68 6.5 3c-2.82.47-4.11 6-4 7 .08.7 1.73 1.72 3.66 1 1.26-.47 1.96-1.45 1.84-2.83"/>
        <path d="M14 5.17C14 3.78 15.58 2.68 17.5 3c2.82.47 4.11 6 4 7-.08.7-1.73 1.72-3.66 1-1.26-.47-1.96-1.45-1.84-2.83"/>
        <path d="M12 14c-6 0-6 3-6 3.5 0 1.4 2 2.5 6 2.5s6-1.1 6-2.5c0-.5 0-3.5-6-3.5z"/>
      </svg>
    );
    case "closet": return (
      <svg viewBox="0 0 24 24" style={s}>
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57A1 1 0 004 10h.19v10a2 2 0 002 2h11.62a2 2 0 002-2V10H20a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.19-2.13z"/>
      </svg>
    );
    case "beauty": return (
      <svg viewBox="0 0 24 24" style={s}>
        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.73V8h3a7 7 0 11-8 0h3V5.73A2 2 0 0110 4a2 2 0 012-2z"/>
        <path d="M9 8a5 5 0 100 10h6a5 5 0 000-10H9z"/>
      </svg>
    );
    case "casa": return (
      <svg viewBox="0 0 24 24" style={s}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <path d="M9 22V12h6v10"/>
      </svg>
    );
    case "memorias": return (
      <svg viewBox="0 0 24 24" style={s}>
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    );
    default: return null;
  }
}

/* ── Responsive hook ──────────────────────────────────────────── */
function useWindowSize() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── Global CSS ───────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes savepulse { from{opacity:.55} to{opacity:1} }
  @keyframes float-y   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  .fade-up  { animation: fadeUp .22s ease both }
  .float-y  { animation: float-y 3.2s ease-in-out infinite }
  .serif    { font-family: 'Fraunces', Georgia, serif }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent }
  button  { cursor: pointer; -webkit-appearance: none; background: none; border: none;
            padding: 0; font: inherit; }
  input, select, textarea { font-family: inherit }
  ::-webkit-scrollbar       { width: 4px }
  ::-webkit-scrollbar-thumb { background: ${T.borderMd}; border-radius: 99px }
  ::-webkit-scrollbar-track { background: transparent }
  .zc-navbtn:hover { background: rgba(0,0,0,.05) !important }
  .zc-card  { transition: box-shadow .2s ease, transform .2s ease }
  .zc-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.08) !important;
                   transform: translateY(-1px) }
`;

/* ── Componente principal ─────────────────────────────────────── */
export default function ZenCow() {
  const [tela,     setTela]     = useState("home");
  const [state,    setState]    = useState(INIT_STATE);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const saveTimer = useRef(null);
  const W         = useWindowSize();
  const isMobile  = W < 768;
  const isDesktop = W >= 1024;

  /* ── Load ── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(
          `${SUPABASE_URL}/rest/v1/zencow_data?id=eq.${DATA_ID}&select=data`,
          { headers: sbHeaders() }
        );
        const rows = await res.json();
        if (rows?.[0]?.data) {
          const d = rows[0].data;
          /* Garante que arrays permanecem arrays mesmo se DB tiver null */
          setState(prev => ({
            ...prev, ...d,
            pets:          Array.isArray(d?.pets)           ? d.pets           : prev.pets,
            pecas:         Array.isArray(d?.pecas)          ? d.pecas          : prev.pecas,
            looks:         Array.isArray(d?.looks)          ? d.looks          : prev.looks,
            beautyProdutos:Array.isArray(d?.beautyProdutos) ? d.beautyProdutos : prev.beautyProdutos,
            beautyDiario:  Array.isArray(d?.beautyDiario)   ? d.beautyDiario   : prev.beautyDiario,
            tarefas:       Array.isArray(d?.tarefas)        ? d.tarefas        : prev.tarefas,
            compras:       Array.isArray(d?.compras)        ? d.compras        : prev.compras,
            manutencoes:   Array.isArray(d?.manutencoes)    ? d.manutencoes    : prev.manutencoes,
            memorias:      Array.isArray(d?.memorias)       ? d.memorias       : prev.memorias,
          }));
        }
      } catch (e) { console.warn("ZenCow load:", e); }
      finally     { setLoading(false); }
    })();
  }, []);

  /* ── Persist ── */
  const persist = useCallback(async (snap) => {
    setSaving(true);
    try {
      const { petOpenId, ...p } = snap;
      await fetch(`${SUPABASE_URL}/rest/v1/zencow_data`, {
        method: "POST",
        headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ id: DATA_ID, data: p }),
      });
    } catch (e) { console.warn("ZenCow save:", e); }
    finally     { setSaving(false); }
  }, []);

  const update = useCallback((patch) => {
    setState(prev => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => persist(next), 1500);
      return next;
    });
  }, [persist]);

  const mk = k => fn =>
    update(prev => ({ ...prev, [k]: typeof fn === "function" ? fn(prev[k]) : fn }));

  const setPets           = mk("pets");
  const setPecas          = mk("pecas");
  const setLooks          = mk("looks");
  const setBeautyProdutos = mk("beautyProdutos");
  const setBeautyDiario   = mk("beautyDiario");
  const setTarefas        = mk("tarefas");
  const setCompras        = mk("compras");
  const setManutencoes    = mk("manutencoes");
  const setMemorias       = mk("memorias");
  const setPetOpenId      = id => setState(prev => ({ ...prev, petOpenId: id }));
  /* No desktop a sidebar é sempre visível; hamburger é no-op */
  const onMenu = () => { if (isMobile) setMenuOpen(true); };

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) return (
    <div style={{
      height:"100dvh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background: T.bgPage,
    }}>
      <style>{GLOBAL_CSS}</style>
      <img src="/cow-zen.png" alt="" className="float-y"
        onError={e => { e.target.style.display = "none"; }}
        style={{ width:96, height:96, objectFit:"contain", marginBottom:16 }}/>
      <div className="serif"
        style={{ fontSize:24, fontWeight:700, color:T.text, letterSpacing:-.5 }}>
        ZenCow
      </div>
      <div style={{ fontSize:13, color:T.textMute, marginTop:6, fontStyle:"italic" }}>
        preparando a fazenda…
      </div>
    </div>
  );

  /* ── Screens ──────────────────────────────────────────────── */
  const screens = (
    <>
      {tela === "home"     && <TelaHome state={state} update={update}
                                pets={state.pets} pecas={state.pecas}
                                memorias={state.memorias} onMenu={onMenu}/>}
      {tela === "pets"     && <TelaPets pets={state.pets || []} setPets={setPets}
                                petOpenId={state.petOpenId} setPetOpenId={setPetOpenId}
                                onMenu={onMenu}/>}
      {tela === "closet"   && <TelaCloset pecas={state.pecas} setPecas={setPecas}
                                looks={state.looks} setLooks={setLooks}
                                onMenu={onMenu}/>}
      {tela === "beauty"   && <TelaBeauty produtos={state.beautyProdutos}
                                setProdutos={setBeautyProdutos}
                                diario={state.beautyDiario} setDiario={setBeautyDiario}
                                onMenu={onMenu}/>}
      {tela === "casa"     && <TelaCasa tarefas={state.tarefas} setTarefas={setTarefas}
                                compras={state.compras} setCompras={setCompras}
                                manutencoes={state.manutencoes} setManutencoes={setManutencoes}
                                onMenu={onMenu}/>}
      {tela === "memorias" && <TelaMemorias memorias={state.memorias}
                                setMemorias={setMemorias} onMenu={onMenu}/>}
    </>
  );

  const savingBar = saving && (
    <div style={{
      position:"fixed", top:0, left:0, right:0, height:2, zIndex:9999,
      background:`linear-gradient(90deg,${T.terra},${T.sand},${T.moss})`,
      animation:"savepulse 1s ease-in-out infinite alternate",
    }}/>
  );

  /* ── Desktop layout ───────────────────────────────────────── */
  if (!isMobile) return (
    <div style={{ height:"100dvh", display:"flex", background:T.bgPage, overflow:"hidden" }}>
      <style>{GLOBAL_CSS}</style>
      {savingBar}

      {/* Sidebar */}
      <aside style={{
        width: isDesktop ? 244 : 200,
        flexShrink:0,
        background: T.bgCard,
        borderRight: `1px solid ${T.border}`,
        display:"flex", flexDirection:"column",
        overflow:"hidden",
      }}>
        {/* Marca */}
        <div style={{ padding:"26px 18px 18px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{
              width:42, height:42, borderRadius:13, flexShrink:0,
              background:`linear-gradient(135deg,${T.terraBg},${T.sandBg})`,
              border:`1px solid ${T.border}`,
              overflow:"hidden",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <img src="/cow-zen.png" alt=""
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
                onError={e => { e.target.style.display="none"; }}/>
            </div>
            <div>
              <div className="serif"
                style={{ fontSize:16, fontWeight:700, color:T.text, lineHeight:1.1 }}>
                ZenCow
              </div>
              <div style={{ fontSize:10, color:T.textMute, marginTop:1, letterSpacing:.2 }}>
                minha pequena fazenda
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{
          flex:1, padding:"10px 8px",
          display:"flex", flexDirection:"column", gap:2,
          overflowY:"auto",
        }}>
          {NAV.map(n => {
            const active = tela === n.id;
            return (
              <button key={n.id} className="zc-navbtn" onClick={() => setTela(n.id)}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"9px 11px", borderRadius:10, textAlign:"left",
                  background: active ? `${n.color}18` : "transparent",
                  border:     active ? `1px solid ${n.color}28` : "1px solid transparent",
                  color:      active ? n.color : T.textSub,
                }}>
                <NavIcon id={n.id} size={16} color={active ? n.color : T.textSub}/>
                <span style={{ fontSize:13, fontWeight:active ? 700 : 500 }}>
                  {n.label}
                </span>
                {active && (
                  <div style={{
                    marginLeft:"auto", width:5, height:5,
                    borderRadius:"50%", background:n.color, flexShrink:0,
                  }}/>
                )}
              </button>
            );
          })}
        </nav>

        {/* Rodapé sidebar */}
        <div style={{ padding:"12px 16px 20px", borderTop:`1px solid ${T.border}` }}>
          {saving ? (
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{
                width:6, height:6, borderRadius:"50%", background:T.moss,
                animation:"savepulse 1s ease-in-out infinite alternate",
              }}/>
              <span style={{ fontSize:11, color:T.textMute }}>salvando…</span>
            </div>
          ) : (
            <p style={{
              fontSize:11, color:T.textMute, fontStyle:"italic",
              lineHeight:1.6, textAlign:"center", margin:0,
            }}>
              "vida simples,<br/>coração cheio"
            </p>
          )}
          {/* Vaquinha decorativa — coloque /cow-knitting.png em /public */}
          <img src="/cow-knitting.png" alt=""
            onError={e => e.target.style.display="none"}
            style={{
              width:"80%", maxWidth:108,
              margin:"12px auto 0", display:"block",
              objectFit:"contain",
            }}/>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {screens}
      </main>
    </div>
  );

  /* ── Mobile layout ────────────────────────────────────────── */
  return (
    <div style={{
      height:"100dvh", display:"flex", flexDirection:"column",
      background: T.bgPage,
      position:"relative", overflow:"hidden",
    }}>
      <style>{GLOBAL_CSS}</style>
      {savingBar}

      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {screens}
      </div>

      {/* Bottom nav */}
      <nav style={{
        display:"flex",
        background: T.bgCard,
        borderTop: `1px solid ${T.border}`,
        paddingBottom: "env(safe-area-inset-bottom)",
        flexShrink:0, zIndex:100,
      }}>
        {NAV.map(n => {
          const active = tela === n.id;
          return (
            <button key={n.id} onClick={() => setTela(n.id)} style={{
              flex:1, padding:"8px 2px 6px",
              display:"flex", flexDirection:"column",
              alignItems:"center", gap:3,
              color: active ? n.color : T.textMute,
            }}>
              <NavIcon id={n.id} size={19} color={active ? n.color : T.textMute}/>
              <span style={{
                fontSize:9, fontWeight:700,
                letterSpacing:.3, textTransform:"uppercase",
              }}>
                {n.label}
              </span>
              {active && (
                <div style={{ width:16, height:2, borderRadius:99, background:n.color }}/>
              )}
            </button>
          );
        })}
      </nav>

      {/* Menu deslizante (mobile) */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{
            position:"absolute", inset:0,
            background:"rgba(0,0,0,.4)", zIndex:200,
          }}/>
          <div style={{
            position:"absolute", top:0, left:0, bottom:0, width:"72%",
            background:T.bgCard, zIndex:201,
            padding:"52px 16px 24px",
            display:"flex", flexDirection:"column", gap:3,
          }}>
            <div style={{
              display:"flex", alignItems:"center", gap:10, marginBottom:14,
            }}>
              <NavIcon id="home" size={20} color={T.terra}/>
              <div className="serif"
                style={{ fontSize:20, fontWeight:700, color:T.text }}>
                ZenCow
              </div>
            </div>
            {NAV.map(n => (
              <button key={n.id}
                onClick={() => { setTela(n.id); setMenuOpen(false); }}
                style={{
                  display:"flex", alignItems:"center", gap:11,
                  padding:"10px 12px", borderRadius:12, textAlign:"left",
                  background: tela===n.id ? `${n.color}15` : "transparent",
                  border:     tela===n.id ? `1px solid ${n.color}25` : "none",
                  color:      tela===n.id ? n.color : T.text,
                }}>
                <NavIcon id={n.id} size={16} color={tela===n.id ? n.color : T.textSub}/>
                <span style={{ fontSize:14, fontWeight:tela===n.id ? 700 : 500 }}>
                  {n.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
