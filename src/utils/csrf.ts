// CSRF 토큰 관리 유틸리티
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

// CSRF 토큰을 가져오는 함수
export const getCSRFToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/csrf-token`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!response.ok) {
      console.error("CSRF 토큰 조회 실패:", response.status);
      return null;
    }

    const data = await response.json();
    return data.data?.token || null;
  } catch (error) {
    console.error("CSRF 토큰 조회 중 오류:", error);
    return null;
  }
};

// 쿠키에서 CSRF 토큰을 가져오는 함수
export const getCSRFTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const xsrfCookie = cookies.find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));

  if (xsrfCookie) {
    return xsrfCookie.split("=")[1];
  }

  return null;
};

// CSRF 토큰이 유효한지 확인하는 함수
export const isCSRFTokenValid = (token: string | null): boolean => {
  return token !== null && token.length > 0;
};
