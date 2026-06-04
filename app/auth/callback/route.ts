import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | "recovery" | null;
  const plan = searchParams.get("plan");

  const cookieStore = await cookies();
  const supabase = createServerClient(
    "https://fjykirtmjpxqsnztpijb.supabase.co",
    "sb_publishable_Jd9snZsQOhdZUXZihRbo-w_6imvRzSb",
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type });
  } else if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (plan === "starter") {
    return NextResponse.redirect("https://respondai.lemonsqueezy.com/checkout/buy/ef1471f2-9f62-4b95-a081-e2802c59964c");
  } else if (plan === "pro") {
    return NextResponse.redirect("https://respondai.lemonsqueezy.com/checkout/buy/db29bbf5-eac6-42c5-85f4-804eac772552");
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}