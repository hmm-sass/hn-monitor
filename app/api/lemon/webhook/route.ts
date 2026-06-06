import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://fjykirtmjpxqsnztpijb.supabase.co",
  "sb_publishable_Jd9snZsQOhdZUXZihRbo-w_6imvRzSb"
);

export async function POST(request: Request) {
  const body = await request.json();

  const eventName = body.meta?.event_name;
  const email = body.data?.attributes?.user_email;
  const variantId = body.data?.attributes?.variant_id;

  if (!email) return NextResponse.json({ ok: true });

  let plan = "free";

  if (eventName === "subscription_created" || eventName === "subscription_updated") {
    if (variantId === 1739869) plan = "starter";
    if (variantId === 1739870) plan = "pro";
  }

  if (eventName === "subscription_cancelled") {
    plan = "free";
  }

  await supabase
    .from("monitors")
    .update({ plan })
    .eq("email", email);

  return NextResponse.json({ ok: true });
}