import type { AnalysisResult, CampaignInput } from "@/types/analysis";
import { buildUserPrompt, SYSTEM_INSTRUCTION } from "@/lib/ai/prompt";
import { parseAnalysisJson } from "@/lib/ai/parse";
import { mockAnalysisResult } from "@/lib/ai/mock";

export type AiProvider = "openai" | "gemini";

function getProvider(): AiProvider {
  const raw = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  if (raw === "openai" || raw === "gemini") {
    return raw;
  }
  throw new Error(`AI_PROVIDER must be "openai" or "gemini", got: ${raw}`);
}

function isMockMode(): boolean {
  if (process.env.AI_MOCK_MODE === "true") {
    return true;
  }
  const provider = getProvider();
  if (provider === "openai") {
    return !process.env.OPENAI_API_KEY?.trim();
  }
  return !process.env.GEMINI_API_KEY?.trim();
}

async function callOpenAI(campaign: CampaignInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: buildUserPrompt(campaign) },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${detail.slice(0, 400)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Empty response from OpenAI");
  }
  return text;
}

async function callGemini(campaign: CampaignInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ parts: [{ text: buildUserPrompt(campaign) }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini error ${response.status}: ${detail.slice(0, 400)}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response from Gemini");
  }
  return text;
}

async function callProvider(campaign: CampaignInput): Promise<string> {
  const provider = getProvider();
  if (provider === "openai") {
    return callOpenAI(campaign);
  }
  return callGemini(campaign);
}

export async function generateAnalysis(
  campaign: CampaignInput,
): Promise<AnalysisResult> {
  if (isMockMode()) {
    return mockAnalysisResult();
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callProvider(campaign);
      return parseAnalysisJson(text);
    } catch (error) {
      lastError = error;
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Analysis failed after retry: ${message}`);
}

export function getActiveProviderLabel(): string {
  if (isMockMode()) {
    return "mock";
  }
  return getProvider();
}
