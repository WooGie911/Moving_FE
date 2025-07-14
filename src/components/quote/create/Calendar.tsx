"use client";

import React, { useState } from "react";
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
import { ICalendarProps, IDateObj } from "@/types/quote";

// Calendar 컴포넌트 화살표 함수로 변경
const Calendar: React.FC<ICalendarProps> = ({ value, onChange }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const calendarMatrix = getCalendarMatrix(currentDate);
  const today = startOfDay(new Date()); // 오늘 날짜 (시간 제거)

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    // 과거 날짜는 선택할 수 없음
    if (isBefore(startOfDay(date), today)) {
      return;
    }
    onChange(date);
  };

  return (
    <div className="w-full pb-[2px]">
      {/* 연/월, 이전/다음 버튼 */}
      <div className="mt-[14px] flex w-full items-center justify-between px-[14px] py-[11px]">
        <button onClick={handlePrevMonth}>
          <span className="block lg:hidden">
            <Image src={LeftArrowIcon} alt="left-arrow" />
          </span>
          <span className="hidden lg:block">
            <Image src={LeftBigArrowIcon} alt="left-arrow-big" />
          </span>
        </button>
        <span className="text-black-400 text-base leading-[26px] font-semibold lg:text-xl lg:leading-[30px]">
          {format(currentDate, "yyyy. MM")}
        </span>
        <button onClick={handleNextMonth}>
          <span className="block lg:hidden">
            <Image src={RightArrowIcon} alt="right-arrow" />
          </span>
          <span className="hidden lg:block">
            <Image src={RightBigArrowIcon} alt="right-arrow-big" />
          </span>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="flex w-full text-sm leading-[22px] font-medium text-gray-400 lg:text-xl lg:leading-8">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="mx-[2px] my-[2px] flex aspect-square flex-1 items-center justify-center text-center">
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      {calendarMatrix.map((week, i) => (
        <div className="text-black-400 flex w-full text-sm leading-[22px] font-medium lg:text-xl lg:leading-8" key={i}>
          {week.map((dateObj, j) => {
            const isPrevOrNextMonth = dateObj.isOtherMonth;
            const isSelected = value && format(value, "yyyy-MM-dd") === format(dateObj.date, "yyyy-MM-dd");
            const isCurrentDay = isToday(dateObj.date);
            const isPastDate = isBefore(startOfDay(dateObj.date), today);

            const cellClass = [
              "basis-[14.28%] aspect-square flex items-center justify-center p-0 select-none",
              isPrevOrNextMonth
                ? "text-gray-400 cursor-not-allowed"
                : isPastDate
                  ? "text-gray-300 cursor-not-allowed"
                  : "cursor-pointer text-gray-900",
              isCurrentDay && !isPastDate ? "font-black" : "",
              isSelected ? "bg-primary-400 rounded-full text-white" : "",
            ].join(" ");

            return (
              <div
                key={j}
                onClick={() => handleDateClick(dateObj.date)}
                className={cellClass}
                title={isPrevOrNextMonth || isPastDate ? "과거 날짜는 선택할 수 없습니다" : ""}
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

// getCalendarMatrix 함수도 화살표 함수로 변경
const getCalendarMatrix = (date: Date): IDateObj[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDay = getDay(startOfMonth(date));
  const daysInMonth = getDaysInMonth(date);
  const prevMonth = subMonths(date, 1);
  const daysInPrevMonth = getDaysInMonth(prevMonth);
  const days: IDateObj[] = [];

  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isOtherMonth: true,
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      date: new Date(year, month, i),
      isOtherMonth: false,
    });
  }
  while (days.length % 7 !== 0) {
    const nextDay: number = days.length - (startDay + daysInMonth) + 1;
    days.push({
      day: nextDay,
      date: new Date(year, month + 1, nextDay),
      isOtherMonth: true,
    });
  }
  const matrix: IDateObj[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    matrix.push(days.slice(i, i + 7));
  }
  return matrix;
};

export default Calendar;
