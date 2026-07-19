import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  || process.env.EXPO_PUBLIC_SUPABASE_URL
  || 'https://oxunynxspkxfkokerftl.supabase.co';

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  || 'sb_publishable_T_IYdewX-mBILr-5hSIUxw_0KC4f3Nh';

export const communitySupabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
