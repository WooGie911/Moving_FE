import IndexEditPage from "@/pageComponents/profile/edit/IndexEditPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile.editMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return <IndexEditPage />;
}
