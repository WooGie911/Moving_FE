"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { getTokenFromCookie } from "@/utils/auth";

export default function NotificationSSEProvider({ children }: { children: React.ReactNode }) {
  const connectSSE = useNotificationStore((state) => state.connectSSE);
  const disconnectSSE = useNotificationStore((state) => state.disconnectSSE);

  useEffect(() => {
    (async () => {
      const token = await getTokenFromCookie();
      if (token) connectSSE(token);
    })();
    return () => {
      disconnectSSE();
    };
  }, [connectSSE, disconnectSSE]);

  return <>{children}</>;
}
