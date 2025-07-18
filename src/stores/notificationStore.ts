import { create } from "zustand";
import { EventSourcePolyfill } from "event-source-polyfill";
import { INotification } from "@/types/notification.types";
import { getNotifications, readAllNotifications, readNotification } from "@/lib/api/notification.api";

interface INotificationState {
  notifications: INotification[];
  hasMore: boolean;
  hasUnread: boolean;
  total: number;
  setNotifications: (notis: INotification[]) => void;
  addNotification: (noti: INotification) => void;
  connectSSE: (token: string) => void;
  disconnectSSE: () => void;
  fetchNotifications: (limit?: number, offset?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

let eventSource: EventSourcePolyfill | null = null;
let reconnectAttempts = 0;
let reconnectTimeout: NodeJS.Timeout | null = null;
let disconnectTimer: NodeJS.Timeout | null = null;

const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_INTERVAL = 5000; // 5초
const AUTO_DISCONNECT_TIME = 60 * 60 * 1000; // 1시간

export const useNotificationStore = create<INotificationState>((set, get) => ({
  notifications: [],
  hasMore: true,
  hasUnread: false,
  total: 0,
  setNotifications: (notis) => set({ notifications: notis }),
  addNotification: (noti) => set((state) => ({ notifications: [noti, ...state.notifications] })),
  connectSSE: (token: string) => {
    // 기존 연결 종료 및 타이머 초기화
    if (eventSource) eventSource.close();
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    if (disconnectTimer) {
      clearTimeout(disconnectTimer);
      disconnectTimer = null;
    }
    // SSE 연결
    eventSource = new EventSourcePolyfill(`${process.env.NEXT_PUBLIC_API_URL}/sse/notification`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    // 자동 종료 타이머(1시간)
    disconnectTimer = setTimeout(() => {
      get().disconnectSSE();
    }, AUTO_DISCONNECT_TIME);
    // 메시지 수신
    eventSource.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        get().addNotification(data);
      } catch (e) {
        console.error(e);
      }
    };
    // 에러 발생 시 재연결
    eventSource.onerror = function () {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        reconnectTimeout = setTimeout(() => {
          get().connectSSE(token);
        }, RECONNECT_INTERVAL);
      } else {
        // 최대 재연결 시도 초과 시 자동 종료
        get().disconnectSSE();
      }
    };
    // 연결 성공 시 재시도 횟수 초기화
    eventSource.onopen = function () {
      reconnectAttempts = 0;
      // 타임아웃 재설정
      if (disconnectTimer) {
        clearTimeout(disconnectTimer);
      }
      disconnectTimer = setTimeout(() => {
        get().disconnectSSE();
      }, AUTO_DISCONNECT_TIME);
    };
  },
  disconnectSSE: () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    if (disconnectTimer) {
      clearTimeout(disconnectTimer);
      disconnectTimer = null;
    }
    reconnectAttempts = 0;
  },
  // --- API 연동 부분 ---
  fetchNotifications: async (limit = 3, offset = 0) => {
    const res = await getNotifications(limit, offset);
    set((state) => {
      const newNotifications = offset === 0 ? res.data.items : [...state.notifications, ...res.data.items];
      return {
        notifications: newNotifications,
        hasMore: newNotifications.length < res.data.total,
        hasUnread: res.data.hasUnread,
        total: res.data.total,
      };
    });
  },
  markAsRead: async (id: string) => {
    await readNotification(id);
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    }));
  },
  markAllAsRead: async () => {
    await readAllNotifications();
    set((state) => ({
      notifications: state.notifications.map((n) => (n.unread ? { ...n, unread: false } : n)),
    }));
  },
}));
