import IndexEditPage from "@/pageComponents/profile/edit/IndexEditPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// ISR: 5분마다 재생성
export const revalidate = 300;
export const dynamic = "force-dynamic";

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
