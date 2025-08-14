import FavoriteMoverPage from "@/pageComponents/favoriteMover/FavoriteMoverPage";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations("favoriteMover.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function page() {
  return <FavoriteMoverPage />;
}
