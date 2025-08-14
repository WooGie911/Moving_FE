"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import EstimateRequestCreatePage from "@/pageComponents/estimateRequest/create/EstimateRequestCreatePage";
import EstimateRequestEditPage from "@/pageComponents/estimateRequest/edit/EstimateRequestEditPage";
import { estimateRequestClientApi } from "@/lib/api/estimateRequest.client";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { logDevError } from "@/utils/logDevError";
import * as Sentry from "@sentry/nextjs";

export default function EstimateRequestPage() {
  const locale = useLocale();
  const t = useTranslations("estimateRequest");
  const [hasActiveEstimate, setHasActiveEstimate] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActiveEstimate = async () => {
      try {
        setLoading(true);
        const response = await estimateRequestClientApi.getActive(locale);
        setHasActiveEstimate(response.success && response.data ? true : false);
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            page: "estimateRequest",
            method: "checkActiveEstimate",
            locale,
          },
        });
        logDevError(error, "활성 견적 확인 실패");
        // 에러 발생 시 기본적으로 생성 페이지로 설정
        setHasActiveEstimate(false);
      } finally {
        // 불필요한 최소 로딩 지연 제거: 즉시 콘텐츠 렌더링
        setLoading(false);
      }
    };

    // 즉시 활성 견적 여부 확인 (추가 지연 제거)
    checkActiveEstimate();
    return () => {};
  }, [locale]);

  if (loading) {
    return <MovingTruckLoader size="lg" loadingText={t("loadingText") || "견적 정보를 확인하는 중..."} />;
  }

  return hasActiveEstimate ? (
    // 활성 견적이 있으면 편집 페이지
    <EstimateRequestEditPage />
  ) : (
    // 활성 견적이 없으면 생성 페이지
    <EstimateRequestCreatePage />
  );
}
