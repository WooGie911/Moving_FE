import { create } from "zustand";
import { EventSourcePolyfill } from "event-source-polyfill";
import { INotification } from "@/types/notification.types";
import { getNotifications, readAllNotifications, readNotification } from "@/lib/api/notification.api";

interface INotificationState {
  notifications: INotification[];
  hasMore: boolean;
  hasUnread: boolean;
  total: number;
  isSSEConnected: boolean;
  isNotificationOpen: boolean;
  setNotifications: (notis: INotification[]) => void;
  addNotification: (noti: INotification) => void;
  connectSSE: (token: string) => void;
  disconnectSSE: () => void;
  fetchNotifications: (limit?: number, offset?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  openNotificationModal: () => void;
  closeNotificationModal: () => void;
}

let eventSource: EventSourcePolyfill | null = null;
let reconnectAttempts = 0;
let reconnectTimeout: NodeJS.Timeout | null = null;
let disconnectTimer: NodeJS.Timeout | null = null;
let currentToken: string | null = null;

const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_INTERVAL = 5000; // 5초
const AUTO_DISCONNECT_TIME = 60 * 60 * 1000; // 1시간

export const useNotificationStore = create<INotificationState>((set, get) => ({
  notifications: [],
  hasMore: true,
  hasUnread: false,
  total: 0,
  isSSEConnected: false,
  isNotificationOpen: false,
  setNotifications: (notis) => set({ notifications: notis }),
  addNotification: (noti) => set((state) => ({ 
    notifications: [noti, ...state.notifications],
    hasUnread: true // 새 알림이 오면 무조건 unread로 설정
  })),
  connectSSE: (token: string) => {
    // 토큰이 변경된 경우에만 재연결
    if (currentToken === token && eventSource && get().isSSEConnected) {
      return;
    }

    // 기존 연결 종료 및 타이머 초기화
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

    currentToken = token;
    set({ isSSEConnected: false });

    // SSE 연결
    eventSource = new EventSourcePolyfill(`${process.env.NEXT_PUBLIC_API_URL}/sse/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    // 자동 종료 타이머(1시간)
    disconnectTimer = setTimeout(() => {
      get().disconnectSSE();
    }, AUTO_DISCONNECT_TIME);

    // 메시지 수신 
    eventSource.addEventListener("notification", (event) => {
      try {
        const messageEvent = event as MessageEvent;
        const data = JSON.parse(messageEvent.data);
        if (data.notification) {
          get().addNotification(data.notification);
          // unreadCount는 서버에서 받은 값으로 설정
          set(() => ({ hasUnread: data.unreadCount > 0 }));
        }
      } catch (e) {
        console.error("SSE 메시지 파싱 에러:", e);
      }
    });

    // 에러 발생 시 재연결
    eventSource.onerror = function () {
      set({ isSSEConnected: false });
      
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
        get().disconnectSSE();
      }
    };

    // 연결 성공 시 재시도 횟수 초기화
    eventSource.onopen = function () {
      reconnectAttempts = 0;
      set({ isSSEConnected: true });
      
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
    currentToken = null;
    set({ isSSEConnected: false });
  },
  // --- API 연동 부분 ---
  fetchNotifications: async (limit = 3, offset = 0) => {
    try {
      const res = await getNotifications(limit, offset);
      set((state) => {
        let newNotifications;
        if (offset === 0) {
          newNotifications = res.data.items;
        } else {
          // 중복 제거: 이미 있는 id는 추가하지 않음
          const existingIds = new Set(state.notifications.map((n) => n.id));
          const filtered = res.data.items.filter((n) => !existingIds.has(n.id));
          newNotifications = [...state.notifications, ...filtered];
        }
        return {
          notifications: newNotifications,
          hasMore: newNotifications.length < res.data.total,
          hasUnread: res.data.hasUnread, 
          total: res.data.total,
        };
      });
    } catch (error) {
      console.error("알림 가져오기 실패:", error);
    }
  },
  markAsRead: async (id: string) => {
    try {
      await readNotification(id);
      // 읽음 처리 후 최신 상태로 동기화
      await get().fetchNotifications();
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  },
  markAllAsRead: async () => {
    try {
      await readAllNotifications();
      set((state) => {
        const updatedNotifications = state.notifications.map((n) => (n.isRead ? n : { ...n, isRead: true }));
        return {
          notifications: updatedNotifications,
          hasUnread: false,
        };
      });
    } catch (error) {
      console.error("모든 알림 읽음 처리 실패:", error);
    }
  },
  openNotificationModal: () => set({ isNotificationOpen: true }),
  closeNotificationModal: () => set({ isNotificationOpen: false }),
}));
