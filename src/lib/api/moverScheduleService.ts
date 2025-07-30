// 기사님 스케줄 관련 API 서비스
import { getTokenFromCookie } from "@/utils/auth";
import { Schedule, ScheduleApiResponse } from "@/types/schedule";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

// API 설정
const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
} as const;

// 에러 메시지
const ERROR_MESSAGES = {
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  UNAUTHORIZED: "인증이 필요합니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  NOT_FOUND: "요청한 데이터를 찾을 수 없습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다.",
  DEFAULT: "API 호출에 실패했습니다.",
} as const;

/**
 * 토큰 가져오기 함수
 */
const getAccessToken = async (): Promise<string | null> => {
  try {
    return await getTokenFromCookie();
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

/**
 * HTTP 상태 코드에 따른 에러 메시지 반환
 */
const getErrorMessage = (status: number): string => {
  switch (status) {
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.DEFAULT;
  }
};

/**
 * API 호출 헬퍼 함수
 */
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<ScheduleApiResponse> => {
  try {
    const token = await getAccessToken();
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    // 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.log("스케줄 API 호출:", {
        url,
        method: options.method || "GET",
        headers: {
          ...API_CONFIG.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || getErrorMessage(response.status);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("스케줄 API 호출 오류:", error);
    throw error;
  }
};

/**
 * 기사님 스케줄 서비스 클래스
 */
export class MoverScheduleService {
  /**
   * 월별 스케줄 조회 (캘린더용)
   */
  static async getMonthlySchedules(year: number, month: number): Promise<ScheduleApiResponse> {
    return apiCall<Schedule[]>(`/mover-schedules/monthly/${year}/${month}`, {
      method: "GET",
    });
  }
}

export default MoverScheduleService;
