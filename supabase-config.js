const SUPABASE_URL = 'https://sidqrgepatjgkmlfsrve.supabase.com';
const SUPABASE_ANON_KEY = 'sb_publishable_SNEIecDKXVURJWqEY_GaSg_GUXNTH-I';

const supabaseClient = (typeof supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY)
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
