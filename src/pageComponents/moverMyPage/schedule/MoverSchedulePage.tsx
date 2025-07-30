"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import CalendarWithSchedule from "@/components/moverMyPage/schedule/CalendarWithSchedule";
import { useMoverScheduleApi } from "@/hooks/useMoverScheduleApi";
import { Schedule } from "@/types/schedule";
import { groupSchedulesByDate, getSchedulesForDate, getStatusStyleClass, getStatusText } from "@/utils/scheduleUtils";

/**
 * 스케줄 아이템 컴포넌트
 */
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
        <span className="font-medium">{t("time")}:</span> {schedule.time}
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

/**
 * 로딩 컴포넌트
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
  </div>
);

/**
 * 빈 상태 컴포넌트
 */
const EmptyState = ({ message }: { message: string }) => (
  <div className="py-8 text-center text-gray-500">{message}</div>
);

/**
 * 스케줄 목록 컴포넌트
 */
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

/**
 * 메인 스케줄 페이지 컴포넌트
 */
const MoverSchedulePage = () => {
  const t = useTranslations("schedule");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { useGetCurrentMonthSchedules } = useMoverScheduleApi();

  // 현재 달의 스케줄 조회
  const { data: monthlySchedules = [], isLoading: isLoadingMonthly } = useGetCurrentMonthSchedules();

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
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">{t("title")}</h1>
        <p className="text-gray-600">{t("description")}</p>
      </div>

      {/* 캘린더와 상세 정보 컨테이너 */}
      <div className="grid h-full grid-cols-1 gap-6 xl:grid-cols-3">
        {/* 캘린더 영역 */}
        <div className="xl:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <CalendarWithSchedule
              value={selectedDate}
              onChange={setSelectedDate}
              getSchedulesForDate={getSchedulesForSelectedDate}
            />
          </div>
        </div>

        {/* 선택된 날짜의 상세 일정 */}
        <div className="xl:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{headerText}</h3>

            {isLoadingMonthly ? (
              <LoadingSpinner />
            ) : selectedDate ? (
              <ScheduleList schedules={selectedDateSchedules} t={t} />
            ) : (
              <EmptyState message={t("selectDateToView")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoverSchedulePage;
