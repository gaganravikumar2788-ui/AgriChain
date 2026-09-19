import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://blbcajlljnedpjwabikm.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_usHa0s1MrccWC-om4WP5UA_7mFWvryF';

export const supabase = createClient(supabaseUrl, supabaseKey);
