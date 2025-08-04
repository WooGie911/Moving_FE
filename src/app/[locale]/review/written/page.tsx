import WrittenReviewPage from "@/pageComponents/review/written/WrittenReviewPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "review.metadata" });
  return {
    title: t("writtenTitle"),
    description: t("writtenDescription"),
    openGraph: {
      title: t("writtenTitle"),
      description: t("writtenDescription"),
      type: "website",
    },
  };
}

export default function page() {
  return <WrittenReviewPage />;
}
