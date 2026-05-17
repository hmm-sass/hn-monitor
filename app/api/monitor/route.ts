import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type MonitorPayload = {
  email?: string;
  keywords?: string;
  slackWebhook?: string;
  competitorKeywords?: string;
};

function parseKeywords(rawKeywords: string): string[] {
  return rawKeywords
    .split(/[\n,]/g)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MonitorPayload;
    const email = body.email?.trim() ?? "";
    const slackWebhook = body.slackWebhook?.trim() ?? "";
    const rawKeywords = body.keywords?.trim() ?? "";
    const rawCompetitorKeywords = body.competitorKeywords?.trim() ?? "";

    const keywords = parseKeywords(rawKeywords);
    const competitor_keywords = parseKeywords(rawCompetitorKeywords);

    if (!email || !slackWebhook || keywords.length === 0) {
      return NextResponse.json(
        { error: "Email, keywords, and Slack webhook are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("monitors").insert({
      email,
      keywords,
      slack_webhook: slackWebhook,
      competitor_keywords,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to save. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Monitor activated successfully!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}