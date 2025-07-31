import React, { useCallback } from "react";
import { useModal } from "@/components/common/modal/ModalContext";
import { useLanguageStore } from "@/stores/languageStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import MoverScheduleService from "@/lib/api/moverScheduleService";
import { Schedule } from "@/types/schedule";
import { getCurrentYearMonth, getAdjacentMonth } from "@/utils/scheduleUtils";

// 상수 정의
const QUERY_KEYS = {
  MOVER_SCHEDULES: "moverSchedules",
  MONTHLY: "monthly",
} as const;

const QUERY_CONFIG = {
  staleTime: 1000 * 60 * 10, // 10분
  retry: 2,
} as const;

const ERROR_MESSAGES = {
  MONTHLY_SCHEDULES: "월별 스케줄 조회에 실패했습니다.",
} as const;

// 유틸리티 함수들
const createQueryKey = (year: number, month: number, locale: string) => [
  QUERY_KEYS.MOVER_SCHEDULES,
  QUERY_KEYS.MONTHLY,
  year,
  month,
  locale,
];

const createErrorModal = (open: any, close: any, t: any, message: string) => ({
  title: t("common.error"),
  children: (
    <div className="p-6">
      <p className="mb-4 text-gray-700">{message}</p>
    </div>
  ),
  buttons: [
    {
      text: t("common.confirm"),
      onClick: close,
    },
  ],
});

const fetchMonthlySchedules = async (year: number, month: number, locale: string) => {
  const response = await MoverScheduleService.getMonthlySchedules(year, month, locale);
  return response.data || [];
};

export const useMoverScheduleApi = () => {
  const { open, close } = useModal();
  const { t } = useLanguageStore();
  const locale = useLocale();
  const queryClient = useQueryClient();

  // 에러 모달 표시
  const showErrorModal = useCallback(
    (message: string) => {
      open(createErrorModal(open, close, t, message));
    },
    [open, close, t],
  );

  // 이전/다음 달 데이터를 placeholder로 사용
  const getPlaceholderData = useCallback(
    (year: number, month: number) => {
      const { prevMonth, nextMonth } = getAdjacentMonth(year, month);

      // 이전 달 데이터 확인
      const prevData = queryClient.getQueryData<Schedule[]>(createQueryKey(prevMonth.year, prevMonth.month, locale));
      if (prevData) return prevData;

      // 다음 달 데이터 확인
      const nextData = queryClient.getQueryData<Schedule[]>(createQueryKey(nextMonth.year, nextMonth.month, locale));
      if (nextData) return nextData;

      return undefined;
    },
    [queryClient, locale],
  );

  // 월별 스케줄 조회 (캘린더용)
  const useGetMonthlySchedules = (year: number, month: number) => {
    return useQuery({
      queryKey: createQueryKey(year, month, locale),
      queryFn: async () => {
        try {
          return await fetchMonthlySchedules(year, month, locale);
        } catch (error: any) {
          showErrorModal(error.message || ERROR_MESSAGES.MONTHLY_SCHEDULES);
          throw error;
        }
      },
      ...QUERY_CONFIG,
      placeholderData: () => getPlaceholderData(year, month),
    });
  };

  // 이번 달 스케줄 조회 (편의 함수)
  const useGetCurrentMonthSchedules = () => {
    const { year, month } = getCurrentYearMonth();
    return useGetMonthlySchedules(year, month);
  };

  // 캐시 무효화 함수들
  const invalidateMonthlySchedules = useCallback(
    (year?: number, month?: number) => {
      if (year && month) {
        queryClient.invalidateQueries({
          queryKey: createQueryKey(year, month, locale),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MOVER_SCHEDULES, QUERY_KEYS.MONTHLY],
        });
      }
    },
    [queryClient, locale],
  );

  // 이전/이후 달 미리 캐싱
  const prefetchAdjacentMonths = useCallback(
    (year: number, month: number) => {
      const { prevMonth, nextMonth } = getAdjacentMonth(year, month);

      // 이전 달 미리 캐싱
      queryClient.prefetchQuery({
        queryKey: createQueryKey(prevMonth.year, prevMonth.month, locale),
        queryFn: () => fetchMonthlySchedules(prevMonth.year, prevMonth.month, locale),
        ...QUERY_CONFIG,
      });

      // 다음 달 미리 캐싱
      queryClient.prefetchQuery({
        queryKey: createQueryKey(nextMonth.year, nextMonth.month, locale),
        queryFn: () => fetchMonthlySchedules(nextMonth.year, nextMonth.month, locale),
        ...QUERY_CONFIG,
      });
    },
    [queryClient, locale],
  );

  return {
    useGetMonthlySchedules,
    useGetCurrentMonthSchedules,
    invalidateMonthlySchedules,
    prefetchAdjacentMonths,
  };
};
