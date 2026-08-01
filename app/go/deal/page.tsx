import { redirect } from "next/navigation";
import { dealMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GoDealPage({ searchParams }: Props) {
  redirect(dealMoneyLandingPath(await searchParams));
}
