import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    "https://fjykirtmjpxqsnztpijb.supabase.co",
    "sb_publishable_Jd9snZsQOhdZUXZihRbo-w_6imvRzSb",
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && request.nextUrl.pathname === "/login") {
    const plan = request.nextUrl.searchParams.get("plan");
    if (plan === "starter") {
      return NextResponse.redirect("https://respondai.lemonsqueezy.com/checkout/buy/ef1471f2-9f62-4b95-a081-e2802c59964c");
    } else if (plan === "pro") {
      return NextResponse.redirect("https://respondai.lemonsqueezy.com/checkout/buy/db29bbf5-eac6-42c5-85f4-804eac772552");
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};