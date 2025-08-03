// 스케줄 관련 공통 상수

/**
 * 스케줄 상태 매핑
 */
export const scheduleStatusMapping = {
  APPROVED: "confirmed",
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

/**
 * 이사 유형 매핑
 */
export const moveTypeMapping = {
  SMALL: "small",
  HOME: "home",
  OFFICE: "office",
} as const;

/**
 * 스케줄 상태 스타일 클래스
 */
export const statusStyleClasses = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
} as const;

/**
 * 캘린더 스타일 상수
 */
export const calendarStyles: Record<string, string> = {
  container: "w-full pb-[2px]",
  header: "mt-[14px] flex w-full items-center justify-between px-[14px] py-[11px]",
  monthText: "text-black-400 text-base leading-[26px] font-semibold lg:text-xl lg:leading-[30px]",
  dayHeader: "grid grid-cols-7 w-full text-sm leading-[22px] font-medium text-gray-400 lg:text-xl lg:leading-8",
  dayCell: "flex aspect-square items-center justify-center text-center p-1",
  weekRow: "grid grid-cols-7 text-black-400 w-full text-sm leading-[22px] font-medium lg:text-xl lg:leading-8",
  dateCell: "aspect-square flex flex-col items-center justify-center p-1 select-none text-center relative min-h-[60px]",
  otherMonth: "text-gray-400",
  pastDate: "text-gray-400 cursor-pointer",
  currentDate: "cursor-pointer text-gray-900",
  today: "font-black",
  selected: "bg-primary-400 rounded-full text-white w-8 h-8 flex items-center justify-center mx-auto",
  dateNumber: "text-sm lg:text-base font-medium",
  scheduleIndicator: "flex gap-1 justify-center mt-1",
  scheduleDot: "w-3 h-3 rounded-full",
  scheduleCount: "text-xs text-gray-500 font-medium mt-1",
};

/**
 * 페이지 스타일 상수
 */
export const pageStyles: Record<string, string> = {
  container: "min-h-screen bg-gray-50 p-4 lg:p-6",
  header: "mb-6",
  title: "mb-2 text-2xl font-bold text-gray-900 lg:text-3xl",
  description: "text-gray-600",
  grid: "grid h-full grid-cols-1 gap-6 xl:grid-cols-3",
  calendarContainer: "xl:col-span-2",
  calendarCard: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
  detailContainer: "xl:col-span-1",
  detailCard: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
  detailTitle: "mb-4 text-lg font-semibold text-gray-900",
};

/**
 * API 관련 상수
 */
export const apiConfig = {
  staleTime: 1000 * 60 * 10, // 10분
  retryCount: 2,
  timeout: 10000,
} as const;

/**
 * 에러 메시지
 */
export const errorMessages = {
  networkError: "네트워크 오류가 발생했습니다.",
  unauthorized: "인증이 필요합니다.",
  forbidden: "접근 권한이 없습니다.",
  notFound: "요청한 데이터를 찾을 수 없습니다.",
  serverError: "서버 오류가 발생했습니다.",
  default: "API 호출에 실패했습니다.",
  monthlySchedules: "월별 스케줄 조회에 실패했습니다.",
} as const;

/**
 * 유효성 검사 상수
 */
export const validation = {
  minYear: 1900,
  minMonth: 1,
  maxMonth: 12,
} as const;
