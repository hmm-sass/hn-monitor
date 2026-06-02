import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_51SrU2m48zckkcaJZOQ95VqwxlaahgXiVFhBrB25t1oEFWtdQkKszU2S8lUVAWBiHIHzjGSahKXol3ad87ANu3njy007kqUFctT");

export async function POST(request: Request) {
  const { priceId, email } = await request.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `https://respondai-app.vercel.app/dashboard?upgraded=true`,
    cancel_url: `https://respondai-app.vercel.app/pricing`,
    metadata: { email },
  });

  return NextResponse.json({ url: session.url });
}