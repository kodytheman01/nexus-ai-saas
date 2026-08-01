import { redirect } from "next/navigation";
import { creatorMoneyLandingPath } from "@/config/conversion";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GoCreatorPage({ searchParams }: Props) {
  redirect(creatorMoneyLandingPath(await searchParams));
}
