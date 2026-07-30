import { redirect } from "next/navigation";
import { noticeMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Short money URL for ads: /go/notice → pay-or-quit with sample intake.
 * Preserve UTMs so attribution + Meta/GA still fire correctly.
 */
export default async function GoNoticePage({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(noticeMoneyLandingPath(sp));
}
