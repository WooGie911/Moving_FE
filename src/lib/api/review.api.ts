import { IReview, IReviewListResponse } from "@/types/findMover";
import { IWritableCardData } from "@/types/review";
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
   */
  postReview: async (reviewId: string, rating: number, content: string): Promise<IReview | null> => {
    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
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
   */
  fetchWritableReviews: async (
    page: number = 1,
    pageSize: number = 4,
  ): Promise<{ items: IWritableCardData[]; total: number; page: number; pageSize: number }> => {
    try {
      const res = await fetch(`${API_URL}/reviews/writable-estimateRequests?page=${page}&pageSize=${pageSize}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      });
      if (!res.ok) throw new Error("리뷰 작성 가능한 리스트 조회에 실패했습니다.");
      const data = await res.json();
      return data.data || { items: [], total: 0, page, pageSize };
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
   */
  fetchWrittenReviews: async (
    customerId: string,
    page: number = 1,
    pageSize: number = 4,
  ): Promise<IReviewListResponse> => {
    try {
      const res = await fetch(`${API_URL}/reviews/customer/${customerId}?page=${page}&pageSize=${pageSize}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      });
      if (!res.ok) throw new Error("내가 쓴 리뷰 목록 조회에 실패했습니다.");
      const data = await res.json();
      return data.data || { items: [], total: 0, page, pageSize };
    } catch (error) {
      console.error("내가 쓴 리뷰 목록 조회 실패:", error);
      throw error;
    }
  },
};

export default reviewApi;
