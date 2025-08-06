"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { getTokenFromCookie } from "@/utils/auth";
import { useAuth } from "./AuthProvider";

const connectSSESelector = (state: any) => state.connectSSE;
const disconnectSSESelector = (state: any) => state.disconnectSSE;
const isSSEConnectedSelector = (state: any) => state.isSSEConnected;

export default function NotificationSSEProvider({ children }: { children: React.ReactNode }) {
  const connectSSE = useNotificationStore(connectSSESelector);
  const disconnectSSE = useNotificationStore(disconnectSSESelector);
  const isSSEConnected = useNotificationStore(isSSEConnectedSelector);
  const { user } = useAuth();
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    let tokenCheckInterval: NodeJS.Timeout | null = null;

    const initializeSSE = async () => {
      const token = await getTokenFromCookie();
      if (user?.id && token) {
        if (token !== tokenRef.current || !isSSEConnected) {
          tokenRef.current = token;
          connectSSE(token);
        }
      } else {
        if (tokenRef.current) {
          tokenRef.current = null;
          disconnectSSE();
        }
      }
    };

    initializeSSE();
    tokenCheckInterval = setInterval(initializeSSE, 60000);

    return () => {
      if (tokenCheckInterval) clearInterval(tokenCheckInterval);
      disconnectSSE();
    };
  }, [user?.id]);

  return <>{children}</>;
}
