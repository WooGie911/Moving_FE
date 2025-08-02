// 스케줄 관련 유틸리티 함수들
import { Schedule, ScheduleStatus, CalendarDateObj } from "@/types/schedule";

// 스케줄 상태 스타일 클래스
const STATUS_STYLE_CLASSES = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
} as const;

// 이사 유형 매핑
const MOVE_TYPE_MAPPING = {
  SMALL: "small",
  HOME: "home",
  OFFICE: "office",
} as const;

// 스케줄 상태 매핑
const SCHEDULE_STATUS_MAPPING = {
  APPROVED: "confirmed",
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 */
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * 년월 정보를 가져오는 함수
 */
export const getCurrentYearMonth = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

/**
 * 이전/다음 달 정보를 계산하는 함수
 */
export const getAdjacentMonth = (year: number, month: number) => {
  const prevMonth = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

  return { prevMonth, nextMonth };
};

/**
 * 스케줄을 날짜별로 그룹화하는 함수
 */
export const groupSchedulesByDate = (schedules: Schedule[]): Record<string, Schedule[]> => {
  const grouped: Record<string, Schedule[]> = {};

  schedules.forEach((schedule) => {
    const dateString = schedule.moveDate;
    if (!grouped[dateString]) {
      grouped[dateString] = [];
    }
    grouped[dateString].push(schedule);
  });

  return grouped;
};

/**
 * 특정 날짜의 스케줄을 가져오는 함수
 */
export const getSchedulesForDate = (date: Date, schedulesByDate: Record<string, Schedule[]>): Schedule[] => {
  const dateString = formatDateToString(date);
  return schedulesByDate[dateString] || [];
};

/**
 * 스케줄 상태에 따른 스타일 클래스 반환
 */
export const getStatusStyleClass = (status: ScheduleStatus): string => {
  return STATUS_STYLE_CLASSES[status] || STATUS_STYLE_CLASSES.pending;
};

/**
 * 스케줄 상태 텍스트 반환
 */
export const getStatusText = (status: ScheduleStatus, t: (key: string) => string): string => {
  switch (status) {
    case "confirmed":
      return t("status.confirmed");
    case "pending":
      return t("status.pending");
    case "completed":
      return t("status.completed");
    default:
      return t("status.pending");
  }
};

/**
 * 백엔드 이사 유형을 프론트엔드 형식으로 변환
 */
export const mapBackendMoveType = (backendType: string): string => {
  return MOVE_TYPE_MAPPING[backendType as keyof typeof MOVE_TYPE_MAPPING] || "small";
};

/**
 * 백엔드 상태를 프론트엔드 형식으로 변환
 */
export const mapBackendStatus = (backendStatus: string): ScheduleStatus => {
  return (
    (SCHEDULE_STATUS_MAPPING[backendStatus as keyof typeof SCHEDULE_STATUS_MAPPING] as ScheduleStatus) || "pending"
  );
};

/**
 * 날짜가 오늘인지 확인하는 함수
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

/**
 * 날짜가 과거인지 확인하는 함수
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * 안전한 날짜 생성 함수
 */
export const createSafeDate = (year: number, month: number, day: number): Date => {
  return new Date(Date.UTC(year, month, day));
};

/**
 * 캘린더 매트릭스 생성 함수
 */
export const getCalendarMatrix = (date: Date): CalendarDateObj[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();
  const days: CalendarDateObj[] = [];

  // 이전 달의 날짜들 추가
  for (let i = startDay - 1; i >= 0; i--) {
    const prevMonthDate = createSafeDate(year, month - 1, daysInPrevMonth - i);
    days.push({
      day: daysInPrevMonth - i,
      date: prevMonthDate,
      isOtherMonth: true,
    });
  }

  // 현재 달의 날짜들 추가
  for (let i = 1; i <= daysInMonth; i++) {
    const currentMonthDate = createSafeDate(year, month, i);
    days.push({
      day: i,
      date: currentMonthDate,
      isOtherMonth: false,
    });
  }

  // 다음 달의 날짜들 추가 (7의 배수가 될 때까지)
  while (days.length % 7 !== 0) {
    const nextDay: number = days.length - (startDay + daysInMonth) + 1;
    const nextMonthDate = createSafeDate(year, month + 1, nextDay);
    days.push({
      day: nextDay,
      date: nextMonthDate,
      isOtherMonth: true,
    });
  }

  // 7일씩 나누어 매트릭스 생성
  const matrix: CalendarDateObj[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    matrix.push(days.slice(i, i + 7));
  }

  return matrix;
};
