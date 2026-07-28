import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { processEngineExecution } from "@/lib/process-engine";

const processEngineRun = inngest.createFunction(
  {
    id: "process-engine-run",
    triggers: [{ event: "engine/payment.success" }],
  },
  async ({ event, step }) => {
    const { stripeSessionId, engineSlug, userInput } = event.data as {
      stripeSessionId: string;
      engineSlug: string;
      userInput: string;
      userEmail?: string;
    };

    await step.run("generate-engine-asset", async () => {
      return processEngineExecution({
        stripeSessionId,
        engineSlug,
        userInput,
      });
    });

    return { status: "success", stripeSessionId };
  },
);

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processEngineRun],
});
