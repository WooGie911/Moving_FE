import {
  ICreateEstimateRequest,
  IRejectEstimateRequest,
  IEstimateRequestFilterOptions,
  IDesignatedEstimateRequestFilterOptions,
  IUpdateEstimateStatusRequest,
  IUpdateEstimateRequest,
  TEstimateRequestResponse,
  TMyEstimateResponse,
  TMyRejectedEstimateResponse,
  ICreateEstimateResponse,
  IRejectEstimateResponse,
  IUpdateEstimateStatusResponse,
  IUpdateEstimateResponse,
} from "@/types/moverEstimate";
import { apiPost, apiGet, apiPatch } from "@/utils/apiHelpers";

const moverEstimateApi = {
  /**
   * 견적 생성
   */
  createEstimate: async (data: ICreateEstimateRequest): Promise<ICreateEstimateResponse> => {
    try {
      const result = await apiPost<{ data: ICreateEstimateResponse }>("/mover-estimates/create", data);
      return result.data;
    } catch (error) {
      console.error("견적 생성 실패:", error);
      throw error;
    }
  },

  /**
   * 견적 반려
   */
  rejectEstimate: async (data: IRejectEstimateRequest): Promise<IRejectEstimateResponse> => {
    try {
      const result = await apiPost<{ data: IRejectEstimateResponse }>("/mover-estimates/reject", {
        estimateRequestId: data.estimateRequestId,
        comment: data.comment,
      });
      return result.data;
    } catch (error) {
      console.error("견적 반려 실패:", error);
      throw error;
    }
  },

  /**
   * 서비스 가능 지역 견적 조회
   */
  getRegionEstimateRequests: async (
    params: IEstimateRequestFilterOptions,
    language?: string,
  ): Promise<TEstimateRequestResponse[]> => {
    try {
      const query = new URLSearchParams();
      if (params.sortBy) query.append("sortBy", params.sortBy);
      if (params.customerName) query.append("customerName", params.customerName);
      if (params.movingType) query.append("movingType", params.movingType);
      if (language) query.append("lang", language);

      const result = await apiGet<{ data: TEstimateRequestResponse[] }>(`/mover-estimates/region?${query.toString()}`);
      return result.data;
    } catch (error) {
      console.error("서비스 가능 지역 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 지정 견적 조회
   */
  getDesignatedEstimateRequests: async (
    params?: IDesignatedEstimateRequestFilterOptions,
    language?: string,
  ): Promise<TEstimateRequestResponse[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.moverId) query.append("moverId", params.moverId);
      if (params?.sortBy) query.append("sortBy", params.sortBy);
      if (params?.customerName) query.append("customerName", params.customerName);
      if (params?.movingType) query.append("movingType", params.movingType);
      if (language) query.append("lang", language);

      const result = await apiGet<{ data: TEstimateRequestResponse[] }>(
        `/mover-estimates/designated?${query.toString()}`,
      );
      return result.data;
    } catch (error) {
      console.error("지정 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 지역/지정 견적 통합 조회
   */
  getAllEstimateRequests: async (
    params: {
      region?: boolean;
      designated?: boolean;
      availableRegion?: string;
      sortBy?: "moveDate" | "createdAt";
      customerName?: string;
      movingType?: "SMALL" | "HOME" | "OFFICE";
    },
    language?: string,
  ): Promise<{
    regionEstimateRequests?: TEstimateRequestResponse[];
    designatedEstimateRequests?: TEstimateRequestResponse[];
  }> => {
    try {
      const query = new URLSearchParams();
      if (params.region !== undefined) query.append("region", params.region.toString());
      if (params.designated !== undefined) query.append("designated", params.designated.toString());
      if (params.availableRegion) query.append("availableRegion", params.availableRegion);
      if (params.sortBy) query.append("sortBy", params.sortBy);
      if (params.customerName) query.append("customerName", params.customerName);
      if (params.movingType) query.append("movingType", params.movingType);
      if (language) query.append("lang", language);

      const result = await apiGet<{
        data: {
          regionEstimateRequests?: TEstimateRequestResponse[];
          designatedEstimateRequests?: TEstimateRequestResponse[];
        };
      }>(`/mover-estimates/list?${query.toString()}`);
      return result.data;
    } catch (error) {
      console.error("견적 통합 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 견적 상세 조회
   */
  getEstimateRequestById: async (estimateRequestId: string): Promise<TEstimateRequestResponse> => {
    try {
      const result = await apiGet<{ data: TEstimateRequestResponse }>(`/mover-estimates/${estimateRequestId}`);
      return result.data;
    } catch (error) {
      console.error("견적 상세 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 내가 보낸 견적서 조회
   */
  getMyEstimates: async (language?: string): Promise<TMyEstimateResponse[]> => {
    try {
      const queryParams = language ? `?lang=${language}` : "";
      const result = await apiGet<{ data: TMyEstimateResponse[] }>(`/mover-estimates/my-estimates${queryParams}`);
      return result.data;
    } catch (error) {
      console.error("내가 보낸 견적서 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 내가 반려한 견적 조회
   */
  getMyRejectedEstimateRequests: async (language?: string): Promise<TMyRejectedEstimateResponse[]> => {
    try {
      const queryParams = language ? `?lang=${language}` : "";
      const result = await apiGet<{ data: TMyRejectedEstimateResponse[] }>(
        `/mover-estimates/my-rejected${queryParams}`,
      );
      return result.data;
    } catch (error) {
      console.error("내가 반려한 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 견적 상태 업데이트
   */
  updateEstimateStatus: async (
    estimateId: string,
    data: IUpdateEstimateStatusRequest,
  ): Promise<IUpdateEstimateStatusResponse> => {
    try {
      const result = await apiPatch<{ data: IUpdateEstimateStatusResponse }>(
        `/mover-estimates/status?estimateId=${estimateId}`,
        data,
      );
      return result.data;
    } catch (error) {
      console.error("견적 상태 업데이트 실패:", error);
      throw error;
    }
  },

  /**
   * 견적서 업데이트
   */
  updateEstimate: async (estimateId: string, data: IUpdateEstimateRequest): Promise<IUpdateEstimateResponse> => {
    try {
      const result = await apiPatch<{ data: IUpdateEstimateResponse }>(
        `/mover-estimates/estimate?estimateId=${estimateId}`,
        data,
      );
      return result.data;
    } catch (error) {
      console.error("견적서 업데이트 실패:", error);
      throw error;
    }
  },
};

export default moverEstimateApi;
