import { IReview } from "@/types/findMover";
import { IWritableCardData } from "@/types/review";
import { getTokenFromCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const reviewApi = {
  /**
   * 1. 리뷰 작성 (PATCH)
   * @param reviewId 리뷰 ID
   * @param rating 평점
   * @param content 리뷰 내용
   */
  postReview: async (reviewId: string, rating: number, content: string): Promise<IReview | null> => {
    try {
      const accessToken = await getTokenFromCookie();
      if (!accessToken) throw new Error("로그인이 필요합니다.");
      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
   * 2. 리뷰 작성 가능한 Quote 리스트 조회
   * @param page 페이지 번호
   * @param pageSize 페이지 크기
   */
  fetchWritableQuotes: async (
    page: number = 1,
    pageSize: number = 4,
  ): Promise<{ items: IWritableCardData[]; total: number; page: number; pageSize: number }> => {
    return Promise.resolve({
      items: [],
      total: 0,
      page,
      pageSize,
    });
  },
};

export default reviewApi;
