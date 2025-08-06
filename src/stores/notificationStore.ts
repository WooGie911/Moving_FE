import { create } from "zustand";
import { EventSourcePolyfill } from "event-source-polyfill";
import { INotification } from "@/types/notification.types";
import { getNotifications, readAllNotifications, readNotification } from "@/lib/api/notification.api";
import { getTokenFromCookie } from "@/utils/auth";
import * as Sentry from "@sentry/nextjs";

interface INotificationState {
  notifications: INotification[];
  hasMore: boolean;
  hasUnread: boolean;
  total: number;
  isSSEConnected: boolean;
  isNotificationOpen: boolean;
  isLoading: boolean;
  lastFetchTime: number;
  setNotifications: (notis: INotification[]) => void;
  addNotification: (noti: INotification) => void;
  connectSSE: (token: string) => void;
  disconnectSSE: () => void;
  fetchNotifications: (limit?: number, offset?: number, lang?: string, userType?: string, force?: boolean) => Promise<void>;
  markAsRead: (id: string, userType?: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  openNotificationModal: () => void;
  closeNotificationModal: () => void;
  setLoading: (loading: boolean) => void;
}

let eventSource: EventSourcePolyfill | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let currentToken: string | null = null;
let reconnectAttempts = 0;
let isConnecting = false;

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_INTERVAL = 5000; // 5초로 증가
const CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

// 토큰 유효성 검사
const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp >= currentTime;
  } catch (error) {
    return false;
  }
};

export const useNotificationStore = create<INotificationState>((set, get) => ({
  notifications: [],
  hasMore: true,
  hasUnread: false,
  total: 0,
  isSSEConnected: false,
  isNotificationOpen: false,
  isLoading: false,
  lastFetchTime: 0,
  setNotifications: (notis) => set({ notifications: notis }),
  addNotification: (noti) =>
    set((state) => {
      const existingIndex = state.notifications.findIndex(n => n.id === noti.id);
      if (existingIndex !== -1) {
        // 기존 알림 업데이트
        const updatedNotifications = [...state.notifications];
        updatedNotifications[existingIndex] = noti;
        return {
          notifications: updatedNotifications,
          hasUnread: state.hasUnread || !noti.isRead,
        };
      }
      
      // 새 알림 추가
      return {
        notifications: [noti, ...state.notifications],
        hasUnread: true, // 새 알림이 추가되면 무조건 true
        total: state.total + 1,
      };
    }),
  connectSSE: async (token: string) => {
    // 이미 연결 중이면 무시
    if (isConnecting) {
      return;
    }

    // 토큰 유효성 검사
    if (!isTokenValid(token)) {
      const newToken = await getTokenFromCookie();
      if (newToken && isTokenValid(newToken)) {
        get().connectSSE(newToken);
      } else {
        get().disconnectSSE();
      }
      return;
    }

    // 이미 연결된 경우 무시
    if (currentToken === token && eventSource && get().isSSEConnected) {
      return;
    }

    isConnecting = true;

    // 기존 연결 정리
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    currentToken = token;
    set({ isSSEConnected: false });

    try {
      const sseUrl = `${process.env.NEXT_PUBLIC_API_URL}/sse/notifications`;
      
      eventSource = new EventSourcePolyfill(sseUrl, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      eventSource.addEventListener("notification", (event) => {
        try {
          const messageEvent = event as MessageEvent;
          const data = JSON.parse(messageEvent.data);
          
          if (data.notification) {
            // 새 알림 추가 (hasUnread는 addNotification에서 자동으로 true로 설정됨)
            get().addNotification(data.notification);
            
            // 서버에서 받은 unreadCount로도 확인
            if (data.unreadCount !== undefined) {
              const hasUnread = data.unreadCount > 0;
              set({ hasUnread });
            }
          }
        } catch (e) {
          Sentry.captureException(e, {
            tags: {
              component: "notificationStore",
              action: "parseSSEMessage",
            },
            extra: {
              eventData: event,
            },
          });
          console.error("SSE 메시지 파싱 에러:", e);
        }
      });

      eventSource.onopen = function () {
        reconnectAttempts = 0; // 성공 시 재시도 횟수 초기화
        isConnecting = false;
        set({ isSSEConnected: true });
      };

      eventSource.onerror = async function (event) {
        Sentry.captureException(new Error("SSE 연결 에러"), {
          tags: {
            component: "notificationStore",
            action: "SSEConnectionError",
          },
          extra: {
            event,
            reconnectAttempts,
            currentToken: currentToken ? "있음" : "없음",
          },
        });
        
        set({ isSSEConnected: false });
        isConnecting = false;
        
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }

        // 재연결 시도 제한
        if (navigator.onLine && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          
          const newToken = await getTokenFromCookie();
          if (newToken && isTokenValid(newToken)) {
            reconnectTimeout = setTimeout(() => {
              get().connectSSE(newToken);
            }, RECONNECT_INTERVAL);
          } else {
            Sentry.captureMessage("토큰 갱신 실패로 SSE 재연결 중단", {
              tags: {
                component: "notificationStore",
                action: "tokenRefreshFailed",
              },
            });
            get().disconnectSSE();
          }
        } else {
          Sentry.captureMessage("SSE 최대 재연결 시도 횟수 초과 또는 오프라인 상태", {
            tags: {
              component: "notificationStore",
              action: "maxReconnectAttemptsReached",
            },
            extra: {
              reconnectAttempts,
              maxAttempts: MAX_RECONNECT_ATTEMPTS,
              isOnline: navigator.onLine,
            },
          });
          get().disconnectSSE();
        }
      };

    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: "notificationStore",
          action: "createSSEConnection",
        },
        extra: {
          sseUrl: `${process.env.NEXT_PUBLIC_API_URL}/sse/notifications`,
          hasToken: !!token,
        },
      });
      console.error("SSE 연결 생성 실패:", error);
      isConnecting = false;
      set({ isSSEConnected: false });
    }
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
    reconnectAttempts = 0;
    isConnecting = false;
    currentToken = null;
    set({ isSSEConnected: false });
  },
  fetchNotifications: async (limit = 3, offset = 0, lang: string = "ko", userType?: string, force = false) => {
    const state = get();
    const now = Date.now();
    
    if (!force && state.lastFetchTime > 0 && (now - state.lastFetchTime) < CACHE_DURATION && offset === 0) {
      return;
    }

    try {
      set({ isLoading: true });
      const res = await getNotifications(limit, offset, lang, userType);
      set((state) => {
        let newNotifications;
        if (offset === 0) {
          newNotifications = res.data.items;
        } else {
          const existingIds = new Set(state.notifications.map((n) => n.id));
          const filtered = res.data.items.filter((n) => !existingIds.has(n.id));
          newNotifications = [...state.notifications, ...filtered];
        }
        return {
          notifications: newNotifications,
          hasMore: newNotifications.length < res.data.total,
          hasUnread: res.data.hasUnread,
          total: res.data.total,
          lastFetchTime: now,
          isLoading: false,
        };
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: "notificationStore",
          action: "fetchNotifications",
        },
        extra: {
          limit,
          offset,
          lang,
          userType,
          force,
        },
      });
      console.error("알림 가져오기 실패:", error);
      set({ isLoading: false });
    }
  },
  markAsRead: async (id: string, userType?: string) => {
    try {
      await readNotification(id);
      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        const hasUnread = updatedNotifications.some((n) => !n.isRead);
        return {
          notifications: updatedNotifications,
          hasUnread,
        };
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: "notificationStore",
          action: "markAsRead",
        },
        extra: {
          notificationId: id,
          userType,
        },
      });
      console.error("알림 읽음 처리 실패:", error);
    }
  },
  markAllAsRead: async () => {
    try {
      await readAllNotifications();
      set((state) => {
        const updatedNotifications = state.notifications.map((n) => ({ ...n, isRead: true }));
        return {
          notifications: updatedNotifications,
          hasUnread: false,
        };
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: "notificationStore",
          action: "markAllAsRead",
        },
      });
      console.error("모든 알림 읽음 처리 실패:", error);
    }
  },
  openNotificationModal: () => set({ isNotificationOpen: true }),
  closeNotificationModal: () => set({ isNotificationOpen: false }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
