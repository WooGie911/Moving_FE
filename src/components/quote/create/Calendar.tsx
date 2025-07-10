"use client";

import React, { useState } from "react";
import { getDaysInMonth, addMonths, subMonths, startOfMonth, getDay, isToday, format } from "date-fns";
import LeftArrowIcon from "@/assets/icon/arrow/icon-left.png";
import RightArrowIcon from "@/assets/icon/arrow/icon-right.png";
import LeftBigArrowIcon from "@/assets/icon/arrow/icon-left-lg.png";
import RightBigArrowIcon from "@/assets/icon/arrow/icon-right-lg.png";
import Image from "next/image";

interface IDateObj {
  day: number;
  date: Date;
  isOtherMonth: boolean;
}

interface ICalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

function Calendar({ value, onChange }: ICalendarProps) {
  // 현재 연/월 상태
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 달력 데이터 생성 함수 (아래에서 설명)
  const calendarMatrix = getCalendarMatrix(currentDate);

  // 월 이동 핸들러
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => onChange(date);

  return (
    <div className="mx-auto min-w-[327px] pb-[2px] md:min-w-[327px] lg:max-w-160">
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

            const cellClass = [
              "flex-1 aspect-square flex items-center justify-center mx-[2px] my-[2px] cursor-pointer select-none",
              isPrevOrNextMonth ? "text-gray-300" : "text-gray-900",
              isCurrentDay ? "font-black" : "",
              isSelected ? "bg-primary-400 rounded-full text-white" : "",
            ].join(" ");

            return (
              <div key={j} onClick={() => handleDateClick(dateObj.date)} className={cellClass}>
                {dateObj.day}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// 달력 데이터 생성 함수
function getCalendarMatrix(date: Date): IDateObj[][] {
  const year = date.getFullYear();
  const month = date.getMonth();

  // 이번달 1일의 요일
  const startDay = getDay(startOfMonth(date));
  // 이번달 마지막 날짜
  const daysInMonth = getDaysInMonth(date);

  // 저번달 마지막 날짜
  const prevMonth = subMonths(date, 1);
  const daysInPrevMonth = getDaysInMonth(prevMonth);

  // 달력에 표시할 날짜 배열
  const days: IDateObj[] = [];

  // 저번달 날짜
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isOtherMonth: true,
    });
  }
  // 이번달 날짜
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      date: new Date(year, month, i),
      isOtherMonth: false,
    });
  }
  // 다음달 날짜
  while (days.length % 7 !== 0) {
    const nextDay: number = days.length - (startDay + daysInMonth) + 1;
    days.push({
      day: nextDay,
      date: new Date(year, month + 1, nextDay),
      isOtherMonth: true,
    });
  }

  // 2차원 배열(주 단위)로 변환
  const matrix: IDateObj[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    matrix.push(days.slice(i, i + 7));
  }
  return matrix;
}

export default Calendar;
