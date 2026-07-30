import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { processEngineExecution } from "@/lib/process-engine";
import { db } from "@/lib/db";
import { sendAbandonedCheckoutEmail } from "@/lib/send-abandoned-drip";

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

/** Abandoned checkout drip: ~2h nudge, then ~24h follow-up. */
const abandonedCheckoutDrip = inngest.createFunction(
  {
    id: "abandoned-checkout-drip",
    triggers: [{ event: "checkout/abandoned.schedule" }],
  },
  async ({ event, step }) => {
    const data = event.data as {
      abandonedId: string;
      stripeSessionId: string;
      email: string;
      engineSlug: string;
      engineTitle: string;
    };

    await step.sleep("wait-drip-1", "2h");

    const sent1 = await step.run("send-drip-1", async () => {
      const row = await db.abandonedCheckout.findUnique({
        where: { id: data.abandonedId },
      });
      if (!row || row.convertedAt || row.drip1SentAt) return { skipped: true };
      const ok = await sendAbandonedCheckoutEmail({
        to: data.email,
        engineTitle: data.engineTitle,
        engineSlug: data.engineSlug,
        step: 1,
      });
      if (ok) {
        await db.abandonedCheckout.update({
          where: { id: data.abandonedId },
          data: { drip1SentAt: new Date() },
        });
      }
      return { skipped: false, sent: ok };
    });

    await step.sleep("wait-drip-2", "22h");

    const sent2 = await step.run("send-drip-2", async () => {
      const row = await db.abandonedCheckout.findUnique({
        where: { id: data.abandonedId },
      });
      if (!row || row.convertedAt || row.drip2SentAt) return { skipped: true };
      const ok = await sendAbandonedCheckoutEmail({
        to: data.email,
        engineTitle: data.engineTitle,
        engineSlug: data.engineSlug,
        step: 2,
      });
      if (ok) {
        await db.abandonedCheckout.update({
          where: { id: data.abandonedId },
          data: { drip2SentAt: new Date() },
        });
      }
      return { skipped: false, sent: ok };
    });

    return { sent1, sent2 };
  },
);

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processEngineRun, abandonedCheckoutDrip],
});
