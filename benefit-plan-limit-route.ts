import { NextRequest, NextResponse } from "next/server";
import { benefitPlanLimitExtractionPrompt } from "@/src/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      cappings?: string[];
      diagnosis?: string;
    };
    const cappings  = body?.cappings ?? [];
    const diagnosis = body?.diagnosis ?? "";

    if (cappings.length === 0) {
      return NextResponse.json({ benefitPlanLimit: null, appliedCapping: null, notes: "No cappings provided" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: benefitPlanLimitExtractionPrompt(cappings, diagnosis),
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ benefitPlanLimit: null, appliedCapping: null, notes: "AI call failed" });
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text: string }>;
    };

    const text = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";

    // Parse JSON response
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean) as {
      benefitPlanLimit: number | null;
      appliedCapping: string | null;
      notes: string;
    };

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ benefitPlanLimit: null, appliedCapping: null, notes: "Error extracting limit" });
  }
}
