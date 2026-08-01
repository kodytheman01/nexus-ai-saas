import { redirect } from "next/navigation";
import { collectMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Short money URL: /go/collect → unpaid invoice demand with sample intake. */
export default async function GoCollectPage({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(collectMoneyLandingPath(sp));
}
