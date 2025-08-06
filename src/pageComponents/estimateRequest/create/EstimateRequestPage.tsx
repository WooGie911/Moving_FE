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
        // 최소 로딩 시간을 보장하여 사용자가 로딩 상태를 확실히 볼 수 있도록 함
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    // 초기 로딩 상태를 확실히 보이도록 약간의 지연
    const timer = setTimeout(() => {
      checkActiveEstimate();
    }, 200);

    return () => clearTimeout(timer);
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
