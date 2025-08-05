import IndexRegisterPage from "@/pageComponents/profile/register/IndexRegisterPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile.registerMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  return <IndexRegisterPage />;
}
