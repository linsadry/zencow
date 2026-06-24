-- ════════════════════════════════════════════════════════════════════════════
-- ZenCow — Schema Supabase
-- Projeto: uxkjvbjlsbgmbalokisf
-- Padrão: single-user app, sem auth, USING (true) + GRANT pra anon
-- ════════════════════════════════════════════════════════════════════════════

-- Tabela única "estado completo" — tudo em jsonb pra simplicidade no front
-- (mesmo padrão de apps single-user da Adriana)

CREATE TABLE IF NOT EXISTS public.zencow_state (
  user_id          text PRIMARY KEY DEFAULT 'drika',
  agenda           jsonb,
  pets             jsonb,
  closet_pecas     jsonb,
  closet_looks     jsonb,
  beauty_produtos  jsonb,
  beauty_makes     jsonb,
  sk_produtos      jsonb,
  sk_diario        jsonb,
  casa_tarefas     jsonb,
  sitio_projetos   jsonb,
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Trigger pra atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.zencow_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS zencow_state_touch ON public.zencow_state;
CREATE TRIGGER zencow_state_touch
  BEFORE UPDATE ON public.zencow_state
  FOR EACH ROW EXECUTE FUNCTION public.zencow_touch_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- Single-user app: USING (true) é apropriado, app já é protegido pela anon key
ALTER TABLE public.zencow_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS zencow_state_all ON public.zencow_state;
CREATE POLICY zencow_state_all ON public.zencow_state
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ── GRANTS ──────────────────────────────────────────────────────────────────
-- RLS sozinho não basta — precisa GRANT explícito para anon
GRANT SELECT, INSERT, UPDATE, DELETE ON public.zencow_state TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.zencow_state TO authenticated;

-- ── Inicialização da linha única ────────────────────────────────────────────
-- Cria a linha de Drika se ainda não existir
INSERT INTO public.zencow_state (user_id)
VALUES ('drika')
ON CONFLICT (user_id) DO NOTHING;

-- ════════════════════════════════════════════════════════════════════════════
-- VERIFICAÇÃO
-- ════════════════════════════════════════════════════════════════════════════
-- Após rodar, confirme com:
--   SELECT * FROM public.zencow_state;
--   SELECT * FROM pg_policies WHERE tablename = 'zencow_state';
-- ════════════════════════════════════════════════════════════════════════════
