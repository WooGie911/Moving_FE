"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/stores/notificationStore";

export default function NotificationSSEProvider({ children }: { children: React.ReactNode }) {
  const connectSSE = useNotificationStore((state) => state.connectSSE);
  const disconnectSSE = useNotificationStore((state) => state.disconnectSSE);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) connectSSE(token);
    return () => {
      disconnectSSE();
    };
  }, [connectSSE, disconnectSSE]);

  return <>{children}</>;
}
