import { redirect } from "next/navigation";
import { bidMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Short money URL: /go/bid → contractor proposal with sample intake. */
export default async function GoBidPage({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(bidMoneyLandingPath(sp));
}
