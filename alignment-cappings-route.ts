import { NextRequest, NextResponse } from "next/server";
import { alignmentCappingsCataractPrompt } from "@/src/prompts";
import { generateText } from "ai";
import { getModel } from "@/src/model-provider";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { cappings?: string[] };
    const cappings = body?.cappings;

    if (!cappings || cappings.length === 0) {
      return NextResponse.json({ filtered: [] });
    }

    const { text } = await generateText({
      model: getModel({ provider: "openrouter", modelName: "anthropic/claude-sonnet-4-5" }),
      prompt: alignmentCappingsCataractPrompt(cappings),
      maxTokens: 1000,
    });

    if (!text || text.trim() === "NONE") {
      return NextResponse.json({ filtered: [] });
    }

    const filtered = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l !== "NONE");

    return NextResponse.json({ filtered });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to filter cappings";
    return NextResponse.json({ error: message, filtered: [] }, { status: 500 });
  }
}
