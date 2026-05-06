import { NextRequest, NextResponse } from "next/server";
import { alignmentCappingsCataractPrompt } from "@/src/prompts";

const CONVEX_URL =
  process.env.CONVEX_URL_PUBLIC ??
  process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { cappings?: string[] };
    const cappings = body?.cappings;

    if (!cappings || cappings.length === 0) {
      return NextResponse.json({ filtered: [] });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: alignmentCappingsCataractPrompt(cappings),
          },
        ],
      }),
    });

    if (!response.ok) {
      // Fallback: return all cappings if AI call fails
      return NextResponse.json({ filtered: cappings });
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text: string }>;
    };

    const text = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";

    if (!text || text === "NONE") {
      return NextResponse.json({ filtered: [] });
    }

    const filtered = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l !== "NONE");

    return NextResponse.json({ filtered });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to filter cappings";
    return NextResponse.json({ error: message, filtered: [] }, { status: 500 });
  }
}
