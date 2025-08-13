// 기사님 스케줄 관련 API 서비스
import { ScheduleApiResponse } from "@/types/schedule";
import { apiCall, handleApiError } from "@/utils/apiUtils";

// 에러 메시지
const ERROR_MESSAGES = {
  monthlySchedules: "월별 스케줄 조회에 실패했습니다.",
} as const;

/**
 * 기사님 스케줄 서비스 클래스
 */
export class MoverScheduleService {
  /**
   * 월별 스케줄 조회 (캘린더용)
   */
  static async getMonthlySchedules(year: number, month: number, lang?: string): Promise<ScheduleApiResponse> {
    try {
      // 동적 텍스트만 번역 (상태/유형 키는 백엔드에서 제외 처리)
      const queryParams = lang && lang !== "ko" ? `?lang=${lang}` : "";
      return await apiCall<ScheduleApiResponse>(`/mover-schedules/monthly/${year}/${month}${queryParams}`, {
        method: "GET",
      });
    } catch (error) {
      const errorMessage = handleApiError(error, ERROR_MESSAGES.monthlySchedules);
      throw new Error(errorMessage);
    }
  }
}

export default MoverScheduleService;
