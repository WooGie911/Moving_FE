import EstimateRequestPage from "@/pageComponents/estimateRequest/create/EstimateRequestPage";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

// ISR: 5분마다 재생성
export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations("estimateRequest.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Page() {
  // 클라이언트에서 동적 로직 처리하도록 변경
  return <EstimateRequestPage />;
}
