import { redirect } from "next/navigation";
import { lienMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GoLienPage({ searchParams }: Props) {
  redirect(lienMoneyLandingPath(await searchParams));
}
