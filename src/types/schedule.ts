// 스케줄 관련 타입 정의

/**
 * 스케줄 상태 타입
 */
export type ScheduleStatus = "confirmed" | "pending" | "completed";

/**
 * 이사 유형 타입 (프론트엔드용)
 */
export type MovingType = "small" | "home" | "office";

/**
 * 이사 유형 매핑 (백엔드 ↔ 프론트엔드)
 */
export type MoveTypeMapping = {
  SMALL: "small";
  HOME: "home";
  OFFICE: "office";
};

/**
 * 상태 매핑 (백엔드 ↔ 프론트엔드)
 */
export type StatusMapping = {
  APPROVED: "confirmed";
  PENDING: "pending";
  COMPLETED: "completed";
};

/**
 * 스케줄 인터페이스
 */
export interface Schedule {
  id: string;
  customerName: string;
  movingType: MovingType;
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

/**
 * 캘린더 날짜 객체 타입
 */
export interface CalendarDateObj {
  day: number;
  date: Date;
  isOtherMonth: boolean;
}

/**
 * 스케줄 표시용 인터페이스 (캘린더용)
 */
export interface ScheduleDisplay {
  id: string;
  customerName: string;
  movingType: string; // 번역된 이사 유형
  time?: string;
  status: ScheduleStatus;
  fromAddress: string;
  toAddress: string;
}

/**
 * 캘린더 컴포넌트 Props 타입
 */
export interface CalendarWithScheduleProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  getSchedulesForDate: (date: Date) => ScheduleDisplay[];
  onMonthChange?: (date: Date) => void;
  className?: string;
}

/**
 * 스케줄 아이템 Props 타입
 */
export interface ScheduleItemProps {
  schedule: Schedule;
  t: (key: string) => string;
  tEstimateRequest: (key: string) => string;
}

/**
 * 스케줄 목록 Props 타입
 */
export interface ScheduleListProps {
  schedules: Schedule[];
  t: (key: string) => string;
  tEstimateRequest: (key: string) => string;
}

/**
 * 빈 상태 Props 타입
 */
export interface EmptyStateProps {
  message: string;
}

/**
 * 페이지 헤더 Props 타입
 */
export interface PageHeaderProps {
  t: (key: string) => string;
}

/**
 * 캘린더 섹션 Props 타입
 */
export interface CalendarSectionProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date) => void;
  getSchedulesForSelectedDate: (date: Date) => ScheduleDisplay[];
  setCurrentMonth: (date: Date) => void;
}

/**
 * 상세 정보 섹션 Props 타입
 */
export interface DetailSectionProps {
  headerText: string;
  isLoadingMonthly: boolean;
  selectedDate: Date | undefined;
  selectedDateSchedules: Schedule[];
  t: (key: string) => string;
  tEstimateRequest: (key: string) => string;
}

/**
 * 번역 함수 타입
 */
export type TranslationFunction = (key: string) => string;

/**
 * API 호출 옵션 타입
 */
export interface ApiCallOptions extends RequestInit {
  baseURL?: string;
}

/**
 * 쿼리 파라미터 타입
 */
export interface QueryParams {
  [key: string]: string | number | boolean;
}

/**
 * 에러 정보 타입
 */
export interface ErrorInfo {
  message: string;
  code?: string;
  status?: number;
}

/**
 * 모달 옵션 타입
 */
export interface ModalOptions {
  title: string;
  children: React.ReactNode;
  buttons: Array<{
    text: string;
    onClick: () => void;
  }>;
}
