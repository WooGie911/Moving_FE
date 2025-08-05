import WritableReviewPage from "@/pageComponents/review/writable/WritableReviewPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "review.metadata" });
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
