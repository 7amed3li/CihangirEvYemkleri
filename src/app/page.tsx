import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/translations";

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
