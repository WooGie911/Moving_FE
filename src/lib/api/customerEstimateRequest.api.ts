import {
  TPendingEstimateRequestResponse,
  TReceivedEstimateRequestListResponse,
  TConfirmEstimateResponse,
  TCancelEstimateResponse,
  TCompleteEstimateResponse,
} from "@/types/customerEstimateRequest";
import { apiGet, apiPatch } from "@/utils/apiHelpers";

const customerEstimateRequestApi = {
  /**
   * 1. 진행중인 견적 조회
   */
  getPendingEstimateRequest: async (language?: string): Promise<TPendingEstimateRequestResponse | null> => {
    try {
      const queryParams = language ? `?lang=${language}` : "";
      const result = await apiGet<{ data: TPendingEstimateRequestResponse }>(`/customer-quotes/pending${queryParams}`);
      return result.data;
    } catch (error) {
      console.error("진행중인 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 2. 완료된 견적 목록 조회
   */
  getReceivedEstimateRequests: async (language?: string): Promise<TReceivedEstimateRequestListResponse> => {
    try {
      const queryParams = language ? `?lang=${language}` : "";
      const result = await apiGet<{ data: TReceivedEstimateRequestListResponse }>(
        `/customer-quotes/received${queryParams}`,
      );
      return result.data;
    } catch (error) {
      console.error("완료된 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 3. 견적 확정
   */
  confirmEstimate: async (estimateId: string): Promise<TConfirmEstimateResponse | null> => {
    try {
      const result = await apiPatch<{ data: TConfirmEstimateResponse }>(
        `/customer-quotes/confirm?estimateId=${estimateId}`,
        {},
      );
      return result.data;
    } catch (error) {
      console.error("견적 확정 실패:", error);
      throw error;
    }
  },

  /**
   * 4. 견적 취소
   */
  cancelEstimate: async (estimateId: string): Promise<TCancelEstimateResponse | null> => {
    try {
      const result = await apiPatch<{ data: TCancelEstimateResponse }>(
        `/customer-quotes/cancel?estimateId=${estimateId}`,
        {},
      );
      return result.data;
    } catch (error) {
      console.error("견적 취소 실패:", error);
      throw error;
    }
  },

  /**
   * 5.이사완료(구매확정)
   */
  completeEstimate: async (estimateId: string): Promise<TCompleteEstimateResponse | null> => {
    try {
      const result = await apiPatch<{ data: TCompleteEstimateResponse }>(
        `/customer-quotes/complete?estimateId=${estimateId}`,
        {},
      );
      return result.data;
    } catch (error) {
      console.error("이사 확정 실패:", error);
      throw error;
    }
  },

  /**
   * 6. 견적 반려
   */
  rejectEstimate: async (estimateId: string): Promise<TCancelEstimateResponse | null> => {
    try {
      const result = await apiPatch<{ data: TCancelEstimateResponse }>(
        `/customer-quotes/cancel?estimateId=${estimateId}`,
        {},
      );
      return result.data;
    } catch (error) {
      console.error("견적 반려 실패:", error);
      throw error;
    }
  },
};

export default customerEstimateRequestApi;
