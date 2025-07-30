import React, { useCallback } from "react";
import { useModal } from "@/components/common/modal/ModalContext";
import { useLanguageStore } from "@/stores/languageStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MoverScheduleService from "@/lib/api/moverScheduleService";
import { Schedule } from "@/types/schedule";
import { getCurrentYearMonth, getAdjacentMonth } from "@/utils/scheduleUtils";

// 쿼리 키 상수
const QUERY_KEYS = {
  MOVER_SCHEDULES: "moverSchedules",
  MONTHLY: "monthly",
} as const;

// 쿼리 설정
const QUERY_CONFIG = {
  staleTime: 1000 * 60 * 10, // 10분
  retry: 2,
} as const;

// 에러 메시지
const ERROR_MESSAGES = {
  MONTHLY_SCHEDULES: "월별 스케줄 조회에 실패했습니다.",
} as const;

export const useMoverScheduleApi = () => {
  const { open, close } = useModal();
  const { t } = useLanguageStore();
  const queryClient = useQueryClient();

  /**
   * 에러 모달 표시
   */
  const showErrorModal = useCallback(
    (message: string) => {
      open({
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
    },
    [open, close, t],
  );

  /**
   * 쿼리 키 생성
   */
  const createQueryKey = (year: number, month: number) => [QUERY_KEYS.MOVER_SCHEDULES, QUERY_KEYS.MONTHLY, year, month];

  /**
   * 이전/다음 달 데이터를 placeholder로 사용
   */
  const getPlaceholderData = (year: number, month: number) => {
    const { prevMonth, nextMonth } = getAdjacentMonth(year, month);

    // 이전 달 데이터 확인
    const prevData = queryClient.getQueryData<Schedule[]>(createQueryKey(prevMonth.year, prevMonth.month));
    if (prevData) return prevData;

    // 다음 달 데이터 확인
    const nextData = queryClient.getQueryData<Schedule[]>(createQueryKey(nextMonth.year, nextMonth.month));
    if (nextData) return nextData;

    return undefined;
  };

  /**
   * 월별 스케줄 조회 (캘린더용)
   */
  const useGetMonthlySchedules = (year: number, month: number) => {
    return useQuery({
      queryKey: createQueryKey(year, month),
      queryFn: async () => {
        try {
          const response = await MoverScheduleService.getMonthlySchedules(year, month);
          return response.data || [];
        } catch (error: any) {
          showErrorModal(error.message || ERROR_MESSAGES.MONTHLY_SCHEDULES);
          throw error;
        }
      },
      ...QUERY_CONFIG,
      placeholderData: () => getPlaceholderData(year, month),
    });
  };

  /**
   * 이번 달 스케줄 조회 (편의 함수)
   */
  const useGetCurrentMonthSchedules = () => {
    const { year, month } = getCurrentYearMonth();
    return useGetMonthlySchedules(year, month);
  };

  /**
   * 캐시 무효화 함수들
   */
  const invalidateMonthlySchedules = useCallback(
    (year?: number, month?: number) => {
      if (year && month) {
        queryClient.invalidateQueries({ queryKey: createQueryKey(year, month) });
      } else {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVER_SCHEDULES, QUERY_KEYS.MONTHLY] });
      }
    },
    [queryClient],
  );

  /**
   * 이전/이후 달 미리 캐싱
   */
  const prefetchAdjacentMonths = useCallback(
    (year: number, month: number) => {
      const { prevMonth, nextMonth } = getAdjacentMonth(year, month);

      // 이전 달 미리 캐싱
      queryClient.prefetchQuery({
        queryKey: createQueryKey(prevMonth.year, prevMonth.month),
        queryFn: () => MoverScheduleService.getMonthlySchedules(prevMonth.year, prevMonth.month),
        ...QUERY_CONFIG,
      });

      // 다음 달 미리 캐싱
      queryClient.prefetchQuery({
        queryKey: createQueryKey(nextMonth.year, nextMonth.month),
        queryFn: () => MoverScheduleService.getMonthlySchedules(nextMonth.year, nextMonth.month),
        ...QUERY_CONFIG,
      });
    },
    [queryClient],
  );

  return {
    useGetMonthlySchedules,
    useGetCurrentMonthSchedules,
    invalidateMonthlySchedules,
    prefetchAdjacentMonths,
  };
};
