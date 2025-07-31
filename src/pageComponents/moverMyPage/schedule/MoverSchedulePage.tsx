"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import CalendarWithSchedule from "@/components/moverMyPage/schedule/CalendarWithSchedule";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useMoverScheduleApi } from "@/hooks/useMoverScheduleApi";
import { Schedule } from "@/types/schedule";
import { groupSchedulesByDate, getSchedulesForDate, getStatusStyleClass, getStatusText } from "@/utils/scheduleUtils";

// 상수 정의
const STYLES = {
  CONTAINER: "min-h-screen bg-gray-50 p-4 lg:p-6",
  HEADER: "mb-6",
  TITLE: "mb-2 text-2xl font-bold text-gray-900 lg:text-3xl",
  DESCRIPTION: "text-gray-600",
  GRID: "grid h-full grid-cols-1 gap-6 xl:grid-cols-3",
  CALENDAR_CONTAINER: "xl:col-span-2",
  CALENDAR_CARD: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
  DETAIL_CONTAINER: "xl:col-span-1",
  DETAIL_CARD: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
  DETAIL_TITLE: "mb-4 text-lg font-semibold text-gray-900",
} as const;

// 스케줄 아이템 컴포넌트
const ScheduleItem = ({ schedule, t }: { schedule: Schedule; t: (key: string) => string }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-900">{schedule.customerName}</span>
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyleClass(schedule.status)}`}>
        {getStatusText(schedule.status, t)}
      </span>
    </div>
    <div className="mb-2 text-sm text-gray-600">
      <div className="mb-1">
        <span className="font-medium">{t("movingType")}:</span> {schedule.movingType}
      </div>
      <div className="mb-1">
        <span className="font-medium">{t("from")}:</span> {schedule.fromAddress}
      </div>
      <div>
        <span className="font-medium">{t("to")}:</span> {schedule.toAddress}
      </div>
    </div>
  </div>
);

// 빈 상태 컴포넌트
const EmptyState = ({ message }: { message: string }) => (
  <div className="py-8 text-center text-gray-500">{message}</div>
);

// 스케줄 목록 컴포넌트
const ScheduleList = ({ schedules, t }: { schedules: Schedule[]; t: (key: string) => string }) => {
  if (schedules.length === 0) {
    return <EmptyState message={t("noSchedule")} />;
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <ScheduleItem key={schedule.id} schedule={schedule} t={t} />
      ))}
    </div>
  );
};

// 헤더 컴포넌트
const PageHeader = ({ t }: { t: (key: string) => string }) => (
  <div className={STYLES.HEADER}>
    <h1 className={STYLES.TITLE}>{t("title")}</h1>
    <p className={STYLES.DESCRIPTION}>{t("description")}</p>
  </div>
);

// 캘린더 영역 컴포넌트
const CalendarSection = ({
  selectedDate,
  setSelectedDate,
  getSchedulesForSelectedDate,
  setCurrentMonth,
}: {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date) => void;
  getSchedulesForSelectedDate: (date: Date) => any[];
  setCurrentMonth: (date: Date) => void;
}) => (
  <div className={STYLES.CALENDAR_CONTAINER}>
    <div className={STYLES.CALENDAR_CARD}>
      <CalendarWithSchedule
        value={selectedDate}
        onChange={setSelectedDate}
        getSchedulesForDate={getSchedulesForSelectedDate}
        onMonthChange={setCurrentMonth}
      />
    </div>
  </div>
);

// 상세 정보 영역 컴포넌트
const DetailSection = ({
  headerText,
  isLoadingMonthly,
  selectedDate,
  selectedDateSchedules,
  t,
}: {
  headerText: string;
  isLoadingMonthly: boolean;
  selectedDate: Date | undefined;
  selectedDateSchedules: Schedule[];
  t: (key: string) => string;
}) => (
  <div className={STYLES.DETAIL_CONTAINER}>
    <div className={STYLES.DETAIL_CARD}>
      <h3 className={STYLES.DETAIL_TITLE}>{headerText}</h3>

      {isLoadingMonthly ? (
        <LoadingSpinner containerClassName="py-8" />
      ) : selectedDate ? (
        <ScheduleList schedules={selectedDateSchedules} t={t} />
      ) : (
        <EmptyState message={t("selectDateToView")} />
      )}
    </div>
  </div>
);

// 메인 스케줄 페이지 컴포넌트
const MoverSchedulePage = () => {
  const t = useTranslations("schedule");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { useGetMonthlySchedules } = useMoverScheduleApi();

  // 현재 선택된 달의 스케줄 조회
  const { data: monthlySchedules = [], isLoading: isLoadingMonthly } = useGetMonthlySchedules(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
  );

  // 날짜별로 스케줄 그룹화
  const schedulesByDate = useMemo(() => groupSchedulesByDate(monthlySchedules), [monthlySchedules]);

  // 특정 날짜의 스케줄 조회
  const getSchedulesForSelectedDate = useCallback(
    (date: Date): Schedule[] => getSchedulesForDate(date, schedulesByDate),
    [schedulesByDate],
  );

  // 선택된 날짜의 스케줄
  const selectedDateSchedules = selectedDate ? getSchedulesForSelectedDate(selectedDate) : [];

  // 헤더 텍스트
  const headerText = selectedDate
    ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 ${t("scheduleFor")}`
    : t("selectDate");

  return (
    <div className={STYLES.CONTAINER}>
      <PageHeader t={t} />

      <div className={STYLES.GRID}>
        <CalendarSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          getSchedulesForSelectedDate={getSchedulesForSelectedDate}
          setCurrentMonth={setCurrentMonth}
        />

        <DetailSection
          headerText={headerText}
          isLoadingMonthly={isLoadingMonthly}
          selectedDate={selectedDate}
          selectedDateSchedules={selectedDateSchedules}
          t={t}
        />
      </div>
    </div>
  );
};

export default MoverSchedulePage;
