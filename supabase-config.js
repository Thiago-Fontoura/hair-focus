// Supabase Configuration - Hair Focus
const SUPABASE_URL = 'https://sidqrgepatjgkmlfsrve.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SNEIecDKXVURJWqEY_GaSg_GUXNTH-I';

window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

function getSupabaseClient() {
  if (window.supabaseClient) {
    return window.supabaseClient;
  }
  if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase conectado com sucesso!');
    return window.supabaseClient;
  }
  return null;
}

window.getSupabaseClient = getSupabaseClient;

// Tenta inicializar imediatamente
window.addEventListener('DOMContentLoaded', () => {
  getSupabaseClient();
});
