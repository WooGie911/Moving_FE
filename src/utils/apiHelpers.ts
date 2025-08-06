// API 호출 공통 헬퍼 함수
import { getTokenFromCookie } from "@/utils/auth";
import { getCSRFTokenFromCookie, getCSRFToken } from "@/utils/csrf";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

// 인증 헤더를 가져오는 함수
export const getAuthHeaders = async (
  additionalHeaders: Record<string, string> = {},
): Promise<Record<string, string>> => {
  const accessToken = await getTokenFromCookie();

  // CSRF 토큰 가져오기
  let csrfToken = getCSRFTokenFromCookie();
  if (!csrfToken) {
    csrfToken = await getCSRFToken();
  }

  return {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(csrfToken && { "X-XSRF-TOKEN": csrfToken }),
    ...additionalHeaders,
  };
};

// API 호출 공통 함수
export const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> => {
  try {
    const headers = await getAuthHeaders(options.headers as Record<string, string>);
    const url = `${API_BASE_URL}${endpoint}`;

    console.log("API 호출 정보:", {
      url,
      method: options.method || "GET",
      headers,
      body: options.body,
    });

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // refreshToken 쿠키 필요 시 포함
    });

    console.log("API 응답 상태:", response.status, response.statusText);

    // 401 Unauthorized → accessToken 만료 가능성
    if (response.status === 401 && retry) {
      // 토큰 재발급 로직 (필요시 구현)
      // await authApi.refreshToken();
      // return apiRequest<T>(endpoint, options, false);
    }

    if (response.status === 404) {
      // refreshToken도 만료 → 로그아웃 처리
      // authApi.logout();
      throw new Error("로그인이 만료되었습니다.");
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API 요청 실패");
    }

    const data = await response.json();
    console.log("API 응답 데이터:", data);

    return data;
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
};

// GET 요청 헬퍼
export const apiGet = async <T = any>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: "GET" });
};

// POST 요청 헬퍼
export const apiPost = async <T = any>(endpoint: string, body: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

// PUT 요청 헬퍼
export const apiPut = async <T = any>(endpoint: string, body: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

// DELETE 요청 헬퍼
export const apiDelete = async <T = any>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: "DELETE" });
};

// PATCH 요청 헬퍼
export const apiPatch = async <T = any>(endpoint: string, body: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};
