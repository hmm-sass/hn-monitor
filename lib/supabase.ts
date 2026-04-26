import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fjykirtmjpxqsnztpijb.supabase.co";
const supabaseAnonKey = "sb_publishable_Jd9snZsQOhdZUXZihRbo-w_6imvRzSb";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
