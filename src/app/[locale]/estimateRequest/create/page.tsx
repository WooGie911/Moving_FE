import EstimateRequestPage from "@/pageComponents/estimateRequest/create/EstimateRequestPage";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import MovingTypeSmall from "@/assets/img/etc/smallMoving.webp";
import MovingTypeHome from "@/assets/img/etc/homeMoving.webp";
import MovingTypeOffice from "@/assets/img/etc/officeMoving.webp";

// ISR: 5분마다 재생성
export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations("estimateRequest.metadata");

  return {
    title: t("title"),
    description: t("description"),
    other: {
      // 이사 타입 이미지 프리로드
      [`link[rel='preload'][as='image'][href='${MovingTypeSmall.src}']`]: "",
      [`link[rel='preload'][as='image'][href='${MovingTypeHome.src}']`]: "",
      [`link[rel='preload'][as='image'][href='${MovingTypeOffice.src}']`]: "",
    },
  };
}

export default function Page() {
  // 클라이언트에서 동적 로직 처리하도록 변경
  return <EstimateRequestPage />;
}
