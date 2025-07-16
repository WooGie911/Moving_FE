// 견적 관련 API 서비스
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

// API 응답 타입
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 견적 데이터 타입 (백엔드 API 응답에 맞게 조정)
export interface IQuoteData {
  id: number;
  userId: number;
  movingType: string;
  departureAddr: string;
  arrivalAddr: string;
  departureDetail?: string;
  arrivalDetail?: string;
  departureRegion?: string;
  arrivalRegion?: string;
  movingDate: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 견적 생성/수정 요청 타입
export interface IQuoteRequest {
  movingType: string;
  departure: {
    zonecode: string;
    roadAddress: string;
    jibunAddress: string;
    extraAddress: string;
    detailAddress: string;
  };
  arrival: {
    zonecode: string;
    roadAddress: string;
    jibunAddress: string;
    extraAddress: string;
    detailAddress: string;
  };
  movingDate: string;
  isDateConfirmed: boolean;
  description?: string;
}

// API 호출 헬퍼 함수
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem("accessToken");
    const url = `${API_BASE_URL}${endpoint}`;

    console.log("API 호출 정보:", {
      url,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      body: options.body,
    });

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    console.log("API 응답 상태:", response.status, response.statusText);

    const data = await response.json();
    console.log("API 응답 데이터:", data);

    if (!response.ok) {
      throw new Error(data.message || "API 호출에 실패했습니다.");
    }

    return data;
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
};

// 견적 서비스 클래스
export class QuoteService {
  // 견적 생성
  static async createQuote(quoteData: IQuoteRequest): Promise<ApiResponse> {
    return apiCall("/quotes", {
      method: "POST",
      body: JSON.stringify(quoteData),
    });
  }

  // 활성 견적 수정
  static async updateActiveQuote(quoteData: Partial<IQuoteRequest>): Promise<ApiResponse> {
    return apiCall("/quotes/active", {
      method: "PATCH",
      body: JSON.stringify(quoteData),
    });
  }

  // 견적 수정 (특정 ID)
  static async updateQuote(quoteId: string, quoteData: Partial<IQuoteRequest>): Promise<ApiResponse> {
    return apiCall(`/quotes/active/${quoteId}`, {
      method: "PATCH",
      body: JSON.stringify(quoteData),
    });
  }

  // 견적 삭제 (취소)
  static async deleteQuote(): Promise<ApiResponse> {
    return apiCall("/quotes/active", {
      method: "DELETE",
    });
  }

  // 활성 견적 조회
  static async getActiveQuote(): Promise<ApiResponse<IQuoteData>> {
    console.log("getActiveQuote 호출 시작");
    const response = await apiCall<IQuoteData>("/quotes/active");
    console.log("QuoteService.getActiveQuote 응답:", response);
    return response;
  }
}

export default QuoteService;
