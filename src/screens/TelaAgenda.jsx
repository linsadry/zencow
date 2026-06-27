import { useState, useMemo } from "react";
import { T } from "../constants/index.js";
import { MESES_FULL, WEEK_L } from "../utils/dates.js";
import { parseDate, daysUntil } from "../utils/dates.js";
import {
  Card, Pill, Modal, Input, Select, ModalActions,
} from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";
import { MascoteHeader } from "../components/primitives.jsx";

const now = new Date();
const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const CATEGORIAS = [
  { l: "Estudos",  cor: T.terra, bg: T.terraBg },
  { l: "Pets",     cor: T.blue,  bg: T.blueBg  },
  { l: "Beauty",   cor: T.rose,  bg: T.roseBg  },
  { l: "Skincare", cor: T.rose,  bg: T.roseBg  },
  { l: "Casa",     cor: T.moss,  bg: T.mossBg  },
  { l: "Looks",    cor: T.sand,  bg: T.sandBg  },
  { l: "Pessoal",  cor: T.lav,   bg: T.lavBg   },
];

const corPorCategoria = (cat) => {
  const c = CATEGORIAS.find((x) => x.l === cat);
  return c ? { cor: c.cor, bg: c.bg } : { cor: T.terra, bg: T.terraBg };
};

const formatDiaPrazo = (dia) => {
  if (dia === 0) return "Hoje";
  if (dia === 1) return "Amanhã";
  if (dia < 7)  return `Em ${dia} dias`;
  if (dia < 14) return `Em ${Math.floor(dia / 7)} sem`;
  return `Em ${dia}d`;
};

/* ── Modal de evento ── */
function EventoModal({ evento, onClose, onSave }) {
  const [form, setForm] = useState(
    evento || {
      titulo: "", hora: "09:00", durMin: 60,
      categoria: "Pessoal", recorrencia: "",
      cor: T.lav, bg: T.lavBg,
    },
  );

  const setCat = (cat) => {
    const { cor, bg } = corPorCategoria(cat);
    setForm((f) => ({ ...f, categoria: cat, cor, bg }));
  };

  return (
    <Modal title={evento ? "Editar Evento" : "Novo Evento"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        <Input label="Título" value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          placeholder="Ex: Banho do Bento" />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Input label="Horário" type="time" value={form.hora}
              onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))} />
          </div>
          <div style={{ flex: 1 }}>
            <Input label="Duração (min)" type="number" value={form.durMin}
              onChange={(e) => setForm((f) => ({ ...f, durMin: Number(e.target.value) || 30 }))} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: T.textMute, fontWeight: 700, marginBottom: 7, letterSpacing: 0.3 }}>
            CATEGORIA
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CATEGORIAS.map((c) => {
              const sel = form.categoria === c.l;
              return (
                <button key={c.l} onClick={() => setCat(c.l)} style={{
                  padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                  background: sel ? c.cor : c.bg, color: sel ? "#fff" : c.cor,
                  border: `1.5px solid ${sel ? c.cor : T.border}`,
                }}>
                  {c.l}
                </button>
              );
            })}
          </div>
        </div>

        <Select label="Recorrência" value={form.recorrencia || ""}
          onChange={(e) => setForm((f) => ({ ...f, recorrencia: e.target.value }))}
          options={[
            { v: "",              l: "Sem recorrência" },
            { v: "Diária",        l: "Diária"          },
            { v: "Semanal",       l: "Semanal"         },
            { v: "Mensal",        l: "Mensal"          },
            { v: "A cada 30 dias",l: "A cada 30 dias"  },
          ]}
        />

        <ModalActions
          onCancel={onClose}
          onSave={() => onSave(form)}
          color={T.terra}
          saveLabel={evento ? "Salvar" : "Adicionar"}
        />
      </div>
    </Modal>
  );
}

/* ── Tela principal ── */
export default function TelaAgenda({ agenda, setAgenda, onMenu }) {
  const [view,     setView]     = useState("mes");
  const [mesSel,   setMesSel]   = useState(now.getMonth());
  const [anoSel,   setAnoSel]   = useState(now.getFullYear());
  const [diaSel,   setDiaSel]   = useState(now.getDate());
  const [filtro,   setFiltro]   = useState("Todas");
  const [addModal, setAddModal] = useState(false);
  const [editEv,   setEditEv]   = useState(null);

  /* grade do mês */
  const primeiroDiaSemana = new Date(anoSel, mesSel, 1).getDay();
  const diasNoMes         = new Date(anoSel, mesSel + 1, 0).getDate();
  const cells = Array.from(
    { length: primeiroDiaSemana + diasNoMes },
    (_, i) => (i < primeiroDiaSemana ? null : i - primeiroDiaSemana + 1),
  );

  const eventosDia = useMemo(() => {
    const selDate = new Date(anoSel, mesSel, diaSel);
    const diff    = Math.round((selDate - baseDate) / 86400000);
    let evs = agenda.filter((e) => e.dia === diff);
    if (filtro !== "Todas") evs = evs.filter((e) => e.categoria === filtro);
    return evs.sort((a, b) => a.hora.localeCompare(b.hora));
  }, [agenda, mesSel, anoSel, diaSel, filtro]);

  const proximos = useMemo(() => {
    let p = agenda.filter((e) => e.dia >= 0 && e.dia <= 14);
    if (filtro !== "Todas") p = p.filter((e) => e.categoria === filtro);
    return p.sort((a, b) => a.dia - b.dia || a.hora.localeCompare(b.hora));
  }, [agenda, filtro]);

  const prevMes = () => {
    if (mesSel === 0) { setMesSel(11); setAnoSel((a) => a - 1); }
    else setMesSel((m) => m - 1);
  };
  const nextMes = () => {
    if (mesSel === 11) { setMesSel(0); setAnoSel((a) => a + 1); }
    else setMesSel((m) => m + 1);
  };

  const salvar = (form) => {
    if (editEv) {
      setAgenda((ag) => ag.map((e) => (e.id === editEv.id ? { ...e, ...form } : e)));
    } else {
      const selDate = new Date(anoSel, mesSel, diaSel);
      const diff    = Math.round((selDate - baseDate) / 86400000);
      setAgenda((ag) => [...ag, { id: Date.now(), ...form, dia: diff }]);
    }
    setEditEv(null);
    setAddModal(false);
  };

  const deletar = (id) => setAgenda((ag) => ag.filter((e) => e.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppHeader title="Agenda" onMenu={onMenu} />

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 100px" }}>
        <MascoteHeader secao="hoje" sub="Calendário e compromissos" />

        {/* Toggle visualização */}
        <div style={{ display: "flex", background: T.bgInput, borderRadius: 11, padding: 3, gap: 3, marginBottom: 14 }}>
          {[{ id: "mes", l: "📅 Mês" }, { id: "proximos", l: "⏰ Próximos" }].map((t) => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: view === t.id ? T.bgCard : "transparent",
              border: view === t.id ? `1px solid ${T.border}` : "none",
              color: view === t.id ? T.text : T.textMute,
            }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* Filtro de categorias */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
          {["Todas", ...CATEGORIAS.map((c) => c.l)].map((c) => (
            <button key={c} onClick={() => setFiltro(c)} style={{
              padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700,
              background: filtro === c ? T.terra : T.bgCard,
              color: filtro === c ? "#fff" : T.textSub,
              border: `1px solid ${filtro === c ? T.terra : T.border}`,
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {c}
            </button>
          ))}
        </div>

        {/* ── VISTA MÊS ── */}
        {view === "mes" && (
          <>
            {/* Navegação */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button onClick={prevMes} style={{
                width: 34, height: 34, borderRadius: 10,
                background: T.bgCard, border: `1px solid ${T.border}`,
                fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: T.textSub,
              }}>‹</button>
              <span className="serif" style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>
                {MESES_FULL[mesSel]} {anoSel}
              </span>
              <button onClick={nextMes} style={{
                width: 34, height: 34, borderRadius: 10,
                background: T.bgCard, border: `1px solid ${T.border}`,
                fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: T.textSub,
              }}>›</button>
            </div>

            {/* Grade */}
            <Card style={{ padding: "12px", marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
                {WEEK_L.map((l, i) => (
                  <div key={i} style={{ textAlign: "center", fontSize: 10, color: T.textMute, fontWeight: 700, padding: "3px 0" }}>{l}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                {cells.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const cellDate = new Date(anoSel, mesSel, d);
                  const diff     = Math.round((cellDate - baseDate) / 86400000);
                  const evs      = agenda.filter((e) => e.dia === diff && (filtro === "Todas" || e.categoria === filtro));
                  const dots     = [...new Set(evs.map((e) => e.cor))].slice(0, 3);
                  const isSel    = d === diaSel;
                  const isHoje   = d === now.getDate() && mesSel === now.getMonth() && anoSel === now.getFullYear();
                  return (
                    <button key={i} onClick={() => setDiaSel(d)} style={{
                      aspectRatio: "1", borderRadius: 10, fontSize: 13,
                      fontWeight: isSel ? 800 : 500,
                      background: isSel ? T.terra : "transparent",
                      color: isSel ? "#fff" : isHoje ? T.terra : T.text,
                      border: isHoje && !isSel ? `1.5px solid ${T.terra}` : "none",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 2,
                    }}>
                      <span>{d}</span>
                      {dots.length > 0 && (
                        <div style={{ display: "flex", gap: 2, height: 4, alignItems: "center" }}>
                          {dots.map((cor, ci) => (
                            <div key={ci} style={{
                              width: 4, height: 4, borderRadius: "50%",
                              background: isSel ? "rgba(255,255,255,.85)" : cor,
                            }} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Eventos do dia */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span className="serif" style={{ fontWeight: 700, fontSize: 16 }}>
                {diaSel} de {MESES_FULL[mesSel]} ({eventosDia.length})
              </span>
              <button onClick={() => { setEditEv(null); setAddModal(true); }} style={{
                padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: T.terra, color: "#fff",
                boxShadow: "0 2px 8px rgba(196,101,74,.3)",
              }}>
                + Evento
              </button>
            </div>

            {eventosDia.length === 0 ? (
              <Card style={{ padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: 13, color: T.textMute, fontStyle: "italic" }}>Nenhum evento neste dia 🌿</div>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {eventosDia.map((ev) => (
                  <Card key={ev.id} style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 5, height: 42, borderRadius: 99, background: ev.cor, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{ev.titulo}</span>
                          {ev.categoria && <Pill label={ev.categoria} color={ev.cor} bg={ev.bg} />}
                        </div>
                        <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>
                          {ev.hora} · {ev.durMin}min
                          {ev.recorrencia ? ` · ${ev.recorrencia}` : ""}
                        </div>
                      </div>
                      <button onClick={() => { setEditEv(ev); setAddModal(true); }} style={{ fontSize: 15, padding: 4 }}>✏️</button>
                      <button onClick={() => deletar(ev.id)} style={{ fontSize: 15, padding: 4 }}>🗑️</button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── VISTA PRÓXIMOS ── */}
        {view === "proximos" && (
          <>
            {proximos.length === 0 ? (
              <Card style={{ padding: "30px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🌿</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Nada à vista</div>
                <div style={{ fontSize: 12, color: T.textMute, fontStyle: "italic" }}>
                  Você não tem compromissos próximos
                </div>
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(() => {
                  let lastDia = -99;
                  return proximos.map((ev) => {
                    const showHeader = ev.dia !== lastDia;
                    lastDia = ev.dia;
                    return (
                      <div key={ev.id}>
                        {showHeader && (
                          <div style={{
                            fontSize: 11, color: T.textMute, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: 0.6,
                            marginTop: 6, marginBottom: 6,
                          }}>
                            {formatDiaPrazo(ev.dia)}
                          </div>
                        )}
                        <Card style={{ padding: "12px 14px", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 5, height: 42, borderRadius: 99, background: ev.cor, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 700 }}>{ev.titulo}</span>
                                {ev.categoria && <Pill label={ev.categoria} color={ev.cor} bg={ev.bg} />}
                              </div>
                              <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>
                                {ev.hora} · {ev.durMin}min
                              </div>
                            </div>
                            <button onClick={() => { setEditEv(ev); setAddModal(true); }} style={{ fontSize: 15, padding: 4 }}>✏️</button>
                            <button onClick={() => deletar(ev.id)} style={{ fontSize: 15, padding: 4 }}>🗑️</button>
                          </div>
                        </Card>
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            <button onClick={() => { setEditEv(null); setAddModal(true); }} style={{
              width: "100%", padding: "13px", borderRadius: 12, marginTop: 14,
              background: T.terra, color: "#fff", fontSize: 14, fontWeight: 700,
              boxShadow: "0 2px 12px rgba(196,101,74,.3)",
            }}>
              + Novo Evento
            </button>
          </>
        )}
      </div>

      {addModal && (
        <EventoModal
          evento={editEv}
          onClose={() => { setAddModal(false); setEditEv(null); }}
          onSave={salvar}
        />
      )}
    </div>
  );
}
