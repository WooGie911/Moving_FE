import { INotification } from "@/types/notification.types";
import { apiGet, apiPatch } from "@/utils/apiHelpers";
import * as Sentry from "@sentry/nextjs";

export interface NotificationApiResponse {
  success: boolean;
  message: string;
  data: {
    items: INotification[];
    total: number;
    limit: number;
    offset: number;
    hasUnread: boolean;
  };
}

// 알림 목록 조회
export async function getNotifications(limit = 3, offset = 0, lang: string = "ko", userType?: string): Promise<NotificationApiResponse> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    queryParams.append("offset", offset.toString());
    queryParams.append("lang", lang);
    if (userType) {
      queryParams.append("userType", userType);
    }

    const endpoint = `/notifications?${queryParams.toString()}`;
    return await apiGet<NotificationApiResponse>(endpoint);
  } catch (error) {
    const errorMessage = `알림 목록 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
    Sentry.captureException(error, {
      tags: {
        api: "notifications",
        action: "getNotifications",
      },
      extra: {
        limit,
        offset,
        lang,
        userType,
        endpoint: `/notifications`,
      },
    });
    throw new Error(errorMessage);
  }
}

// 개별 알림 읽음 처리
export async function readNotification(notificationId: string) {
  try {
    const endpoint = `/notifications/${notificationId}/read`;
    return await apiPatch(endpoint, {});
  } catch (error) {
    const errorMessage = `알림 읽음 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
    Sentry.captureException(error, {
      tags: {
        api: "notifications",
        action: "readNotification",
      },
      extra: {
        notificationId,
        endpoint: `/notifications/${notificationId}/read`,
      },
    });
    throw new Error(errorMessage);
  }
}

// 전체 알림 읽음 처리
export async function readAllNotifications() {
  try {
    const endpoint = `/notifications/read-all`;
    return await apiPatch(endpoint, {});
  } catch (error) {
    const errorMessage = `전체 알림 읽음 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
    Sentry.captureException(error, {
      tags: {
        api: "notifications",
        action: "readAllNotifications",
      },
      extra: {
        endpoint: `/notifications/read-all`,
      },
    });
    throw new Error(errorMessage);
  }
}
