"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import CalendarWithSchedule from "@/components/moverMyPage/schedule/CalendarWithSchedule";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useMoverScheduleApi } from "@/hooks/useMoverScheduleApi";
import {
  Schedule,
  ScheduleDisplay,
  ScheduleItemProps,
  ScheduleListProps,
  EmptyStateProps,
  PageHeaderProps,
  CalendarSectionProps,
  DetailSectionProps,
} from "@/types/schedule";
import { groupSchedulesByDate, getSchedulesForDate, getStatusStyleClass, getStatusText } from "@/utils/scheduleUtils";
import { useLanguageStore } from "@/stores/languageStore";

// 페이지 스타일 상수
const PAGE_STYLES = {
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
} as const;

// 스케줄 아이템 컴포넌트
const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, t, tEstimateRequest }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-900">{schedule.customerName}</span>
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyleClass(schedule.status)}`}>
        {getStatusText(schedule.status, t)}
      </span>
    </div>
    <div className="mb-2 text-sm text-gray-600">
      <div className="mb-1">
        <span className="font-medium">{t("movingType")}:</span> {tEstimateRequest(`movingTypes.${schedule.movingType}`)}
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
const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="py-8 text-center text-gray-500">{message}</div>
);

// 스케줄 목록 컴포넌트
const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, t, tEstimateRequest }) => {
  if (schedules.length === 0) {
    return <EmptyState message={t("noSchedule")} />;
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <ScheduleItem key={schedule.id} schedule={schedule} t={t} tEstimateRequest={tEstimateRequest} />
      ))}
    </div>
  );
};

// 헤더 컴포넌트
const PageHeader: React.FC<PageHeaderProps> = ({ t }) => (
  <div className={PAGE_STYLES.header}>
    <h1 className={PAGE_STYLES.title}>{t("title")}</h1>
    <p className={PAGE_STYLES.description}>{t("description")}</p>
  </div>
);

// 캘린더 영역 컴포넌트
const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  setSelectedDate,
  getSchedulesForSelectedDate,
  setCurrentMonth,
}) => (
  <div className={PAGE_STYLES.calendarContainer}>
    <div className={PAGE_STYLES.calendarCard}>
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
const DetailSection: React.FC<DetailSectionProps> = ({
  headerText,
  isLoadingMonthly,
  selectedDate,
  selectedDateSchedules,
  t,
  tEstimateRequest,
}) => (
  <div className={PAGE_STYLES.detailContainer}>
    <div className={PAGE_STYLES.detailCard}>
      <h3 className={PAGE_STYLES.detailTitle}>{headerText}</h3>

      {isLoadingMonthly ? (
        <LoadingSpinner containerClassName="py-8" />
      ) : selectedDate ? (
        <ScheduleList schedules={selectedDateSchedules} t={t} tEstimateRequest={tEstimateRequest} />
      ) : (
        <EmptyState message={t("selectDateToView")} />
      )}
    </div>
  </div>
);

// 메인 스케줄 페이지 컴포넌트
const MoverSchedulePage = () => {
  const t = useTranslations("schedule");
  const tEstimateRequest = useTranslations("estimateRequest");
  const { language } = useLanguageStore();
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
    (date: Date): ScheduleDisplay[] => {
      const schedules = getSchedulesForDate(date, schedulesByDate);
      return schedules.map((schedule) => ({
        ...schedule,
        movingType: tEstimateRequest(`movingTypes.${schedule.movingType}`),
      }));
    },
    [schedulesByDate, tEstimateRequest],
  );

  // 선택된 날짜의 스케줄
  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate, schedulesByDate) : [];

  // 번역이 로드되었는지 확인하는 함수
  const isTranslationLoaded = useCallback(
    (translationKey: string) => {
      try {
        const result = t(translationKey);
        // 번역 키가 그대로 반환되면 아직 로드되지 않은 것
        return result !== translationKey && result !== `schedule.${translationKey}`;
      } catch {
        return false;
      }
    },
    [t],
  );

  // 날짜 포맷팅 함수
  const formatDate = useCallback(
    (date: Date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();

      // 언어별 기본 일정 텍스트
      const getDefaultScheduleText = () => {
        switch (language) {
          case "ko":
            return "일정";
          case "zh":
            return "日程";
          default:
            return "Schedule";
        }
      };

      // 번역이 로드되었는지 확인하고 안전한 기본값 사용
      let scheduleText = getDefaultScheduleText();

      try {
        // 새로운 키를 사용하여 번역 가져오기
        const translatedText = t("scheduleText");
        // 번역이 제대로 로드되었는지 확인 (키가 그대로 반환되지 않았는지)
        if (
          translatedText &&
          translatedText !== "scheduleText" &&
          translatedText !== "schedule.scheduleText" &&
          !translatedText.includes("schedule.")
        ) {
          scheduleText = translatedText;
        }
      } catch {
        // 번역 로드 실패 시 기본값 사용
        scheduleText = getDefaultScheduleText();
      }

      if (language === "ko") {
        return `${month}월 ${day}일 ${scheduleText}`;
      } else if (language === "zh") {
        return `${month}月${day}日 ${scheduleText}`;
      } else {
        // 영어
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return `${monthNames[month - 1]} ${day} ${scheduleText}`;
      }
    },
    [language, t],
  );

  // 헤더 텍스트 - 날짜 번역 추가
  const headerText = selectedDate ? formatDate(selectedDate) : t("selectDate");

  return (
    <div className={PAGE_STYLES.container}>
      <PageHeader t={t} />

      <div className={PAGE_STYLES.grid}>
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
          tEstimateRequest={tEstimateRequest}
        />
      </div>
    </div>
  );
};

export default MoverSchedulePage;
