import EstimateRequestPage from "@/pageComponents/estimateRequest/create/EstimateRequestPage";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import MovingTypeSmall from "@/assets/img/etc/smallMoving.webp";

// ISR: 5분마다 재생성
export const revalidate = 300;
// 로케일 캐싱 이슈 방지: 이 페이지는 항상 현재 요청 기준으로 렌더
export const dynamic = "force-dynamic";

// Next.js (App Router) 최신 버전에서는 params가 Promise 형태로 전달되기에 비동기 처리 필요
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "estimateRequest.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    other: {
      // LCP 후보 이미지 한 장만 프리로드
      [`link[rel='preload'][as='image'][href='${MovingTypeSmall.src}']`]: "",
    },
  };
}

export default function Page() {
  // 클라이언트에서 동적 로직 처리하도록 변경
  return <EstimateRequestPage />;
}
