"use client";

import { useEffect } from "react";
import { EstimateRequestFlow } from "@/components/estimateRequest/common/EstimateRequestFlow";
import { useEstimateRequestApi } from "@/hooks/useEstimateRequestApi";
import { useTranslations } from "next-intl";
import MovingTypeSmall from "@/assets/img/etc/smallMoving.webp";
import MovingTypeHome from "@/assets/img/etc/homeMoving.webp";
import MovingTypeOffice from "@/assets/img/etc/officeMoving.webp";

const EstimateRequestCreatePage = () => {
  const apiLogic = useEstimateRequestApi();
  const t = useTranslations();

  // 불필요한 이미지 프리로드 제거 (LCP 경쟁 방지)
  useEffect(() => {}, []);

  return (
    <EstimateRequestFlow
      title={t("estimateRequest.title")}
      onConfirm={(form) => apiLogic.createMutation.mutate(form)}
      showConfirmModal={apiLogic.showConfirmEstimateRequestModal}
      enableUnsavedGuard={true}
    />
  );
};

export default EstimateRequestCreatePage;
