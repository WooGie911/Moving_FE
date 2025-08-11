"use client";

import { useEffect } from "react";
import { EstimateRequestFlow } from "@/components/estimateRequest/common/EstimateRequestFlow";
import { useEstimateRequestApi, useActiveEstimateRequest } from "@/hooks/useEstimateRequestApi";
import { useTranslations } from "next-intl";
import MovingTypeSmall from "@/assets/img/etc/smallMoving.webp";
import MovingTypeHome from "@/assets/img/etc/homeMoving.webp";
import MovingTypeOffice from "@/assets/img/etc/officeMoving.webp";

const EstimateRequestCreatePage = () => {
  const apiLogic = useEstimateRequestApi();
  const activeQuery = useActiveEstimateRequest();
  const t = useTranslations();

  // 이미지 프리로드
  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = [MovingTypeSmall.src, MovingTypeHome.src, MovingTypeOffice.src];

      imageUrls.forEach((url) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;
        document.head.appendChild(link);
      });
    };

    preloadImages();
  }, []);

  return (
    <EstimateRequestFlow
      title={t("estimateRequest.title")}
      onConfirm={(form) => apiLogic.createMutation.mutate(form)}
      showConfirmModal={apiLogic.showConfirmEstimateRequestModal}
      activeQuery={activeQuery}
    />
  );
};

export default EstimateRequestCreatePage;
