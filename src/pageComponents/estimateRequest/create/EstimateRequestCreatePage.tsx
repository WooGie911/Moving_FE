"use client";

import React from "react";
import { EstimateRequestFlow } from "@/components/estimateRequest/common/EstimateRequestFlow";
import { useEstimateRequestApi } from "@/hooks/useEstimateRequestApi";

const EstimateRequestCreatePage = () => {
  const apiLogic = useEstimateRequestApi();

  return (
    <EstimateRequestFlow
      title="견적 요청"
      onConfirm={(form) => apiLogic.createMutation.mutate(form)}
      showConfirmModal={apiLogic.showConfirmEstimateRequestModal}
    />
  );
};

export default EstimateRequestCreatePage;
