import {
  IMoverInfo,
  IMoverListParams,
  MoverListResponse,
  DesignatedQuoteRequestResponse,
  DesignatedQuoteRequestCheckResponse,
} from "@/types/mover.types";
import { ApiResponse } from "@/types/api.types";
import { REGION_LIST, SERVICE_TYPE_LIST } from "@/lib/utils/moverStaticData";
import { getTokenFromCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const findMoverApi = {
  /**
   * 기사님 리스트 조회 API
   */
  fetchMovers: async (
    params: IMoverListParams = {},
    language?: string,
  ): Promise<{
    items: IMoverInfo[];
    nextCursor: string | null;
    hasNext: boolean;
  }> => {
    try {
      const query = new URLSearchParams();
      if (params.region) query.append("region", params.region);
      if (params.serviceTypeId) query.append("serviceTypeId", params.serviceTypeId.toString());
      if (params.search) query.append("search", params.search);
      if (params.sort) query.append("sort", params.sort);
      if (params.cursor) query.append("cursor", params.cursor);
      if (params.take) query.append("take", params.take.toString());
      if (language) query.append("lang", language);

      const res = await fetch(`${API_URL}/movers?${query.toString()}`);

      if (res.status === 404) {
        return { items: [], nextCursor: null, hasNext: false };
      }

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("인증이 필요합니다.");
        } else if (res.status === 403) {
          throw new Error("접근 권한이 없습니다.");
        } else {
          return { items: [], nextCursor: null, hasNext: false };
        }
      }

      const data: ApiResponse<MoverListResponse> = await res.json();

      if (!data.success) {
        return { items: [], nextCursor: null, hasNext: false };
      }

      return {
        items: data.data.items || [],
        nextCursor: data.data.nextCursor || null,
        hasNext: data.data.hasNext || false,
      };
    } catch (error) {
      console.error("기사님 목록 조회 실패:", error);
      return { items: [], nextCursor: null, hasNext: false };
    }
  },

  /**
   * 찜한 기사님 조회 API
   */
  fetchFavoriteMovers: async (language?: string): Promise<IMoverInfo[]> => {
    try {
      const accessToken = await getTokenFromCookie();
      if (!accessToken) {
        throw new Error("로그인이 필요합니다.");
      }

      const queryParams = language ? `?lang=${language}` : "";
      const res = await fetch(`${API_URL}/movers/favorite${queryParams}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (res.status >= 500) {
          throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          throw new Error("찜한 기사님 조회에 실패했습니다.");
        }
      }

      const data: ApiResponse<IMoverInfo[]> = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("찜한 기사님 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 기사님 상세 조회 API
   */
  fetchMoverDetail: async (moverId: string, language?: string): Promise<IMoverInfo | null> => {
    try {
      const accessToken = await getTokenFromCookie();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const queryParams = language ? `?lang=${language}` : "";
      const res = await fetch(`${API_URL}/movers/${moverId}${queryParams}`, {
        headers,
      });

      if (!res.ok) return null;

      const data: ApiResponse<IMoverInfo> = await res.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("기사님 상세 조회 실패:", error);
      return null;
    }
  },

  /**
   * 기사님이 등록한 지역 목록 조회 API (프론트에서 반환)
   */
  fetchRegions: async (): Promise<string[]> => {
    return REGION_LIST;
  },

  /**
   * 기사님이 등록한 서비스 타입 목록 조회 API (프론트에서 반환)
   */
  fetchServiceTypes: async (): Promise<Array<{ id: number; name: string }>> => {
    return SERVICE_TYPE_LIST;
  },

  /**
   * 지정 견적 요청 API
   */
  requestDesignatedQuote: async (
    moverId: string,
    data: { quoteId: string; message?: string; expiresAt: string },
  ): Promise<DesignatedQuoteRequestResponse> => {
    try {
      const accessToken = await getTokenFromCookie();
      if (!accessToken) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(`${API_URL}/movers/${moverId}/quote-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          quoteId: data.quoteId,
          message: data.message,
          expiresAt: data.expiresAt,
        }),
      });

      const result: ApiResponse<DesignatedQuoteRequestResponse> = await response.json();

      if (!response.ok) {
        if (result.message && result.message.includes("이미")) {
          throw new Error("이미 해당 기사님에게 지정 견적을 요청하셨습니다.");
        }
        throw new Error(result.message || "지정 견적 요청에 실패했습니다.");
      }

      return result.data;
    } catch (error) {
      console.error("지정 견적 요청 에러:", error);
      throw error;
    }
  },

  /**
   * 지정 견적 요청 여부 조회 API
   */
  checkDesignatedQuoteRequest: async (
    moverId: string,
    quoteId: string,
  ): Promise<DesignatedQuoteRequestCheckResponse> => {
    try {
      const accessToken = await getTokenFromCookie();
      console.log("[checkDesignatedQuoteRequest] accessToken:", accessToken ? "있음" : "없음");
      console.log("[checkDesignatedQuoteRequest] moverId:", moverId);
      console.log("[checkDesignatedQuoteRequest] quoteId:", quoteId);

      if (!accessToken) {
        throw new Error("로그인이 필요합니다.");
      }

      const requestUrl = `${API_URL}/movers/${moverId}/quote-request/check?quoteId=${quoteId}`;
      console.log("[checkDesignatedQuoteRequest] requestUrl:", requestUrl);

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("[checkDesignatedQuoteRequest] response.status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("[checkDesignatedQuoteRequest] error response:", errorText);
        console.log("[checkDesignatedQuoteRequest] error status:", response.status);

        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else if (response.status === 404) {
          throw new Error("지정 견적 요청 정보를 찾을 수 없습니다.");
        } else {
          throw new Error("지정 견적 요청 여부 조회에 실패했습니다.");
        }
      }

      const result: ApiResponse<DesignatedQuoteRequestCheckResponse> = await response.json();
      console.log("[checkDesignatedQuoteRequest] success result:", result);
      return result.data;
    } catch (error) {
      console.error("지정 견적 요청 여부 조회 에러:", error);
      throw error;
    }
  },

  /**
   * 기사님 리뷰 조회
   */
  getMoverReviews: async (
    moverId: string,
    page: number = 1,
    pageSize: number = 5,
    language?: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      items: Array<{
        id: string;
        estimateRequestId: string;
        customerId: string;
        moverId: string;
        profileImage: string | null;
        nickname: string;
        moveType: string;
        isDesigned: boolean;
        moverIntroduction: string | null;
        fromAddress: any;
        toAddress: any;
        moveDate: string;
        rating: number;
        content: string;
        createdAt: string;
        estimate: any;
      }>;
      total: number;
      page: number;
      pageSize: number;
    };
  }> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());
      if (language) queryParams.append("lang", language);

      const response = await fetch(`${API_URL}/reviews/mover/${moverId}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("리뷰 조회에 실패했습니다.");
      }

      return await response.json();
    } catch (error) {
      console.error("리뷰 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 찜하기 추가
   */
  addFavorite: async (moverId: string): Promise<{ isFavorited: boolean; favoriteCount: number }> => {
    try {
      const accessToken = await getTokenFromCookie();

      if (!accessToken) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ moverId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else {
          throw new Error("찜하기 추가에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("찜하기 추가 실패:", error);
      throw error;
    }
  },

  /**
   * 찜하기 제거
   */
  removeFavorite: async (moverId: string): Promise<{ isFavorited: boolean; favoriteCount: number }> => {
    try {
      const accessToken = await getTokenFromCookie();

      if (!accessToken) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(`${API_URL}/favorites/${moverId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다.");
        } else {
          throw new Error("찜하기 제거에 실패했습니다.");
        }
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("찜하기 제거 실패:", error);
      throw error;
    }
  },
};

export default findMoverApi;
