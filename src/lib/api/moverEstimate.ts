
import {
  ICreateEstimateRequest,
  IRejectEstimateRequest,
  IQuoteFilterOptions,
  IDesignatedQuoteFilterOptions,
  IUpdateEstimateStatusRequest,
  IUpdateEstimateRequest,
  IQuoteResponse,
  IEstimateResponse,
  IMyEstimateResponse,
  IMyRejectedQuoteResponse,
  ICreateEstimateResponse,
  IRejectEstimateResponse,
  IUpdateEstimateStatusResponse,
  IUpdateEstimateResponse,
} from "@/types/moverEstimate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const moverEstimateApi = {
  /**
   * 견적 생성
   */
  createEstimate: async (data: ICreateEstimateRequest): Promise<ICreateEstimateResponse> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/mover-estimates/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 입력값입니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else {
          throw new Error("견적 생성에 실패했습니다.");
        }
      }

      const result = await response.json();
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
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/mover-estimates/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 입력값입니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else {
          throw new Error("견적 반려에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("견적 반려 실패:", error);
      throw error;
    }
  },

  /**
   * 서비스 가능 지역 견적 조회
   */
  getRegionQuotes: async (params: IQuoteFilterOptions): Promise<IQuoteResponse[]> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const query = new URLSearchParams();
      query.append("availableRegion", params.availableRegion);
      if (params.sortBy) query.append("sortBy", params.sortBy);
      if (params.customerName) query.append("customerName", params.customerName);
      if (params.movingType) query.append("movingType", params.movingType);

      const response = await fetch(`${API_URL}/mover-estimates/region?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 입력값입니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else if (response.status === 404) {
          return [];
        } else {
          throw new Error("서비스 가능 지역 견적 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("서비스 가능 지역 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 지정 견적 조회
   */
  getDesignatedQuotes: async (params?: IDesignatedQuoteFilterOptions): Promise<IQuoteResponse[]> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const query = new URLSearchParams();
      if (params?.sortBy) query.append("sortBy", params.sortBy);
      if (params?.customerName) query.append("customerName", params.customerName);
      if (params?.movingType) query.append("movingType", params.movingType);

      const response = await fetch(`${API_URL}/mover-estimates/designated?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else if (response.status === 404) {
          return [];
        } else {
          throw new Error("지정 견적 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("지정 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 지역/지정 견적 통합 조회
   */
  getAllQuotes: async (params: {
    region: boolean;
    designated: boolean;
    availableRegion?: string;
    sortBy?: "movingDate" | "createdAt";
    customerName?: string;
    movingType?: "SMALL" | "HOME" | "OFFICE";
  }): Promise<{
    regionQuotes?: IQuoteResponse[];
    designatedQuotes?: IQuoteResponse[];
  }> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const query = new URLSearchParams();
      query.append("region", params.region.toString());
      query.append("designated", params.designated.toString());
      if (params.availableRegion) query.append("availableRegion", params.availableRegion);
      if (params.sortBy) query.append("sortBy", params.sortBy);
      if (params.customerName) query.append("customerName", params.customerName);
      if (params.movingType) query.append("movingType", params.movingType);

      const response = await fetch(`${API_URL}/mover-estimates?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 입력값입니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else {
          throw new Error("견적 통합 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("견적 통합 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 견적 상세 조회
   */
  getQuoteById: async (quoteId: number): Promise<IQuoteResponse> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/mover-estimates/${quoteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 견적 ID입니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else if (response.status === 404) {
          throw new Error("견적 정보를 찾을 수 없습니다.");
        } else {
          throw new Error("견적 상세 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("견적 상세 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 내가 보낸 견적서 조회
   */
  getMyEstimates: async (): Promise<IMyEstimateResponse[]> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/mover-estimates/request`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else if (response.status === 404) {
          return [];
        } else {
          throw new Error("내가 보낸 견적서 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("내가 보낸 견적서 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 내가 반려한 견적 조회
   */
  getMyRejectedQuotes: async (): Promise<IMyRejectedQuoteResponse[]> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/mover-estimates/reject`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else if (response.status === 404) {
          return [];
        } else {
          throw new Error("내가 반려한 견적 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
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
    estimateId: number,
    data: IUpdateEstimateStatusRequest,
  ): Promise<IUpdateEstimateStatusResponse> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/mover-estimates/status?estimateId=${estimateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 입력값입니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else {
          throw new Error("견적 상태 업데이트에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("견적 상태 업데이트 실패:", error);
      throw error;
    }
  },

  /**
   * 견적서 업데이트
   */
  updateEstimate: async (estimateId: number, data: IUpdateEstimateRequest): Promise<IUpdateEstimateResponse> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/mover-estimates/estimate?estimateId=${estimateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 입력값입니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 기사가 아닙니다.");
        } else {
          throw new Error("견적서 업데이트에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("견적서 업데이트 실패:", error);
      throw error;
    }
  },
};

export default moverEstimateApi;

