import { IReview, IWritableReviewsResponse, IWrittenReviewsResponse, IReceivedReviewsResponse } from "@/types/review";
import { getTokenFromCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
};

const reviewApi = {
  /**
   * 1. 리뷰 작성 (PATCH)
   * @param reviewId 리뷰 ID
   * @param rating 평점
   * @param content 리뷰 내용
   * @param language 언어 설정
   */
  postReview: async (reviewId: string, rating: number, content: string, language?: string): Promise<IReview | null> => {
    try {
      const queryParams = language ? `?lang=${language}` : "";

      const res = await fetch(`${API_URL}/reviews/${reviewId}${queryParams}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({ rating, content }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("로그인이 필요합니다.");
        throw new Error("리뷰 작성에 실패했습니다.");
      }
      const data = await res.json();

      return data.data || null;
    } catch (error) {
      console.error("리뷰 작성 실패:", error);
      throw error;
    }
  },

  /**
   * 2. 리뷰 작성 가능한 리스트 조회
   * @param page 페이지 번호
   * @param pageSize 페이지 크기
   * @param language 언어 설정
   */
  fetchWritableReviews: async (
    page: number = 1,
    pageSize: number = 4,
    language?: string,
  ): Promise<IWritableReviewsResponse> => {
    try {
      const query = new URLSearchParams();
      query.append("page", page.toString());
      query.append("pageSize", pageSize.toString());
      if (language) query.append("lang", language);

      const res = await fetch(`${API_URL}/reviews/writable-estimateRequests?${query.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      });
      if (!res.ok) throw new Error("리뷰 작성 가능한 리스트 조회에 실패했습니다.");
      const data = await res.json();
      return data.data || { items: [], total: 0, page, pageSize, hasNextPage: false, hasPrevPage: false };
    } catch (error) {
      console.error("리뷰 작성 가능한 리스트 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 3. 내가 쓴 리뷰 목록 조회
   * @param customerId 유저 ID
   * @param page 페이지 번호
   * @param pageSize 페이지 크기
   * @param language 언어 설정
   */
  fetchWrittenReviews: async (
    customerId: string,
    page: number = 1,
    pageSize: number = 4,
    language?: string,
  ): Promise<IWrittenReviewsResponse> => {
    try {
      const query = new URLSearchParams();
      query.append("page", page.toString());
      query.append("pageSize", pageSize.toString());
      if (language) query.append("lang", language);

      const res = await fetch(`${API_URL}/reviews/customer/${customerId}?${query.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      });
      if (!res.ok) throw new Error("내가 쓴 리뷰 목록 조회에 실패했습니다.");
      const data = await res.json();
      return data.data || { items: [], total: 0, page, pageSize, hasNextPage: false, hasPrevPage: false };
    } catch (error) {
      console.error("내가 쓴 리뷰 목록 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 4. 내가 받은 리뷰 목록 조회 (무버용)
   * @param moverId 무버 ID
   * @param page 페이지 번호
   * @param pageSize 페이지 크기
   * @param language 언어 설정
   */
  fetchReceivedReviews: async (
    moverId: string,
    page: number = 1,
    pageSize: number = 4,
    language?: string,
  ): Promise<IReceivedReviewsResponse> => {
    try {
      const query = new URLSearchParams();
      query.append("page", page.toString());
      query.append("pageSize", pageSize.toString());
      if (language) query.append("lang", language);

      const res = await fetch(`${API_URL}/reviews/mover/${moverId}?${query.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      });
      if (!res.ok) throw new Error("내가 받은 리뷰 목록 조회에 실패했습니다.");
      const data = await res.json();
      return data.data || { items: [], total: 0, page, pageSize, hasNextPage: false, hasPrevPage: false };
    } catch (error) {
      console.error("내가 받은 리뷰 목록 조회 실패:", error);
      throw error;
    }
  },
};

export default reviewApi;
