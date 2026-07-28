import OpenAI from "openai";
import { withBackoffOrFallback } from "@/lib/api-utils";

export async function validateAndHealOutput(
  rawOutput: string,
  expectedFormat: string,
  systemPrompt: string,
): Promise<string> {
  if (expectedFormat !== "json") return rawOutput;

  try {
    JSON.parse(rawOutput);
    return rawOutput;
  } catch {
    if (!process.env.OPENAI_API_KEY) return rawOutput;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.warn("Broken JSON detected. Running self-heal...");

    // Secondary call: on persistent 429/quota, keep the raw (possibly broken) output
    // rather than crashing fulfillment — the buyer still gets something.
    return withBackoffOrFallback(
      async () => {
        const correction = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Fix broken JSON so it parses. Return ONLY raw valid JSON. No markdown fences.",
            },
            {
              role: "user",
              content: `Original Prompt Context: ${systemPrompt}\n\nBroken JSON Output:\n${rawOutput}`,
            },
          ],
          temperature: 0,
        });
        return correction.choices[0]?.message?.content || rawOutput;
      },
      () => rawOutput,
      { label: "self-healing", maxAttempts: 5 },
    );
  }
}
