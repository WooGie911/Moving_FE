import {
  IPendingQuoteResponse,
  IReceivedQuoteResponse,
  IQuoteDetailResponse,
  IConfirmEstimateRequest,
  IDesignateQuoteRequest,
  IQuoteHistoryResponse,
} from "@/types/userQuote";
import { ICreateQuoteRequest, ICreateQuoteResponse, IActiveQuoteResponse } from "@/types/quote";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const customerQuoteApi = {
  /**
   * 견적 요청 생성
   */
  createQuote: async (data: ICreateQuoteRequest): Promise<ICreateQuoteResponse> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/quotes`, {
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
          throw new Error("잘못된 입력값입니다.");
        } else {
          throw new Error("견적 요청 생성에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("견적 요청 생성 실패:", error);
      throw error;
    }
  },

  /**
   * 활성 견적 요청 조회
   */
  getActiveQuote: async (): Promise<IActiveQuoteResponse | null> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/quotes/active`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else {
          throw new Error("활성 견적 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("활성 견적 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 진행중인 견적 조회
   */
  getPendingQuote: async (): Promise<IPendingQuoteResponse> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/user-quotes/pending`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 404) {
          throw new Error("진행중인 견적이 없습니다.");
        } else {
          throw new Error("진행중인 견적 조회에 실패했습니다.");
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
  getReceivedQuotes: async (): Promise<IReceivedQuoteResponse[]> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/user-quotes/received`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 404) {
          return [];
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
   * 진행중인 견적 상세 조회
   */
  getPendingQuoteDetail: async (estimateId: number): Promise<IQuoteDetailResponse> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/user-quotes/pending/${estimateId}`, {
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
  getReceivedQuoteDetail: async (quoteId: number, estimateId: number): Promise<IQuoteDetailResponse> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/user-quotes/received/${quoteId}/${estimateId}`, {
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
  confirmEstimate: async (estimateId: number): Promise<any> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/user-quotes/confirm?estimateId=${estimateId}`, {
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
  designateQuote: async (quoteId: number, data: IDesignateQuoteRequest): Promise<any> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/user-quotes/designate?quoteId=${quoteId}`, {
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

  /**
   * 이용 내역 조회
   */
  getQuoteHistory: async (): Promise<IQuoteHistoryResponse[]> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      const response = await fetch(`${API_URL}/user-quotes/history`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 403) {
          throw new Error("현재 유저타입이 고객이 아닙니다.");
        } else if (response.status === 404) {
          return [];
        } else {
          throw new Error("이용 내역 조회에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("이용 내역 조회 실패:", error);
      throw error;
    }
  },
};

export default customerQuoteApi;
