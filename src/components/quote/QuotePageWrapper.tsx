"use client";

import React, { useState, useEffect } from "react";
import QuoteCreatePage from "@/pages/quote/create/QuoteCreatePage";
import QuoteEditPage from "@/pages/quote/edit/QuoteEditPage";
import QuoteService from "@/services/quoteService";

export default function QuotePageWrapper() {
  const [hasActiveQuote, setHasActiveQuote] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActiveQuote();
  }, []);

  const checkActiveQuote = async () => {
    try {
      const response = await QuoteService.getActiveQuote();
      const hasActive = response.success && response.data !== null;
      setHasActiveQuote(hasActive);
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

  // 세션 스토리지에서 edit 모드 확인
  const isEditMode = sessionStorage.getItem("isEditMode") === "true";

  // edit 모드이거나 활성 견적이 없으면 Create 페이지, 활성 견적이 있으면 Edit 페이지
  if (isEditMode || !hasActiveQuote) {
    return <QuoteCreatePage />;
  } else {
    return <QuoteEditPage />;
  }
}
