"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import CalendarWithSchedule from "@/components/moverMyPage/schedule/CalendarWithSchedule";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useMoverScheduleApi } from "@/hooks/useMoverScheduleApi";
import {
  ScheduleDisplay,
  ScheduleItemProps,
  ScheduleListProps,
  EmptyStateProps,
  PageHeaderProps,
  CalendarSectionProps,
  DetailSectionProps,
} from "@/types/schedule";
import { groupSchedulesByDate, getSchedulesForDate, getStatusStyleClass, getStatusText } from "@/utils/scheduleUtils";
import { useLocale } from "next-intl";

// 페이지 스타일 상수
const PAGE_STYLES = {
  container: "min-h-screen bg-gray-50 p-6",
  content: "mx-auto max-w-[1600px]",
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
const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, t }) => (
  <article
    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
    aria-labelledby={`schedule-${schedule.id}-title`}
    role="article"
  >
    <header className="mb-2 flex items-center justify-between">
      <h3 id={`schedule-${schedule.id}-title`} className="text-sm font-medium text-gray-900">
        {schedule.customerName}
      </h3>
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyleClass(schedule.status)}`}
        aria-label={`상태: ${getStatusText(schedule.status, t)}`}
        role="status"
      >
        {getStatusText(schedule.status, t)}
      </span>
    </header>
    <section aria-label="스케줄 상세 정보">
      <dl className="mb-2 text-sm text-gray-600">
        <div className="mb-1">
          <dt className="inline font-medium">{t("schedule.movingType")}:</dt>
          <dd className="ml-1 inline">{t(`shared.movingTypes.${schedule.movingType}`)}</dd>
        </div>
        <div className="mb-1">
          <dt className="inline font-medium">{t("schedule.from")}:</dt>
          <dd className="ml-1 inline">{schedule.fromAddress}</dd>
        </div>
        <div>
          <dt className="inline font-medium">{t("schedule.to")}:</dt>
          <dd className="ml-1 inline">{schedule.toAddress}</dd>
        </div>
      </dl>
    </section>
  </article>
);

// 빈 상태 컴포넌트
const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="py-8 text-center text-gray-500" role="status" aria-live="polite">
    {message}
  </div>
);

// 스케줄 목록 컴포넌트
const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, t }) => {
  if (schedules.length === 0) {
    return <EmptyState message={t("schedule.noSchedule")} />;
  }

  return (
    <section className="space-y-4" aria-label="선택된 날짜의 스케줄 목록" role="region">
      {schedules.map((schedule) => (
        <ScheduleItem key={schedule.id} schedule={schedule} t={t} />
      ))}
    </section>
  );
};

// 헤더 컴포넌트
const PageHeader: React.FC<PageHeaderProps> = ({ t }) => (
  <header className={PAGE_STYLES.header} role="banner">
    <h1 className={PAGE_STYLES.title}>{t("schedule.title")}</h1>
    <p className={PAGE_STYLES.description}>{t("schedule.description")}</p>
  </header>
);

// 캘린더 영역 컴포넌트
const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  setSelectedDate,
  getSchedulesForSelectedDate,
  setCurrentMonth,
}) => (
  <section className={PAGE_STYLES.calendarContainer} aria-label="월간 스케줄 캘린더" role="region">
    <div className={PAGE_STYLES.calendarCard}>
      <CalendarWithSchedule
        value={selectedDate}
        onChange={setSelectedDate}
        getSchedulesForDate={getSchedulesForSelectedDate}
        onMonthChange={setCurrentMonth}
      />
    </div>
  </section>
);

// 상세 정보 영역 컴포넌트
const DetailSection: React.FC<DetailSectionProps> = ({
  headerText,
  isLoadingMonthly,
  selectedDate,
  selectedDateSchedules,
  t,
}) => (
  <aside className={PAGE_STYLES.detailContainer} aria-label="선택된 날짜의 스케줄 상세 정보" role="complementary">
    <div className={PAGE_STYLES.detailCard}>
      <h2 className={PAGE_STYLES.detailTitle}>{headerText}</h2>

      {isLoadingMonthly ? (
        <div aria-live="polite" aria-busy="true">
          <LoadingSpinner containerClassName="py-8" />
        </div>
      ) : selectedDate ? (
        <ScheduleList schedules={selectedDateSchedules} t={t} />
      ) : (
        <EmptyState message={t("schedule.selectDateToView")} />
      )}
    </div>
  </aside>
);

// 메인 스케줄 페이지 컴포넌트
const MoverSchedulePage = () => {
  const t = useTranslations();
  const locale = useLocale();
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
        movingType: t(`shared.movingTypes.${schedule.movingType}`),
      }));
    },
    [schedulesByDate, t],
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
        switch (locale) {
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
        const translatedText = t("schedule.scheduleText");
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

      if (locale === "ko") {
        return `${month}월 ${day}일 ${scheduleText}`;
      } else if (locale === "zh") {
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
    [locale, t],
  );

  // 헤더 텍스트 - 날짜 번역 추가
  const headerText = selectedDate ? formatDate(selectedDate) : t("schedule.selectDate");

  return (
    <main className={PAGE_STYLES.container} role="main" aria-label="기사님 일정 관리 페이지">
      <div className={PAGE_STYLES.content}>
        <PageHeader t={t} />

        <div className={PAGE_STYLES.grid} role="application" aria-label="스케줄 관리 인터페이스">
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
    </main>
  );
};

export default MoverSchedulePage;
