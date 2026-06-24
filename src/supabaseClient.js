import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uxkjvbjlsbgmbalokisf.supabase.co';
const SUPABASE_ANON_KEY = 'COLE_AQUI_SUA_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }, // app single-user, sem auth
});

// User ID fixo (app single-user, sem autenticação)
// Mude se quiser usar multi-user no futuro
export const USER_ID = 'drika';

/**
 * Load helper: retorna a linha única por user_id, ou null se não existir.
 * Use sempre .maybeSingle() pra evitar crash no Safari quando vazio.
 */
export async function loadOne(table) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', USER_ID)
    .maybeSingle();
  if (error) console.error(`[load ${table}]`, error);
  return data;
}

/**
 * Save helper: upsert (insert or update) por user_id.
 * Append .select() pra confirmar persistência (RLS pode falhar silenciosamente).
 */
export async function saveOne(table, payload) {
  const { data, error } = await supabase
    .from(table)
    .upsert({ user_id: USER_ID, ...payload }, { onConflict: 'user_id' })
    .select();
  if (error) console.error(`[save ${table}]`, error);
  return data;
}
