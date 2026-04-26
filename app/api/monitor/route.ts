import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type MonitorPayload = {
  email?: string;
  keywords?: string;
  slackWebhook?: string;
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

    const keywords = parseKeywords(rawKeywords);

    if (!email || !slackWebhook || keywords.length === 0) {
      return NextResponse.json(
        { error: "email, keywords, slackWebhook은 필수입니다." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("monitors").insert({
      email,
      keywords,
      slack_webhook: slackWebhook,
    });

    if (error) {
      return NextResponse.json(
        { error: "Supabase 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "모니터가 성공적으로 등록되었습니다." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
