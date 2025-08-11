"use client";

import React, { useState, useMemo, useCallback } from "react";
import { addMonths, subMonths, isToday as dateFnsIsToday, format, startOfDay } from "date-fns";
import LeftArrowIcon from "@/assets/icon/arrow/icon-left.svg";
import RightArrowIcon from "@/assets/icon/arrow/icon-right.svg";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { CalendarDateObj, CalendarWithScheduleProps } from "@/types/schedule";
import { createSafeDate, getCalendarMatrix, isToday, isPastDate } from "@/utils/scheduleUtils";

// 캘린더 스타일 상수
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

const CalendarWithSchedule: React.FC<CalendarWithScheduleProps> = ({
  value,
  onChange,
  getSchedulesForDate,
  onMonthChange,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const today = startOfDay(new Date());
  const t = useTranslations();

  // 언어 변경 시 강제 리렌더링을 위한 언어 상태 사용
  const locale = useLocale();

  // 요일 배열을 번역 함수로 생성 (언어 변경 시 자동 업데이트)
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
    [t, locale], // language를 의존성에 추가하여 언어 변경 시 업데이트
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

  const getDateCellClass = useCallback((dateObj: CalendarDateObj, isSelected: boolean): string => {
    const isPast = isPastDate(startOfDay(dateObj.date));
    const isCurrentDay = isToday(dateObj.date);

    const classes = [CALENDAR_STYLES.dateCell];

    if (dateObj.isOtherMonth) {
      classes.push(CALENDAR_STYLES.otherMonth);
    } else if (isPast) {
      classes.push(CALENDAR_STYLES.pastDate);
    } else {
      classes.push(CALENDAR_STYLES.currentDate);
    }

    if (isCurrentDay) {
      classes.push(CALENDAR_STYLES.today);
    }

    return classes.join(" ");
  }, []);

  // 선택된 날짜와 현재 날짜를 비교하는 함수
  const isDateSelected = useCallback(
    (dateObj: CalendarDateObj): boolean => {
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
    (dateObj: CalendarDateObj) => {
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
    <div className={containerClasses.join(" ")} role="application" aria-label="월간 스케줄 캘린더">
      {/* 헤더 - 연/월, 이전/다음 버튼 */}
      <header className={CALENDAR_STYLES.header} role="banner">
        <button onClick={handlePrevMonth} className="focus:outline-none" aria-label="이전 달로 이동">
          <span className="block cursor-pointer">
            <Image src={LeftArrowIcon} alt="이전 달" />
          </span>
        </button>

        <h2 className={CALENDAR_STYLES.monthText} aria-live="polite">
          {format(currentDate, "yyyy. MM")}
        </h2>

        <button onClick={handleNextMonth} className="focus:outline-none" aria-label="다음 달로 이동">
          <span className="block cursor-pointer">
            <Image src={RightArrowIcon} alt="다음 달" />
          </span>
        </button>
      </header>

      {/* 요일 헤더 */}
      <div className={CALENDAR_STYLES.dayHeader} role="rowgroup" aria-label="요일 헤더">
        {daysOfWeek.map((day) => (
          <div key={day} className={CALENDAR_STYLES.dayCell} role="columnheader" aria-label={day}>
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div role="grid" aria-label={`${format(currentDate, "yyyy년 MM월")} 스케줄 캘린더`}>
        {calendarMatrix.map((week, weekIndex) => (
          <div className={CALENDAR_STYLES.weekRow} key={weekIndex} role="row">
            {week.map((dateObj, dayIndex) => {
              const isSelected = isDateSelected(dateObj);
              const cellClass = getDateCellClass(dateObj, isSelected);
              const schedules = getSchedulesForDate(dateObj.date);
              const scheduleCount = schedules.length;
              const isCurrentDay = isToday(dateObj.date);
              const isPast = isPastDate(startOfDay(dateObj.date));

              // 날짜 셀의 접근성 라벨 생성
              const getDateAriaLabel = () => {
                const dateStr = format(dateObj.date, "M월 d일");
                let label = dateStr;

                if (isCurrentDay) label += " (오늘)";
                if (isPast) label += " (과거 날짜)";
                if (isSelected) label += " (선택됨)";
                if (scheduleCount > 0) label += ` (${scheduleCount}개 일정)`;

                return label;
              };

              return (
                <div
                  key={dayIndex}
                  onClick={() => handleDateClick(dateObj.date)}
                  className={cellClass}
                  role="gridcell"
                  aria-label={getDateAriaLabel()}
                  aria-selected={isSelected}
                  tabIndex={!dateObj.isOtherMonth && !isPast ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!dateObj.isOtherMonth && !isPast) {
                        handleDateClick(dateObj.date);
                      }
                    }
                  }}
                >
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
    </div>
  );
};

export default CalendarWithSchedule;
