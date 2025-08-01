"use client";

import React from "react";
import { EstimateRequestFlow } from "@/components/estimateRequest/common/EstimateRequestFlow";
import { useEstimateRequestApi } from "@/hooks/useEstimateRequestApi";
import { useLanguageStore } from "@/stores/languageStore";

const EstimateRequestCreatePage = () => {
  const apiLogic = useEstimateRequestApi();
  const { t } = useLanguageStore();

  return (
    <EstimateRequestFlow
      title={t("estimateRequest.title")}
      onConfirm={(form) => apiLogic.createMutation.mutate(form)}
      showConfirmModal={apiLogic.showConfirmEstimateRequestModal}
    />
  );
};

export default EstimateRequestCreatePage;
