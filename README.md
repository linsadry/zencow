# ZenCow 3.1 · Guia de Deploy

> 🐮 Minha pequena fazenda da vida
> Stack: React 18 + Vite + Supabase + Cloudflare Pages
> Repositório alvo: `linsadry/zencow`

---

## 📋 Checklist de deploy (fluxo iPad)

### Parte 1 — Supabase (5 minutos)

1. Abrir **Supabase Dashboard** → Projeto `uxkjvbjlsbgmbalokisf` ("iryx-financas" não, esse é seu projeto principal de personal apps)
2. SQL Editor → **New query** → cole o conteúdo de `supabase/schema.sql` → **Run**
3. Verifique se rodou sem erro:
   ```sql
   SELECT * FROM public.zencow_state;
   -- Deve mostrar 1 linha com user_id = 'drika'
   ```
4. Vá em **Settings → API** e copie a **anon public key**
5. Cole essa anon key em `src/supabaseClient.js`, na linha:
   ```js
   const SUPABASE_ANON_KEY = 'COLE_AQUI_SUA_ANON_KEY';
   ```

---

### Parte 2 — GitHub (10 minutos)

1. Abrir **github.com** no Safari/Chrome
2. Criar repositório **linsadry/zencow** (privado ou público — sua escolha)
3. No GitHub web editor (sem CLI), suba toda a pasta `zencow_deploy/` com a seguinte estrutura:
   ```
   zencow/
   ├── .github/
   │   ├── workflows/
   │   │   └── backup.yml
   │   └── scripts/
   │       └── backup.py
   ├── public/
   │   └── manifest.json
   ├── src/
   │   ├── App.jsx
   │   ├── ZenCow.jsx       ← arquivo principal (já com anon key colada)
   │   ├── main.jsx
   │   └── supabaseClient.js
   ├── supabase/
   │   └── schema.sql
   ├── .gitignore
   ├── index.html
   ├── package.json
   └── vite.config.js
   ```
4. **Settings → Secrets and variables → Actions → New repository secret**:
   - `SUPABASE_URL` = `https://uxkjvbjlsbgmbalokisf.supabase.co`
   - `SUPABASE_ANON_KEY` = (sua anon key)
5. Crie uma branch chamada `backups` (vazia) — necessária para o workflow de backup

---

### Parte 3 — Cloudflare Pages (5 minutos)

1. Abrir **dash.cloudflare.com** → Pages → **Connect to Git**
2. Selecionar repositório `linsadry/zencow`
3. Configurar build:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: (deixar vazio)
4. **Save and Deploy**
5. Cloudflare vai te dar uma URL tipo `zencow-xxx.pages.dev`

---

## 🧪 Validando

Abrir a URL no celular:

1. ✅ Splash aparece com o logo da vaquinha
2. ✅ Click em "Entrar" → vai para Hoje (Flora)
3. ✅ Cards aparecem nesta ordem: **Flora → Margarida → Camélia recomenda → Memória do dia → Evolução da fazenda → Atalhos**
4. ✅ Tab "Mais" → mostra **Agenda, Casa & Sítio, Memórias**
5. ✅ Tab "Agenda" abre o calendário mensal com filtros de categoria
6. ✅ Faça uma mudança qualquer (ex: marcar tarefa de casa) → recarregue a página → mudança persistiu (Supabase funcionando!)

---

## 🚀 Atualizações futuras

Como você trabalha do iPad sem CLI, o fluxo é:

1. Editar arquivo no GitHub web editor (botão lápis)
2. Bumpar versão no `package.json` (de `3.1.0` para `3.1.1` por exemplo) — força cache-bust do Cloudflare
3. Commit → Cloudflare detecta automaticamente e faz deploy em ~1 min

**Se o Cloudflare disser "Uploaded 0 files":** o hash não mudou. Edite `vite.config.js` e mude o nome do output (ou bump version do package.json).

---

## 🗂️ Estrutura de dados

Tudo persiste em UMA linha da tabela `zencow_state`:

| Campo | Conteúdo |
|---|---|
| `agenda` | Array de eventos (calendário) |
| `pets` | Array dos 5 cachorros com saúde completa |
| `closet_pecas` / `closet_looks` | Guarda-roupa e looks |
| `beauty_produtos` / `beauty_makes` | Maquiagem |
| `sk_produtos` / `sk_diario` | Skincare + fotos da pele |
| `casa_tarefas` / `sitio_projetos` | Casa e sítio |
| `updated_at` | Timestamp automático |

**Auto-save**: qualquer mudança no app dispara save com debounce de 1.2s (não enviou ainda → aguarda → manda 1 request unificada).

---

## 📦 Backup automático

Todo dia 1 do mês, às 3h UTC, o workflow `backup.yml`:

1. Baixa o estado atual do Supabase via REST API
2. Salva como `backups/zencow_YYYY-MM-DD.json` na branch `backups`
3. Commita automaticamente

Você também pode rodar manualmente: **Actions → ZenCow Backup Mensal → Run workflow**.

---

## ⚠️ Limitações conhecidas

1. **Fotos em base64**: para protótipo está OK, mas pra uso longo, considere Supabase Storage (próxima fase)
2. **Single-user**: app inteiro hardcoded com `user_id = 'drika'`. Pra multi-user, precisaria adicionar auth (não está no escopo)
3. **Sem offline first**: precisa de internet para salvar (auto-save falha silenciosamente se offline — estado local continua funcionando)

---

## 🎨 Identidade

O elenco de vaquinhas mascotes está totalmente preservado:

- 🌸 **Flora** — Hoje / Agenda
- 🐾 **Margarida** — Pets
- 👗 **Lola** — Closet
- 🧴 **Camélia** — Beauty & Skincare
- 🌳 **Estrela** — Casa & Sítio
- 📷 **Mimosa** — Memórias

Cada uma tem fala randomizada por sessão.

---

*v3.1 · Diário visual da vida com vaquinhas mascotes*
