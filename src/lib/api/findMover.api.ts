import {
  IMoverInfo,
  IMoverListParams,
  MoverListResponse,
  DesignatedQuoteRequestResponse,
  DesignatedQuoteRequestCheckResponse,
} from "@/types/mover.types";
import { ApiResponse } from "@/types/api.types";
import { REGION_LIST, SERVICE_TYPE_LIST } from "@/lib/utils/moverStaticData";

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

      const endpoint = `/movers?${query.toString()}`;

      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const accessToken = await getTokenFromCookie();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: "include",
      });

      const data: ApiResponse<MoverListResponse> = await response.json();

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
   * 찜한 기사님 조회 API (페이지네이션)
   */
  fetchFavoriteMovers: async (
    limit: number = 3,
    cursor?: string,
    language?: string,
  ): Promise<{
    items: IMoverInfo[];
    nextCursor: string | null;
    hasNext: boolean;
  }> => {
    try {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());
      if (cursor) params.append("cursor", cursor);
      if (language) params.append("lang", language);

      const queryString = params.toString();
      const endpoint = `/favorites/movers${queryString ? `?${queryString}` : ""}`;

      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const accessToken = await getTokenFromCookie();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: "include",
      });

      const data: ApiResponse<{
        items: IMoverInfo[];
        nextCursor: string | null;
        hasNext: boolean;
      }> = await response.json();

      return data.data || { items: [], nextCursor: null, hasNext: false };
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
      const queryParams = language ? `?lang=${language}` : "";
      const endpoint = `/movers/${moverId}${queryParams}`;

      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const accessToken = await getTokenFromCookie();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: "include",
      });

      const data: ApiResponse<IMoverInfo> = await response.json();

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
      const endpoint = `/movers/${moverId}/quote-request`;

      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");

      const accessToken = await getTokenFromCookie();

      const headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          quoteId: data.quoteId,
          message: data.message,
          expiresAt: data.expiresAt,
        }),
      });

      const result: ApiResponse<DesignatedQuoteRequestResponse> = await response.json();

      if (!result.success) {
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
      const endpoint = `/movers/${moverId}/quote-request/check?quoteId=${quoteId}`;

      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const accessToken = await getTokenFromCookie();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: "include",
      });

      const result: ApiResponse<DesignatedQuoteRequestCheckResponse> = await response.json();
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
    status?: string,
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
      if (status) queryParams.append("status", status);

      const endpoint = `/reviews/mover/${moverId}?${queryParams.toString()}`;

      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const accessToken = await getTokenFromCookie();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: "include",
      });

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
      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const accessToken = await getTokenFromCookie();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        credentials: "include",
        body: JSON.stringify({
          moverId,
        }),
      });

      const result: ApiResponse<{ isFavorited: boolean; favoriteCount: number }> = await response.json();
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
      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const accessToken = await getTokenFromCookie();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${moverId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          credentials: "include",
        },
      );

      const result: ApiResponse<{ isFavorited: boolean; favoriteCount: number }> = await response.json();
      return result.data;
    } catch (error) {
      console.error("찜하기 제거 실패:", error);
      throw error;
    }
  },

  /**
   * 이사일이 지나지 않은 견적 확인
   */
  checkActiveEstimateRequest: async (): Promise<{ hasActiveRequest: boolean }> => {
    try {
      // 인증 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const accessToken = await getTokenFromCookie();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movers/active-estimate-request/check`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          credentials: "include",
        },
      );

      const result: ApiResponse<{ hasActiveRequest: boolean }> = await response.json();
      return result.data;
    } catch (error) {
      console.error("이사일이 지나지 않은 견적 확인 에러:", error);
      throw error;
    }
  },
};

export default findMoverApi;
