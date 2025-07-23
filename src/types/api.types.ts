// 기본 API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  nextCursor?: string;
  hasNext?: boolean;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
}

// 페이지 기반 응답 타입
export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 에러 응답 타입
export interface ErrorResponse {
  success: false;
  message: string;
  data: null;
}
