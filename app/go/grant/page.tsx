import { redirect } from "next/navigation";
import { grantMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Short money URL for ads: /go/grant → narrative engine with sample intake.
 * Preserve UTMs so attribution + Meta/GA still fire correctly.
 */
export default async function GoGrantPage({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(grantMoneyLandingPath(sp));
}
