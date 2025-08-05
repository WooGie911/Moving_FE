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
import { ICalendarProps, IDateObj } from "@/types/estimateRequest";
import { useTranslations } from "next-intl";

// 공통 스타일 변수
const CALENDAR_STYLES: Record<string, string> = {
  container: "w-full pb-[2px]",
  header: "mt-[14px] flex w-full items-center justify-between px-[14px] py-[11px]",
  monthText: "text-black-400 text-base leading-[26px] font-semibold lg:text-xl lg:leading-[30px]",
  dayHeader: "grid grid-cols-7 w-full text-sm leading-[22px] font-medium text-gray-400 lg:text-xl lg:leading-8",
  dayCell: "mx-[2px] my-[2px] flex aspect-square items-center justify-center text-center",
  weekRow: "grid grid-cols-7 text-black-400 w-full text-sm leading-[22px] font-medium lg:text-xl lg:leading-8",
  dateCell: "aspect-square flex items-center justify-center p-0 select-none",
  otherMonth: "text-gray-400 ",
  pastDate: "text-gray-300 cursor-not-allowed",
  currentDate: "cursor-pointer text-gray-900",
  today: "font-black",
  selected: "bg-primary-400 rounded-full text-white",
};

// 안전한 날짜 생성 함수
const createSafeDate = (year: number, month: number, day: number): Date => {
  // UTC 기준으로 날짜를 생성하여 타임존 문제 방지
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

const Calendar: React.FC<ICalendarProps> = ({ value, onChange, className }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const today = startOfDay(new Date());
  const t = useTranslations();

  // 요일 배열을 번역 함수로 생성
  const daysOfWeek = useMemo(
    () => [
      t("shared.time.weekdays.sunday"),
      t("shared.time.weekdays.monday"),
      t("shared.time.weekdays.tuesday"),
      t("shared.time.weekdays.wednesday"),
      t("shared.time.weekdays.thursday"),
      t("shared.time.weekdays.friday"),
      t("shared.time.weekdays.saturday"),
    ],
    [t],
  );

  // 캘린더 매트릭스를 useMemo로 메모이제이션
  const calendarMatrix = useMemo(() => getCalendarMatrix(currentDate), [currentDate]);

  const handlePrevMonth = useCallback(() => setCurrentDate(subMonths(currentDate, 1)), [currentDate]);
  const handleNextMonth = useCallback(() => setCurrentDate(addMonths(currentDate, 1)), [currentDate]);

  const handleDateClick = useCallback(
    (date: Date) => {
      // 과거 날짜나 오늘 날짜는 선택할 수 없음
      if (isBefore(startOfDay(date), today) || isToday(date)) {
        return;
      }
      // 날짜를 정확하게 설정하여 타임존 문제 방지
      const selectedDate = createSafeDate(date.getFullYear(), date.getMonth(), date.getDate());
      onChange(selectedDate);
    },
    [onChange, today],
  );

  const getDateCellClass = useCallback(
    (dateObj: IDateObj, isSelected: boolean): string => {
      const isPastDate = isBefore(startOfDay(dateObj.date), today);
      const isCurrentDay = isToday(dateObj.date);
      const isTodayDate = isToday(dateObj.date);

      const classes = [CALENDAR_STYLES.dateCell];

      if (dateObj.isOtherMonth) {
        classes.push(CALENDAR_STYLES.otherMonth);
      } else if (isPastDate || isTodayDate) {
        classes.push(CALENDAR_STYLES.pastDate);
      } else {
        classes.push(CALENDAR_STYLES.currentDate);
      }

      if (isCurrentDay && !isPastDate && !isTodayDate) {
        classes.push(CALENDAR_STYLES.today);
      }

      if (isSelected) {
        classes.push(CALENDAR_STYLES.selected);
      }

      return classes.join(" ");
    },
    [today],
  );

  // 선택된 날짜와 현재 날짜를 비교하는 함수
  const isDateSelected = useCallback(
    (dateObj: IDateObj): boolean => {
      if (!value) return false;
      // 날짜만 비교 (시간 제외)
      return (
        dateObj.date.getFullYear() === value.getFullYear() &&
        dateObj.date.getMonth() === value.getMonth() &&
        dateObj.date.getDate() === value.getDate()
      );
    },
    [value],
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
            const isDisabled =
              dateObj.isOtherMonth || isBefore(startOfDay(dateObj.date), today) || isToday(dateObj.date);

            return (
              <div
                key={dayIndex}
                onClick={() => handleDateClick(dateObj.date)}
                className={cellClass}
                title={
                  isDisabled
                    ? isToday(dateObj.date)
                      ? t("estimateRequest.calendar.today")
                      : t("estimateRequest.calendar.pastDate")
                    : ""
                }
              >
                {dateObj.day}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
