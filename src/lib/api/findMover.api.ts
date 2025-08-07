import {
  IMoverInfo,
  IMoverListParams,
  MoverListResponse,
  DesignatedQuoteRequestResponse,
  DesignatedQuoteRequestCheckResponse,
} from "@/types/mover.types";
import { ApiResponse } from "@/types/api.types";
import { REGION_LIST, SERVICE_TYPE_LIST } from "@/lib/utils/moverStaticData";
import { apiGet, apiPost, apiDelete } from "@/utils/apiHelpers";

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
      const data: ApiResponse<MoverListResponse> = await apiGet(endpoint);

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

      const data: ApiResponse<{
        items: IMoverInfo[];
        nextCursor: string | null;
        hasNext: boolean;
      }> = await apiGet(endpoint);

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

      const data: ApiResponse<IMoverInfo> = await apiGet(endpoint);
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

      // 인증 토큰과 CSRF 토큰 가져오기
      const { getTokenFromCookie } = await import("@/utils/auth");
      const { getCSRFTokenFromCookie, getCSRFToken } = await import("@/utils/csrf");

      const accessToken = await getTokenFromCookie();

      // CSRF 토큰을 항상 새로 요청 (캐시된 토큰 문제 해결)
      let csrfToken = null;
      try {
        console.log("🔄 CSRF 토큰 새로 요청 중...");
        csrfToken = await getCSRFToken();
        console.log("✅ 새 CSRF 토큰:", csrfToken);
      } catch (error) {
        console.warn("❌ CSRF 토큰 가져오기 실패:", error);
        // 실패 시 쿠키에서 가져오기 시도
        csrfToken = getCSRFTokenFromCookie();
      }

      console.log("🔍 CSRF 디버깅:", {
        hasAccessToken: !!accessToken,
        hasCSRFToken: !!csrfToken,
        csrfToken: csrfToken,
      });

      const headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(csrfToken && { "X-CSRF-Token": csrfToken }),
      };

      console.log("📤 요청 헤더:", headers);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"}${endpoint}`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          quoteId: data.quoteId,
          message: data.message,
          expiresAt: data.expiresAt,
        }),
      });

      console.log("📥 응답 상태:", response.status, response.statusText);

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
      console.log("[checkDesignatedQuoteRequest] moverId:", moverId);
      console.log("[checkDesignatedQuoteRequest] quoteId:", quoteId);

      const endpoint = `/movers/${moverId}/quote-request/check?quoteId=${quoteId}`;
      console.log("[checkDesignatedQuoteRequest] endpoint:", endpoint);

      const result: ApiResponse<DesignatedQuoteRequestCheckResponse> = await apiGet(endpoint);
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
      return await apiGet(endpoint);
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
      const result: ApiResponse<{ isFavorited: boolean; favoriteCount: number }> = await apiPost("/favorites", {
        moverId,
      });
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
      const result: ApiResponse<{ isFavorited: boolean; favoriteCount: number }> = await apiDelete(
        `/favorites/${moverId}`,
      );
      return result.data;
    } catch (error) {
      console.error("찜하기 제거 실패:", error);
      throw error;
    }
  },
};

export default findMoverApi;
