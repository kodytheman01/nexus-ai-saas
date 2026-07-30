import { redirect } from "next/navigation";
import { offerMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Short money URL: /go/offer → job offer letter with sample intake. */
export default async function GoOfferPage({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(offerMoneyLandingPath(sp));
}
