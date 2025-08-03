"use client";

import React, { Suspense } from "react";
import { useTranslations } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

interface EstimateRequestSuspenseWrapperProps {
  children: React.ReactNode;
}

export default function EstimateRequestSuspenseWrapper({ children }: EstimateRequestSuspenseWrapperProps) {
  const t = useTranslations();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-200">
          <MovingTruckLoader size="lg" loadingText={t("estimateRequest.loadingText")} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
