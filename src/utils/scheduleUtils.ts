// 스케줄 관련 유틸리티 함수들
import { Schedule } from "@/types/schedule";

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
export const getStatusStyleClass = (status: Schedule["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * 스케줄 상태 텍스트 반환
 */
export const getStatusText = (status: Schedule["status"], t: (key: string) => string) => {
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
