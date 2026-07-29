import { redirect } from "next/navigation";

/** Legacy/mistyped path — catalog lives on the homepage. */
export default function EnginesAliasPage() {
  redirect("/#catalog");
}
