import {
  TPendingEstimateRequestResponse,
  TReceivedEstimateRequestListResponse,
  TEstimateRequestDetailResponse,
  IDesignateEstimateRequestRequest,
  TConfirmEstimateResponse,
  TCancelEstimateResponse,
  TCompleteEstimateResponse,
} from "@/types/customerEstimateRequest";
import { getTokenFromCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 토큰 가져오기 함수
const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
};

// API 에러 응답 타입
interface IApiErrorResponse {
  success: false;
  message: string;
  error?: {
    message: string;
  };
}

const customerEstimateRequestApi = {
  /**
   * 1. 진행중인 견적 조회
   */
  getPendingEstimateRequest: async (language?: string): Promise<TPendingEstimateRequestResponse | null> => {
    try {
      const accessToken = await getAccessToken();

      const queryParams = language ? `?lang=${language}` : "";
      const response = await fetch(`${API_URL}/customer-quotes/pending${queryParams}`, {
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
          const errorData = (await response.json().catch(() => ({}))) as IApiErrorResponse;
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
   * 2. 완료된 견적 목록 조회
   */
  getReceivedEstimateRequests: async (language?: string): Promise<TReceivedEstimateRequestListResponse> => {
    try {
      const accessToken = await getAccessToken();

      const queryParams = language ? `?lang=${language}` : "";
      const response = await fetch(`${API_URL}/customer-quotes/received${queryParams}`, {
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
      throw error;
    }
  },

  /**
   * 3. 견적 확정
   */
  confirmEstimate: async (estimateId: string): Promise<TConfirmEstimateResponse | null> => {
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
   * 4. 견적 취소
   */
  cancelEstimate: async (estimateId: string): Promise<TCancelEstimateResponse | null> => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/cancel?estimateId=${estimateId}`, {
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
          throw new Error("견적 취소에 실패했습니다.");
        }
      }

      const result = await response.json();
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
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/complete?estimateId=${estimateId}`, {
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
          throw new Error("이사완료 처리에 실패했습니다.");
        }
      }

      const result = await response.json();
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
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/customer-quotes/cancel?estimateId=${estimateId}`, {
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
};

export default customerEstimateRequestApi;
