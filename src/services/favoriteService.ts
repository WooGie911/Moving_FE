// 찜하기 관련 API 서비스
import { getTokenFromCookie } from "@/utils/auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API 응답 타입
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 찜하기 상태 타입
export interface IFavoriteStatus {
  isFavorited: boolean;
  favoriteCount: number;
}

// 찜하기 요청 타입
export interface IFavoriteRequest {
  moverId: number;
}

// 토큰 가져오기 함수
const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
};

// API 호출 헬퍼 함수
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const token = await getAccessToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText || "찜하기 API 호출에 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

// 찜하기 서비스 클래스
export class FavoriteService {
  // 찜하기 추가
  static async addFavorite(moverId: string): Promise<ApiResponse<IFavoriteStatus>> {
    return apiCall<IFavoriteStatus>("/favorites", {
      method: "POST",
      body: JSON.stringify({ moverId }),
    });
  }

  // 찜하기 제거
  static async removeFavorite(moverId: string): Promise<ApiResponse<IFavoriteStatus>> {
    return apiCall<IFavoriteStatus>(`/favorites/${moverId}`, {
      method: "DELETE",
    });
  }

  // 찜하기 상태 확인
  static async getFavoriteStatus(moverId: number): Promise<ApiResponse<IFavoriteStatus>> {
    return apiCall<IFavoriteStatus>(`/favorites/${moverId}/status`, {
      method: "GET",
    });
  }
}

export default FavoriteService;
