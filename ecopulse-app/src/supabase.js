import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://duxlepaqdjmeoxmhpxpf.supabase.co";

const supabaseKey =
  "sb_publishable_29xKccPAW__0uD2e_U3uBw_pRJGMy-l";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
