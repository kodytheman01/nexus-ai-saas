/**
 * True only for real Stripe Checkout Session IDs (test or live).
 * Excludes free demo mode (`demo_*`) and local override mocks (`cs_test_mock_*`),
 * which create EngineRuns / success pages without a Stripe charge.
 */
export function isConfirmedStripeCheckoutSession(
  sessionId: string | null | undefined,
): boolean {
  if (!sessionId) return false;
  if (sessionId.startsWith("demo_")) return false;
  if (sessionId.startsWith("cs_test_mock_")) return false;
  return sessionId.startsWith("cs_test_") || sessionId.startsWith("cs_live_");
}
