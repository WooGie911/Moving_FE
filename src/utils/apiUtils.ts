// 공통 API 유틸리티 함수들
import { getTokenFromCookie } from "@/utils/auth";
import { ApiCallOptions, QueryParams, ErrorInfo, ModalOptions } from "@/types/schedule";
import React from "react";

// 에러 메시지
const ERROR_MESSAGES = {
  networkError: "네트워크 오류가 발생했습니다.",
  unauthorized: "인증이 필요합니다.",
  forbidden: "접근 권한이 없습니다.",
  notFound: "요청한 데이터를 찾을 수 없습니다.",
  serverError: "서버 오류가 발생했습니다.",
  default: "API 호출에 실패했습니다.",
  monthlySchedules: "월별 스케줄 조회에 실패했습니다.",
} as const;

/**
 * 토큰 가져오기 함수
 */
export const getAccessToken = async (): Promise<string | undefined> => {
  try {
    const token = await getTokenFromCookie();
    return token || undefined;
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return undefined;
  }
};

/**
 * HTTP 상태 코드에 따른 에러 메시지 반환
 */
export const getErrorMessage = (status: number): string => {
  switch (status) {
    case 401:
      return ERROR_MESSAGES.unauthorized;
    case 403:
      return ERROR_MESSAGES.forbidden;
    case 404:
      return ERROR_MESSAGES.notFound;
    case 500:
      return ERROR_MESSAGES.serverError;
    default:
      return ERROR_MESSAGES.default;
  }
};

/**
 * API 호출 헬퍼 함수
 */
export const apiCall = async <T>(endpoint: string, options: ApiCallOptions = {}): Promise<T> => {
  try {
    const token = await getAccessToken();
    const apiBaseURL = options.baseURL || process.env.NEXT_PUBLIC_API_URL;
    const url = `${apiBaseURL}${endpoint}`;

    // 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === "development") {
      console.log("API 호출:", {
        url,
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
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
    console.error("API 호출 오류:", error);
    throw error;
  }
};

/**
 * 쿼리 키 생성 헬퍼
 */
export const createQueryKey = (baseKey: string, params: QueryParams): string[] => {
  return [baseKey, ...Object.values(params).map(String)];
};

/**
 * 이미지 URL 검증 및 수정 함수
 * Next.js Image 컴포넌트에서 사용할 수 있도록 URL을 정규화합니다.
 */
export const normalizeImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return "/img/mascot/profile.webp"; // 기본 프로필 이미지
  }

  // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // 상대 경로인 경우 (파일명에 확장자가 있는 경우)
  if (imageUrl.includes(".") && !imageUrl.startsWith("/")) {
    // moverImage는 CloudFront URL로 변환
    return `https://d29ije7v1csha8.cloudfront.net/mover/${imageUrl}`;
  }

  // 이미 올바른 상대 경로인 경우 (/로 시작)
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  // 기본값
  return "/img/mascot/profile.webp";
};

/**
 * 에러 처리 헬퍼
 */
export const handleApiError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

/**
 * 에러 정보 생성 헬퍼
 */
export const createErrorInfo = (error: unknown, status?: number): ErrorInfo => {
  const message = error instanceof Error ? error.message : String(error);
  return {
    message,
    status,
  };
};

/**
 * 모달 옵션 생성 헬퍼
 */
export const createModalOptions = (
  title: string,
  content: string,
  onConfirm: () => void,
  t: (key: string) => string,
): ModalOptions => ({
  title,
  children: React.createElement(
    "div",
    { className: "p-6" },
    React.createElement("p", { className: "mb-4 text-gray-700" }, content),
  ),
  buttons: [
    {
      text: t("confirm"),
      onClick: onConfirm,
    },
  ],
});
