import { INotification } from "@/types/notification.types";
import { getTokenFromCookie } from "@/utils/auth";
import * as Sentry from "@sentry/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
};

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
export async function getNotifications(
  limit = 3,
  offset = 0,
  lang: string = "ko",
  userType?: string,
): Promise<NotificationApiResponse> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    queryParams.append("offset", offset.toString());
    queryParams.append("lang", lang);
    if (userType) {
      queryParams.append("userType", userType);
    }

    const res = await fetch(`${API_URL}/notifications?${queryParams.toString()}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });

    if (!res.ok) {
      const errorMessage = `알림 목록 조회 실패: ${res.status} ${res.statusText}`;
      Sentry.captureException(new Error(errorMessage), {
        tags: {
          api: "notifications",
          action: "getNotifications",
          status: res.status.toString(),
        },
        extra: {
          limit,
          offset,
          lang,
          userType,
          url: `${API_URL}/notifications`,
        },
      });
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    const errorMessage = `알림 목록 조회 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`;
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
    const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });

    if (!res.ok) {
      const errorMessage = `알림 읽음 처리 실패: ${res.status} ${res.statusText}`;
      Sentry.captureException(new Error(errorMessage), {
        tags: {
          api: "notifications",
          action: "readNotification",
          status: res.status.toString(),
        },
        extra: {
          notificationId,
          url: `${API_URL}/notifications/${notificationId}/read`,
        },
      });
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    const errorMessage = `알림 읽음 처리 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`;
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
    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });

    if (!res.ok) {
      const errorMessage = `전체 알림 읽음 처리 실패: ${res.status} ${res.statusText}`;
      Sentry.captureException(new Error(errorMessage), {
        tags: {
          api: "notifications",
          action: "readAllNotifications",
          status: res.status.toString(),
        },
        extra: {
          url: `${API_URL}/notifications/read-all`,
        },
      });
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    const errorMessage = `전체 알림 읽음 처리 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`;
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
