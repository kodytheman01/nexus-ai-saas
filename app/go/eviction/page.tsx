import { redirect } from "next/navigation";
import { evictionMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GoEvictionPage({ searchParams }: Props) {
  redirect(evictionMoneyLandingPath(await searchParams));
}
