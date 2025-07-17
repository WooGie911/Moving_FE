"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useNotificationStore } from "@/stores/notificationStore";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import Link from "next/link";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export default function NotificationList() {
  const { notifications, hasMore, fetchNotifications } = useNotificationStore();
  const limit = 4;
  const loadingRef = useRef(false);

  useEffect(() => {
    fetchNotifications(limit, 0);
  }, []);

  const { ref, inView } = useInView({ threshold: 0.2 });

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    await fetchNotifications(limit, notifications.length);
    loadingRef.current = false;
  }, [fetchNotifications, notifications.length, limit]);

  useEffect(() => {
    if (inView && hasMore && !loadingRef.current) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  if (notifications.length === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="p-2 text-center text-gray-400">아직 알림이 없어요!</div>
      </div>
    );
  }

  return (
    <div className="text-black-400 max-h-[215px] w-full overflow-y-auto">
      {notifications.map((notification, idx) => (
        notification.actionUrl ? (
          <Link
            key={`${notification.id}-${idx}`}
            href={notification.actionUrl}
            className={`flex cursor-pointer flex-col items-start p-4 hover:bg-gray-50 ${
              idx !== notifications.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <div className="text-sm break-words">{parse(DOMPurify.sanitize(notification.title))}</div>
            <div className="mt-1 text-xs text-gray-400">{dayjs(notification.createdAt).fromNow()}</div>
          </Link>
        ) : (
          <div
            key={`${notification.id}-${idx}`}
            className={`flex flex-col items-start p-4 ${
              idx !== notifications.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <div className="text-sm break-words">{parse(DOMPurify.sanitize(notification.title))}</div>
            <div className="mt-1 text-xs text-gray-400">{dayjs(notification.createdAt).fromNow()}</div>
          </div>
        )
      ))}
      {hasMore && <div ref={ref} style={{ height: 40 }} />}
      {!hasMore && <div className="py-2 text-center text-xs text-gray-400">모든 알림을 불러왔습니다.</div>}
    </div>
  );
}
