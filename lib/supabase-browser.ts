import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://fjykirtmjpxqsnztpijb.supabase.co",
    "sb_publishable_Jd9snZsQOhdZUXZihRbo-w_6imvRzSb"
  );
}