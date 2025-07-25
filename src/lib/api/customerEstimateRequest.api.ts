import {
  TPendingEstimateRequestResponse,
  TReceivedEstimateRequestListResponse,
  TEstimateRequestDetailResponse,
  IDesignateEstimateRequestRequest,
} from "@/types/customerEstimateRequest";
import { getTokenFromCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_URL = "http://localhost:5050";

// 토큰 가져오기 함수
const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
};

const customerEstimateRequestApi = {
  /**
   * 진행중인 견적 조회
   */
  getPendingEstimateRequest: async (): Promise<TPendingEstimateRequestResponse | null> => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/pending`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        });

        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 404) {
          return null; // 진행중인 견적이 없는 경우 null 반환
        } else {
          // 실제 에러 메시지를 받아오기
          const errorData = await response.json().catch(() => ({}));
          console.error("Error response:", errorData);
          throw new Error(errorData.error?.message || "진행중인 견적 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("진행중인 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 완료된 견적 목록 조회
   */
  getReceivedEstimateRequests: async (): Promise<TReceivedEstimateRequestListResponse> => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/received`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 404) {
          // 404는 "완료된 견적요청이 없습니다"를 의미하므로 빈 배열 반환
          return [];
        } else if (response.status === 500) {
          throw new Error("서버 오류가 발생했습니다.");
        } else {
          throw new Error("완료된 견적 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("완료된 견적 조회 실패:", error);
      console.error("에러 상세 정보:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  },

  /**
   * 진행중인 견적 상세 조회
   */
  getPendingEstimateRequestDetail: async (estimateId: string): Promise<TEstimateRequestDetailResponse> => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/pending/${estimateId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 견적 ID입니다.");
        } else if (response.status === 404) {
          throw new Error("견적 상세 정보를 찾을 수 없습니다.");
        } else {
          throw new Error("진행중인 견적 상세 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("진행중인 견적 상세 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 완료된 견적 상세 조회
   */
  getReceivedEstimateRequestDetail: async (
    quoteId: string,
    estimateId: string,
  ): Promise<TEstimateRequestDetailResponse> => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/received/${quoteId}/${estimateId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 ID입니다.");
        } else if (response.status === 404) {
          throw new Error("견적 상세 정보를 찾을 수 없습니다.");
        } else {
          throw new Error("완료된 견적 상세 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("완료된 견적 상세 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 견적 확정
   */
  confirmEstimate: async (estimateId: string): Promise<any> => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/confirm?estimateId=${estimateId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 400) {
          throw new Error("유효하지 않은 견적 ID입니다.");
        } else if (response.status === 404) {
          throw new Error("진행중인 견적이 없습니다.");
        } else {
          throw new Error("견적 확정에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("견적 확정 실패:", error);
      throw error;
    }
  },

  /**
   * 지정 견적 요청
   */
  designateEstimateRequest: async (quoteId: string, data: IDesignateEstimateRequestRequest): Promise<any> => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/designate?estimateRequestId=${quoteId}`, {
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
          throw new Error("현재 유저타입이 고객이 아닙니다.");
        } else if (response.status === 404) {
          throw new Error("진행중인 견적이 없습니다.");
        } else {
          throw new Error("지정 견적 요청에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("지정 견적 요청 실패:", error);
      throw error;
    }
  },
};

export default customerEstimateRequestApi;
