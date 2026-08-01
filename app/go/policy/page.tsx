import { redirect } from "next/navigation";
import { policyMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Short money URL: /go/policy → PIP with sample intake. */
export default async function GoPolicyPage({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(policyMoneyLandingPath(sp));
}
