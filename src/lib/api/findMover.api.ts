import { IMoverInfo, IMoverListParams } from "@/types/findMover";
import { REGION_LIST, SERVICE_TYPE_LIST } from "@/lib/utils/moverStaticData";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const findMoverApi = {
  /**
   * 기사님 리스트 조회 API
   */
  fetchMovers: async (params: IMoverListParams = {}): Promise<IMoverInfo[]> => {
    try {
      const query = new URLSearchParams();
      if (params.region) query.append("region", params.region);
      if (params.serviceTypeId) query.append("serviceTypeId", params.serviceTypeId.toString());
      if (params.search) query.append("search", params.search);
      if (params.sort) query.append("sort", params.sort);
      if (params.cursor) query.append("cursor", params.cursor.toString());
      if (params.take) query.append("take", params.take.toString());

      const res = await fetch(`${API_URL}/movers?${query.toString()}`);

      if (res.status === 404) {
        return [];
      }

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("인증이 필요합니다.");
        } else if (res.status === 403) {
          throw new Error("접근 권한이 없습니다.");
        } else {
          return [];
        }
      }

      const data = await res.json();
      if (!data) {
        return [];
      }

      if (Array.isArray(data.data)) {
        return data.data;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  /**
   * 찜한 기사님 조회 API (최신순 3명)
   */
  fetchFavoriteMovers: async (): Promise<IMoverInfo[]> => {
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
      const res = await fetch(`${API_URL}/movers/favorite`, {
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

      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("API 호출 실패:", error);
      throw error;
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
};

export default findMoverApi;
