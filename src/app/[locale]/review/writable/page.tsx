import WritableReviewPage from "@/pageComponents/review/writable/WritableReviewPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "review.metadata" });
  return {
    title: t("writableTitle"),
    description: t("writableDescription"),
    openGraph: {
      title: t("writableTitle"),
      description: t("writableDescription"),
      type: "website",
    },
  };
}

export default function writableReviewPage() {
  return <WritableReviewPage />;
}
