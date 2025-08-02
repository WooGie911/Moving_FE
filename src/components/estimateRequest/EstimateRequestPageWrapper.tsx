"use client";

import React, { useState, useEffect } from "react";

import estimateRequestApi from "@/lib/api/estimateRequest.api";
import EstimateRequestCreatePage from "@/pageComponents/estimateRequest/create/EstimateRequestCreatePage";
import EstimateRequestEditPage from "@/pageComponents/estimateRequest/edit/EstimateRequestEditPage";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { useTranslations } from "next-intl";

export default function EstimateRequestPageWrapper() {
  const t = useTranslations();
  const [hasActiveEstimateRequest, setHasActiveEstimateRequest] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActiveEstimateRequest();
  }, []);

  const checkActiveEstimateRequest = async () => {
    try {
      const response = await estimateRequestApi.getActive();
      if (!response.success) {
        throw new Error(response.message || "활성 견적 확인 실패");
      }
      // data가 있으면 활성 견적이 있는 것
      setHasActiveEstimateRequest(!!response.data);
    } catch (error) {
      console.error("활성 견적 확인 실패:", error);
      setHasActiveEstimateRequest(false);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200">
        <MovingTruckLoader size="lg" loadingText={t("estimateRequest.loadingText")} />
      </div>
    );
  }

  // hasActiveEstimateRequest가 true면 Edit, false면 Create
  if (hasActiveEstimateRequest) {
    return <EstimateRequestEditPage />;
  } else {
    return <EstimateRequestCreatePage />;
  }
}
