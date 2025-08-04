"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { getTokenFromCookie } from "@/utils/auth";
import { useAuth } from "./AuthProvider";

export default function NotificationSSEProvider({ children }: { children: React.ReactNode }) {
  const connectSSE = useNotificationStore((state) => state.connectSSE);
  const disconnectSSE = useNotificationStore((state) => state.disconnectSSE);
  const isSSEConnected = useNotificationStore((state) => state.isSSEConnected);
  const { user } = useAuth();
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const initializeSSE = async () => {
      const token = await getTokenFromCookie();
      
      // 토큰이 있고 변경되었거나, 연결이 끊어진 경우에만 재연결
      if (token && (token !== tokenRef.current || !isSSEConnected)) {
        tokenRef.current = token;
        connectSSE(token);
      } else if (!token && tokenRef.current) {
        // 토큰이 없어진 경우 연결 해제
        tokenRef.current = null;
        disconnectSSE();
      }
    };

    // 초기 연결
    initializeSSE();

    // 토큰 변경 감지를 위한 주기적 체크 (30초마다)
    const tokenCheckInterval = setInterval(initializeSSE, 30000);

    return () => {
      clearInterval(tokenCheckInterval);
      disconnectSSE();
    };
  }, [connectSSE, disconnectSSE, isSSEConnected, user]);

  return <>{children}</>;
}
