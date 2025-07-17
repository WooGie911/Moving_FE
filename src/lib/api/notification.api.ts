import { INotification } from "@/types/notification.types";
import { getTokenFromCookie } from "@/utils/auth";

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
export async function getNotifications(limit = 3, offset = 0): Promise<NotificationApiResponse> {
  const res = await fetch(`${API_URL}/notifications?limit=${limit}&offset=${offset}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error("알림 목록 조회 실패");
  return res.json();
}

// 개별 알림 읽음 처리
export async function readNotification(notificationId: string) {
  const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error("알림 읽음 처리 실패");
  return res.json();
}

// 전체 알림 읽음 처리
export async function readAllNotifications() {
  const res = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error("전체 알림 읽음 처리 실패");
  return res.json();
}

// 테스트용 알림 생성
export async function createTestNotification() {
  const accessToken = await getAccessToken();
  const res = await fetch(`${API_URL}/actions/test`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error("테스트 알림 생성 실패");
  return res.json();
}
