"use client";

import React, { useState, useEffect } from "react";

import estimateRequestApi from "@/lib/api/estimateRequest.api";
import EstimateRequestCreatePage from "@/pageComponents/estimateRequest/create/EstimateRequestCreatePage";
import EstimateRequestEditPage from "@/pageComponents/estimateRequest/edit/EstimateRequestEditPage";

export default function EstimateRequestPageWrapper() {
  const [hasActiveQuote, setHasActiveQuote] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActiveQuote();
  }, []);

  const checkActiveQuote = async () => {
    try {
      const response = await estimateRequestApi.getActive();
      if (!response.success) {
        throw new Error(response.message || "활성 견적 확인 실패");
      }
      setHasActiveQuote(!!response.hasActive);
    } catch (error) {
      console.error("활성 견적 확인 실패:", error);
      setHasActiveQuote(false);
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

  // hasActiveQuote가 true면 Edit, false면 Create
  if (hasActiveQuote) {
    return <EstimateRequestEditPage />;
  } else {
    return <EstimateRequestCreatePage />;
  }
}
