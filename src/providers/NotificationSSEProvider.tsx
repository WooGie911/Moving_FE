"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { getTokenFromCookie } from "@/utils/auth";
import { useAuth } from "./AuthProvider";

const connectSSESelector = (state: any) => state.connectSSE;
const disconnectSSESelector = (state: any) => state.disconnectSSE;
const isSSEConnectedSelector = (state: any) => state.isSSEConnected;
const fetchNotificationsSelector = (state: any) => state.fetchNotifications;

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

export default function NotificationSSEProvider({ children }: { children: React.ReactNode }) {
  const connectSSE = useNotificationStore(connectSSESelector);
  const disconnectSSE = useNotificationStore(disconnectSSESelector);
  const isSSEConnected = useNotificationStore(isSSEConnectedSelector);
  const { user } = useAuth();

  useEffect(() => {
    let tokenCheckInterval: NodeJS.Timeout | null = null;

    const initializeSSE = async () => {
      const token = await getTokenFromCookie();
      
      if (!token || !isTokenValid(token)) {
        if (isSSEConnected) {
          disconnectSSE();
        }
        return;
      }

      if (user?.id && !isSSEConnected) {
        connectSSE(token);
      } else if (!user?.id && isSSEConnected) {
        disconnectSSE();
      }
    };

    // 초기화
    initializeSSE();

    // 네트워크 상태 변화 감지
    const handleOnline = () => {
      if (user?.id) {
        setTimeout(() => {
          initializeSSE();
        }, 2000);
      }
    };

    const handleOffline = () => {
      disconnectSSE();
    };

    // 이벤트 리스너 등록
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 토큰 체크 간격 (5분)
    tokenCheckInterval = setInterval(initializeSSE, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (tokenCheckInterval) clearInterval(tokenCheckInterval);
      disconnectSSE();
    };
  }, [user?.id, user?.userType]); // isSSEConnected 제거

  return <>{children}</>;
}
