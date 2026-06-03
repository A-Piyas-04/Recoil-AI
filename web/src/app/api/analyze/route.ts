import { NextResponse } from "next/server";

import { generateAnalysis } from "@/lib/ai/providers";
import type { CampaignInput } from "@/types/analysis";

function validateCampaignInput(body: unknown): CampaignInput {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }
  const data = body as Record<string, unknown>;
  const fields: (keyof CampaignInput)[] = [
    "campaign_name",
    "slogan",
    "campaign_description",
    "campaign_copy",
  ];
  const result = {} as CampaignInput;
  for (const field of fields) {
    const value = data[field];
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${field} is required`);
    }
    result[field] = value.trim();
  }
  const totalLength =
    result.campaign_description.length + result.campaign_copy.length;
  if (totalLength < 30) {
    throw new Error(
      "campaign_description and campaign_copy combined must be at least 30 characters",
    );
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const campaign = validateCampaignInput(body);
    const result = await generateAnalysis(campaign);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis request failed";
    const status = message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
