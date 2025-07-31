"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  getDaysInMonth,
  addMonths,
  subMonths,
  startOfMonth,
  getDay,
  isToday,
  format,
  isBefore,
  startOfDay,
} from "date-fns";
import LeftArrowIcon from "@/assets/icon/arrow/icon-left.png";
import RightArrowIcon from "@/assets/icon/arrow/icon-right.png";
import LeftBigArrowIcon from "@/assets/icon/arrow/icon-left-lg.png";
import RightBigArrowIcon from "@/assets/icon/arrow/icon-right-lg.png";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/stores/languageStore";

interface IDateObj {
  day: number;
  date: Date;
  isOtherMonth: boolean;
}

interface ISchedule {
  id: string;
  customerName: string;
  movingType: "소형이사" | "가정이사" | "원룸이사" | "사무실이사";
  time: string;
  status: "confirmed" | "pending" | "completed";
  fromAddress: string;
  toAddress: string;
}

interface ICalendarWithScheduleProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  getSchedulesForDate: (date: Date) => ISchedule[];
  onMonthChange?: (date: Date) => void;
  className?: string;
}

// 공통 스타일 변수 (기존 Calendar 스타일 유지)
const CALENDAR_STYLES: Record<string, string> = {
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

// 안전한 날짜 생성 함수
const createSafeDate = (year: number, month: number, day: number): Date => {
  return new Date(Date.UTC(year, month, day));
};

// 캘린더 매트릭스 생성 함수
const getCalendarMatrix = (date: Date): IDateObj[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDay = getDay(startOfMonth(date));
  const daysInMonth = getDaysInMonth(date);
  const prevMonth = subMonths(date, 1);
  const daysInPrevMonth = getDaysInMonth(prevMonth);
  const days: IDateObj[] = [];

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
  const matrix: IDateObj[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    matrix.push(days.slice(i, i + 7));
  }

  return matrix;
};

const CalendarWithSchedule: React.FC<ICalendarWithScheduleProps> = ({
  value,
  onChange,
  getSchedulesForDate,
  onMonthChange,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const today = startOfDay(new Date());
  const t = useTranslations("estimateRequest");

  // 언어 변경 시 강제 리렌더링을 위한 언어 상태 사용
  const { language } = useLanguageStore();

  // 요일 배열을 번역 함수로 생성 (언어 변경 시 자동 업데이트)
  const daysOfWeek = useMemo(
    () => [
      t("weekdays.sunday"),
      t("weekdays.monday"),
      t("weekdays.tuesday"),
      t("weekdays.wednesday"),
      t("weekdays.thursday"),
      t("weekdays.friday"),
      t("weekdays.saturday"),
    ],
    [t, language], // language를 의존성에 추가하여 언어 변경 시 업데이트
  );

  // 캘린더 매트릭스를 useMemo로 메모이제이션
  const calendarMatrix = useMemo(() => getCalendarMatrix(currentDate), [currentDate]);

  const handlePrevMonth = useCallback(() => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  }, [currentDate, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  }, [currentDate, onMonthChange]);

  const handleDateClick = useCallback(
    (date: Date) => {
      const selectedDate = createSafeDate(date.getFullYear(), date.getMonth(), date.getDate());
      onChange(selectedDate);
    },
    [onChange],
  );

  const getDateCellClass = useCallback(
    (dateObj: IDateObj, isSelected: boolean): string => {
      const isPastDate = isBefore(startOfDay(dateObj.date), today);
      const isCurrentDay = isToday(dateObj.date);

      const classes = [CALENDAR_STYLES.dateCell];

      if (dateObj.isOtherMonth) {
        classes.push(CALENDAR_STYLES.otherMonth);
      } else if (isPastDate) {
        classes.push(CALENDAR_STYLES.pastDate);
      } else {
        classes.push(CALENDAR_STYLES.currentDate);
      }

      if (isCurrentDay) {
        classes.push(CALENDAR_STYLES.today);
      }

      // 선택된 날짜 스타일은 개별적으로 적용되므로 여기서는 제외

      return classes.join(" ");
    },
    [today],
  );

  // 선택된 날짜와 현재 날짜를 비교하는 함수
  const isDateSelected = useCallback(
    (dateObj: IDateObj): boolean => {
      if (!value) return false;
      return (
        dateObj.date.getFullYear() === value.getFullYear() &&
        dateObj.date.getMonth() === value.getMonth() &&
        dateObj.date.getDate() === value.getDate()
      );
    },
    [value],
  );

  // 일정 표시기 렌더링 (원형으로 표시)
  const renderScheduleIndicator = useCallback(
    (dateObj: IDateObj) => {
      const schedules = getSchedulesForDate(dateObj.date);

      if (schedules.length === 0) return null;

      return (
        <div className={CALENDAR_STYLES.scheduleIndicator}>
          {schedules.slice(0, 2).map((schedule, index) => (
            <div
              key={schedule.id}
              className={`${CALENDAR_STYLES.scheduleDot} ${
                index === 0
                  ? schedule.status === "confirmed"
                    ? "bg-primary-500"
                    : schedule.status === "pending"
                      ? "bg-primary-400"
                      : "bg-gray-500"
                  : schedule.status === "confirmed"
                    ? "bg-primary-300"
                    : schedule.status === "pending"
                      ? "bg-primary-200"
                      : "bg-gray-400"
              }`}
              title={`${schedule.customerName}님 - ${schedule.movingType}`}
            />
          ))}
          {schedules.length > 2 && <div className="text-xs text-gray-500">+{schedules.length - 2}</div>}
        </div>
      );
    },
    [getSchedulesForDate],
  );

  const containerClasses = [CALENDAR_STYLES.container];
  if (className) {
    containerClasses.push(className);
  }

  return (
    <div className={containerClasses.join(" ")}>
      {/* 헤더 - 연/월, 이전/다음 버튼 */}
      <div className={CALENDAR_STYLES.header}>
        <button onClick={handlePrevMonth} className="focus:outline-none">
          <span className="block lg:hidden">
            <Image src={LeftArrowIcon} alt="이전 달" />
          </span>
          <span className="hidden lg:block">
            <Image src={LeftBigArrowIcon} alt="이전 달" />
          </span>
        </button>

        <span className={CALENDAR_STYLES.monthText}>{format(currentDate, "yyyy. MM")}</span>

        <button onClick={handleNextMonth} className="focus:outline-none">
          <span className="block lg:hidden">
            <Image src={RightArrowIcon} alt="다음 달" />
          </span>
          <span className="hidden lg:block">
            <Image src={RightBigArrowIcon} alt="다음 달" />
          </span>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className={CALENDAR_STYLES.dayHeader}>
        {daysOfWeek.map((day) => (
          <div key={day} className={CALENDAR_STYLES.dayCell}>
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      {calendarMatrix.map((week, weekIndex) => (
        <div className={CALENDAR_STYLES.weekRow} key={weekIndex}>
          {week.map((dateObj, dayIndex) => {
            const isSelected = isDateSelected(dateObj);
            const cellClass = getDateCellClass(dateObj, isSelected);

            return (
              <div key={dayIndex} onClick={() => handleDateClick(dateObj.date)} className={cellClass}>
                <div className="flex h-full flex-col items-center justify-center">
                  <div className={isSelected ? CALENDAR_STYLES.selected : CALENDAR_STYLES.dateNumber}>
                    {dateObj.day}
                  </div>
                  {!dateObj.isOtherMonth && renderScheduleIndicator(dateObj)}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CalendarWithSchedule;
