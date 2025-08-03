import { estimateRequestServerApi } from "@/lib/api/estimateRequest.server";
import EstimateRequestCreatePage from "@/pageComponents/estimateRequest/create/EstimateRequestCreatePage";
import EstimateRequestEditPage from "@/pageComponents/estimateRequest/edit/EstimateRequestEditPage";
import EstimateRequestSuspenseWrapper from "@/components/estimateRequest/EstimateRequestSuspenseWrapper";
import { getLocale } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "견적 요청 | Moving",
    description: "이사 견적을 요청하고 관리하세요",
  };
}

export default async function Page() {
  const locale = await getLocale();

  try {
    // 서버에서 활성 견적 요청 확인
    const response = await estimateRequestServerApi.getActive(locale);

    return (
      <EstimateRequestSuspenseWrapper>
        {response.success && response.data ? (
          // 활성 견적이 있으면 편집 페이지
          <EstimateRequestEditPage />
        ) : (
          // 활성 견적이 없으면 생성 페이지
          <EstimateRequestCreatePage />
        )}
      </EstimateRequestSuspenseWrapper>
    );
  } catch (error) {
    console.error("활성 견적 확인 실패:", error);
    // 에러 발생 시 기본적으로 생성 페이지로 이동
    return (
      <EstimateRequestSuspenseWrapper>
        <EstimateRequestCreatePage />
      </EstimateRequestSuspenseWrapper>
    );
  }
}
