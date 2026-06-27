import { useMemo } from "react";
import { T } from "../constants/index.js";
import { MASCOTES, COW_IMG } from "../constants/mascotes.js";
import {
  COW_FLORA, COW_MARGARIDA, COW_CAMELIA,
  COW_ESTRELA, COW_MIMOSA,
} from "../constants/images.js";
import { parseDate, daysSince, daysUntil, formatDays, alertLevel } from "../utils/dates.js";
import { getAllPetAlerts } from "../utils/pets.js";
import { Card, Pill } from "../components/primitives.jsx";
import AppHeader from "../components/AppHeader.jsx";

const now = new Date();

export default function TelaHoje({
  agenda, pets,
  looks, makes,
  skDiario, skProdutos,
  sitioProjetos, casaTarefas,
  onMenu, onNavPet, onNav,
  nomeUsuario,
}) {
  const hora = now.getHours();
  const cumprimento = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const m = MASCOTES.hoje;
  const falaFlora = useMemo(
    () => m.saudacoes[Math.floor(Math.random() * m.saudacoes.length)],
    [],
  );

  const alertasPets = getAllPetAlerts(pets).slice(0, 3);

  /* ── Camélia recomenda ── */
  const camRecomenda = useMemo(() => {
    if (skDiario.length === 0)
      return { texto: "Que tal registrar uma nova foto da pele?", cta: "Ir para Skincare", emoji: "📸" };

    const ultimo = skDiario[skDiario.length - 1];
    const diasUlt = daysSince(ultimo.data);
    if (diasUlt !== null && diasUlt >= 12)
      return { texto: `Você não registra a pele há ${diasUlt} dias.`, cta: "Registrar foto", emoji: "📸" };

    const longo = skProdutos.find((p) => !p.fim && p.inicio && daysSince(p.inicio) >= 30);
    if (longo)
      return { texto: `Já faz ${daysSince(longo.inicio)} dias usando ${longo.nome}.`, cta: "Ver evolução", emoji: "✨" };

    return { texto: "Vamos cuidar da pele hoje?", cta: "Ir para Skincare", emoji: "🧴" };
  }, [skDiario, skProdutos]);

  /* ── Memória do dia ── */
  const memoriaDoDia = useMemo(() => {
    const all = [];

    pets.forEach((p) =>
      (p.galeria || []).forEach((g) => {
        const d = parseDate(g.data);
        if (d) all.push({ data: d, dataStr: g.data, foto: g.foto, tipo: "Pet", sub: p.nome });
      }),
    );
    looks.forEach((l) => {
      const d = parseDate(l.data);
      if (d && l.foto) all.push({ data: d, dataStr: l.data, foto: l.foto, tipo: "Look", sub: l.titulo || l.ocasiao });
    });
    makes.forEach((mk) => {
      const d = parseDate(mk.data);
      if (d && mk.foto) all.push({ data: d, dataStr: mk.data, foto: mk.foto, tipo: "Make", sub: mk.titulo });
    });
    skDiario.forEach((s) => {
      const d = parseDate(s.data);
      if (d && s.fotoFrontal) all.push({ data: d, dataStr: s.data, foto: s.fotoFrontal, tipo: "Pele", sub: "Diário" });
    });
    sitioProjetos.forEach((p) =>
      (p.fotos || []).forEach((foto) =>
        all.push({ data: new Date(now - 60 * 86400000), dataStr: "Sítio", foto, tipo: "Sítio", sub: p.texto }),
      ),
    );

    if (all.length === 0) return null;

    const sorted = all.sort((a, b) => a.data - b.data);
    const pick = sorted[Math.floor(Math.random() * sorted.length)];
    const dias = Math.floor((now - pick.data) / 86400000);
    let recencia;
    if (dias <= 7)        recencia = "Esta semana";
    else if (dias <= 30)  recencia = "Há 30 dias";
    else if (dias <= 90)  recencia = "Há 3 meses";
    else if (dias <= 180) recencia = "Há 6 meses";
    else if (dias <= 365) recencia = "Há 1 ano";
    else                  recencia = `Há ${Math.floor(dias / 365)} anos`;
    return { ...pick, recencia };
  }, [pets, looks, makes, skDiario, sitioProjetos]);

  /* ── Evolução da fazenda ── */
  const evolucao = useMemo(() => {
    const items = [];

    const retinol = skProdutos.find((p) => !p.fim && /retinol/i.test(p.nome));
    if (retinol?.inicio) {
      const d = daysSince(retinol.inicio);
      items.push({ emoji: "🧴", titulo: "Retinol", valor: `${d} dias`, sub: "de acompanhamento", cor: T.rose, bg: T.roseBg });
    }
    if (skDiario.length > 0)
      items.push({ emoji: "📸", titulo: "Fotos da pele", valor: `${skDiario.length}`, sub: "registros", cor: T.rose, bg: T.roseBg });

    const totalVacinas = pets.reduce((s, p) => s + p.vacinas.length, 0);
    if (totalVacinas > 0) {
      const emDia = pets.reduce(
        (s, p) => s + p.vacinas.filter((v) => { const d = daysUntil(v.proxima); return d === null || d > 7; }).length,
        0,
      );
      items.push({ emoji: "🐾", titulo: "Pets", valor: `${emDia}/${totalVacinas}`, sub: "vacinas em dia", cor: T.blue, bg: T.blueBg });
    }

    const sitioConcl = sitioProjetos.filter((p) => p.feita).length;
    if (sitioConcl > 0)
      items.push({ emoji: "🌳", titulo: "Sítio", valor: `${sitioConcl}`, sub: "tarefas concluídas", cor: T.moss, bg: T.mossBg });
    if (looks.length > 0)
      items.push({ emoji: "👗", titulo: "Closet", valor: `${looks.length}`, sub: "looks registrados", cor: T.sand, bg: T.sandBg });
    if (makes.length > 0)
      items.push({ emoji: "💄", titulo: "Beauty", valor: `${makes.length}`, sub: "makes no diário", cor: T.rose, bg: T.roseBg });

    return items;
  }, [pets, looks, makes, skDiario, skProdutos, sitioProjetos]);

  /* ── Render ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppHeader title="ZenCow" showLogo onMenu={onMenu} />

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 100px" }}>

        {/* 1. Flora — saudação */}
        <Card style={{
          padding: "18px 16px", marginBottom: 14,
          background: `linear-gradient(135deg, ${T.terraBg} 0%, ${T.bgCard} 100%)`,
          border: `1px solid ${T.terra}22`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={m.img} alt="Flora" className="float-y" style={{
              width: 84, height: 84, objectFit: "contain", flexShrink: 0,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,.15))",
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, textTransform: "capitalize", letterSpacing: 0.3 }}>
                {now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: T.text, marginTop: 2, letterSpacing: -0.5, lineHeight: 1.1 }}>
                {cumprimento}{nomeUsuario ? `, ${nomeUsuario}` : ""}
              </div>
              <div style={{ fontSize: 12, color: T.terra, fontStyle: "italic", marginTop: 6, lineHeight: 1.4, fontWeight: 600 }}>
                "{falaFlora}"
              </div>
              <div style={{ fontSize: 10, color: T.textMute, marginTop: 2 }}>— Flora</div>
            </div>
          </div>
        </Card>

        {/* 2. Margarida — alertas de pets */}
        {alertasPets.length > 0 ? (
          <Card style={{
            padding: "14px 14px", marginBottom: 14,
            background: alertasPets[0].nivel === "danger" ? T.dangerBg : T.alertBg,
            border: `1px solid ${alertasPets[0].nivel === "danger" ? T.danger : T.alert}33`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <img src={COW_MARGARIDA} alt="" style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 17, fontWeight: 700, color: T.text }}>Margarida lembra</div>
                <div style={{ fontSize: 11, color: T.textMute, fontStyle: "italic", marginTop: 1 }}>"Os bichinhos precisam de atenção"</div>
              </div>
            </div>
            {alertasPets.map((a, i) => {
              const cor = a.nivel === "danger" ? T.danger : T.alert;
              return (
                <button key={i} onClick={() => onNavPet(a.petId)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "8px 0", borderTop: `1px solid ${cor}22`, textAlign: "left",
                }}>
                  {a.foto
                    ? <img src={a.foto} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${cor}33` }} />
                    : <div style={{ width: 32, height: 32, borderRadius: "50%", background: cor + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🐕</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{a.pet}</div>
                    <div style={{ fontSize: 11, color: T.textMute, marginTop: 1 }}>{a.tipo}: {a.nome}</div>
                  </div>
                  <Pill label={formatDays(a.dias)} color={cor} bg="#fff" />
                </button>
              );
            })}
          </Card>
        ) : pets.length > 0 && (
          <Card style={{ padding: "12px 14px", marginBottom: 14, background: T.mossBg, border: `1px solid ${T.moss}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={COW_MARGARIDA} alt="" style={{ width: 36, height: 36, objectFit: "contain" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Pets em dia ✓</div>
                <div style={{ fontSize: 11, color: T.textMute, fontStyle: "italic" }}>"Tudo certo com os bichinhos hoje"</div>
              </div>
              <button onClick={() => onNav("pets")} style={{ fontSize: 11, color: T.moss, fontWeight: 700 }}>ver →</button>
            </div>
          </Card>
        )}

        {/* 3. Camélia — autocuidado */}
        <Card style={{ padding: "14px 14px", marginBottom: 14, background: T.roseBg, border: `1px solid ${T.rose}33` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={COW_CAMELIA} alt="" className="float-y" style={{
              width: 60, height: 60, objectFit: "contain", flexShrink: 0,
              filter: "drop-shadow(0 3px 8px rgba(0,0,0,.12))",
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: T.rose, marginBottom: 3 }}>
                Camélia recomenda {camRecomenda.emoji}
              </div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.4, marginBottom: 8 }}>
                {camRecomenda.texto}
              </div>
              <button onClick={() => onNav("beauty")} style={{
                padding: "6px 14px", borderRadius: 99,
                background: T.rose, color: "#fff", fontSize: 12, fontWeight: 700,
                boxShadow: "0 2px 8px rgba(176,122,122,.3)",
              }}>
                {camRecomenda.cta}
              </button>
            </div>
          </div>
        </Card>

        {/* 4. Memória do dia */}
        {memoriaDoDia && (
          <Card style={{
            padding: "14px 14px", marginBottom: 14,
            background: `linear-gradient(135deg, ${T.lavBg} 0%, ${T.bgCard} 100%)`,
            border: `1px solid ${T.lav}33`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src={COW_MIMOSA} alt="" style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 17, fontWeight: 700, color: T.lav }}>Memória do dia</div>
                <div style={{ fontSize: 11, color: T.textMute, fontStyle: "italic", marginTop: 1 }}>"Olha essa lembrança..."</div>
              </div>
              <Pill label={memoriaDoDia.recencia} color={T.lav} bg="#fff" />
            </div>
            <button onClick={() => onNav("memorias")} style={{
              display: "block", width: "100%", borderRadius: 14, overflow: "hidden",
              border: `2px solid ${T.lav}44`, background: T.bgCard, padding: 0,
            }}>
              <div style={{ aspectRatio: "4/3", overflow: "hidden", background: T.bgInput, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={memoriaDoDia.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "10px 14px", textAlign: "left", background: T.bgCard }}>
                <div style={{ fontSize: 12, color: T.lav, fontWeight: 800, letterSpacing: 0.3 }}>{memoriaDoDia.tipo.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{memoriaDoDia.sub}</div>
                <div style={{ fontSize: 11, color: T.textMute, marginTop: 1 }}>{memoriaDoDia.dataStr}</div>
              </div>
            </button>
          </Card>
        )}

        {/* 5. Evolução da fazenda */}
        {evolucao.length > 0 && (
          <Card style={{ padding: "14px 14px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <img src={COW_ESTRELA} alt="" style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: T.moss }}>Evolução da fazenda</div>
                <div style={{ fontSize: 11, color: T.textMute, fontStyle: "italic" }}>"Pequenos passos, grandes colheitas"</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {evolucao.map((it, i) => (
                <div key={i} style={{
                  flexShrink: 0, minWidth: 120, padding: "11px 12px",
                  borderRadius: 12, background: it.bg, border: `1px solid ${it.cor}22`,
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{it.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: 0.3, textTransform: "uppercase" }}>{it.titulo}</div>
                  <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: it.cor, marginTop: 2, letterSpacing: -0.3 }}>{it.valor}</div>
                  <div style={{ fontSize: 10, color: T.textSub, marginTop: 1 }}>{it.sub}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 6. Atalhos rápidos */}
        <Card style={{ padding: "14px 14px" }}>
          <div className="serif" style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: T.text }}>Atalhos rápidos</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { id: "closet",   label: "Novo look",   cor: T.sand, bg: T.sandBg, emoji: "👗" },
              { id: "beauty",   label: "Nova make",   cor: T.rose, bg: T.roseBg, emoji: "💄" },
              { id: "beauty",   label: "Foto pele",   cor: T.rose, bg: T.roseBg, emoji: "📸" },
              { id: "pets",     label: "Pets",        cor: T.blue, bg: T.blueBg, emoji: "🐾" },
              { id: "casa",     label: "Casa & Sítio",cor: T.moss, bg: T.mossBg, emoji: "🏡" },
              { id: "memorias", label: "Memórias",    cor: T.lav,  bg: T.lavBg,  emoji: "💫" },
            ].map((a, i) => (
              <button key={i} onClick={() => onNav(a.id)} style={{
                padding: "14px 6px", borderRadius: 14,
                background: a.bg, border: `1px solid ${a.cor}22`,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 26 }}>{a.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: a.cor }}>{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
