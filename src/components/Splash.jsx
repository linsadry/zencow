import { T } from "../constants/index.js";
import { LOGO } from "../constants/images.js";
import { MASCOTES } from "../constants/mascotes.js";

export default function Splash({ onDone }) {
  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: T.bgPage, padding: 24,
    }}>
      <img
        src={LOGO} alt=""
        style={{
          width: 120, height: 120, borderRadius: 32, objectFit: "cover",
          boxShadow: "0 12px 40px rgba(0,0,0,.13)", marginBottom: 22,
        }}
      />

      <div className="serif" style={{
        fontSize: 42, fontWeight: 700, color: T.terra, letterSpacing: -0.8,
      }}>
        ZenCow
      </div>

      <div style={{
        fontSize: 14, color: T.textSub, marginTop: 6,
        fontStyle: "italic", textAlign: "center",
        maxWidth: 280, lineHeight: 1.4,
      }}>
        Minha pequena fazenda da vida
      </div>

      {/* Vaquinhas flutuando */}
      <div style={{
        marginTop: 38, marginBottom: 24,
        display: "flex", gap: 10, justifyContent: "center",
      }}>
        {Object.values(MASCOTES).map((m) => (
          <img
            key={m.nome}
            src={m.img}
            alt={m.nome}
            className="float-y"
            style={{ width: 32, height: 32, objectFit: "contain", opacity: 0.55 }}
          />
        ))}
      </div>

      <button
        onClick={onDone}
        style={{
          padding: "13px 52px", borderRadius: 99,
          background: T.terra, color: "#fff",
          fontSize: 15, fontWeight: 700,
          boxShadow: "0 4px 20px rgba(196,101,74,.35)",
        }}
      >
        Entrar
      </button>
    </div>
  );
}
