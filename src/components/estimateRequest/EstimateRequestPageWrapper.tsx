"use client";

import React, { useState, useEffect } from "react";

import estimateRequestApi from "@/lib/api/estimateRequest.api";
import EstimateRequestCreatePage from "@/pageComponents/estimateRequest/create/EstimateRequestCreatePage";
import EstimateRequestEditPage from "@/pageComponents/estimateRequest/edit/EstimateRequestEditPage";

export default function EstimateRequestPageWrapper() {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200">
        <div className="text-lg">로딩 중...</div>
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
