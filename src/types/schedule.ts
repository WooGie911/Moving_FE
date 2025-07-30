// 스케줄 관련 타입 정의

/**
 * 스케줄 상태 타입
 */
export type ScheduleStatus = "confirmed" | "pending" | "completed";

/**
 * 이사 유형 타입
 */
export type MovingType = "소형이사" | "가정이사" | "원룸이사" | "사무실이사";

/**
 * 스케줄 인터페이스
 */
export interface Schedule {
  id: string;
  customerName: string;
  movingType: MovingType;
  time: string;
  status: ScheduleStatus;
  fromAddress: string;
  toAddress: string;
  moveDate: string; // YYYY-MM-DD 형식
}

/**
 * API 응답 타입
 */
export interface ScheduleApiResponse {
  success: boolean;
  message: string;
  data: Schedule[];
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
}

/**
 * 월별 스케줄 조회 파라미터 타입
 */
export interface MonthlyScheduleParams {
  year: number;
  month: number;
}

/**
 * 스케줄 필터 옵션 타입
 */
export interface ScheduleFilterOptions {
  status?: ScheduleStatus;
  movingType?: MovingType;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}
