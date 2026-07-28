import { after } from "next/server";

/**
 * Run work after the HTTP response is sent (serverless-safe on Netlify/Vercel).
 * Falls back to fire-and-forget when `after` is unavailable.
 */
export function runAfterResponse(task: () => Promise<void>) {
  try {
    after(async () => {
      try {
        await task();
      } catch (err) {
        console.error("Background task failed:", err);
      }
    });
  } catch {
    void task().catch((err) => console.error("Background task failed:", err));
  }
}
