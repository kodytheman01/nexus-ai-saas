import OpenAI from "openai";
import { db } from "@/lib/db";
import { withBackoffOrFallback } from "@/lib/api-utils";
import { optimizeUserInput } from "@/lib/prompt-optimizer";
import { validateAndHealOutput } from "@/lib/self-healing";

function demoOutput(engineTitle: string, userInput: string, format: string) {
  const body = [
    `# ${engineTitle}`,
    "",
    "## Generated Asset (Demo Mode)",
    "",
    "OPENAI_API_KEY is not configured, so this is a structural placeholder.",
    "",
    "### Your Input",
    "",
    "```",
    userInput,
    "```",
    "",
    "### Next Steps",
    "",
    "1. Add OPENAI_API_KEY to `.env`",
    "2. Re-run checkout or use a regenerate token",
    "3. The live model will produce the full production asset",
  ].join("\n");

  if (format === "json") {
    return JSON.stringify(
      {
        packTitle: `${engineTitle} (Demo)`,
        note: "Demo mode — configure OPENAI_API_KEY for live generation",
        inputEcho: userInput,
        items: [
          {
            step: 1,
            action: "Configure OPENAI_API_KEY",
          },
          {
            step: 2,
            action: "Re-run this engine for a live asset",
          },
        ],
      },
      null,
      2,
    );
  }

  return body;
}

export async function processEngineExecution(params: {
  stripeSessionId: string;
  engineSlug: string;
  userInput: string;
}) {
  const { stripeSessionId, engineSlug, userInput } = params;

  const engine = await db.calculationEngine.findUnique({
    where: { slug: engineSlug },
  });

  if (!engine) {
    throw new Error(`Engine config missing for: ${engineSlug}`);
  }

  await db.engineRun.update({
    where: { stripeSessionId },
    data: { status: "processing" },
  });

  try {
    const optimization = await optimizeUserInput(userInput, engine.title);
    if (optimization.hasMaliciousIntent) {
      throw new Error("Security alert: malicious prompt pattern detected.");
    }

    let output: string;

    if (!process.env.OPENAI_API_KEY) {
      output = demoOutput(
        engine.title,
        optimization.optimizedInput,
        engine.outputFormat,
      );
    } else {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const rateLimitFallbackNote =
        "Live model was rate-limited; this is a structured fallback deliverable. Contact support for a complimentary regeneration once quota resets.";

      // Primary generation: retry with backoff; if quota still exhausted, fall
      // back to the structured demo asset so the paid run still completes.
      const raw = await withBackoffOrFallback(
        async () => {
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o",
            messages: [
              { role: "system", content: engine.aiSystemPrompt },
              {
                role: "user",
                content: `Parameters: ${optimization.optimizedInput}\n\nOutput format: ${engine.outputFormat}\n\nInclude a short disclaimer that this is informational guidance, not licensed professional advice.`,
              },
            ],
            response_format:
              engine.outputFormat === "json"
                ? { type: "json_object" }
                : undefined,
          });
          const content = completion.choices[0]?.message?.content;
          if (!content) throw new Error("Empty model response.");
          return content;
        },
        () =>
          demoOutput(
            engine.title,
            optimization.optimizedInput,
            engine.outputFormat,
          ) + `\n\n_Note: ${rateLimitFallbackNote}_`,
        { label: "process-engine", maxAttempts: 5, baseDelayMs: 750 },
      );

      if (raw.includes(rateLimitFallbackNote)) {
        output = raw;
      } else {
        output = await validateAndHealOutput(
          raw,
          engine.outputFormat,
          engine.aiSystemPrompt,
        );
      }
    }

    await db.engineRun.update({
      where: { stripeSessionId },
      data: {
        status: "completed",
        outputData: output,
      },
    });

    return { status: "success" as const, stripeSessionId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await db.engineRun.update({
      where: { stripeSessionId },
      data: {
        status: "failed",
        outputData: `Generation failed: ${message}`,
      },
    });
    throw error;
  }
}
