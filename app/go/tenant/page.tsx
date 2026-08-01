import { redirect } from "next/navigation";
import { tenantMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Short money URL: /go/tenant → repair request with sample intake. */
export default async function GoTenantPage({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(tenantMoneyLandingPath(sp));
}
