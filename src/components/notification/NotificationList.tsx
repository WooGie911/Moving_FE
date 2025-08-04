"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useNotificationStore } from "@/stores/notificationStore";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import { INotification } from "@/types/notification.types";
import { useTranslations } from "next-intl";
import { formatRelativeTime } from "@/utils/dateUtils";

export default function NotificationList({ onClose }: { onClose?: () => void }) {
  const notifications = useNotificationStore((state) => state.notifications);
  const hasMore = useNotificationStore((state) => state.hasMore);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const limit = 4;
  const loadingRef = useRef(false);
  const router = useRouter();
  const t = useTranslations("notification");

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

  // 알림 클릭 핸들러 -> 읽음처리 후 이동.
  const handleClick = async (notification: INotification) => {
    try {
      await markAsRead(notification.id);
      onClose?.();
      router.push(notification.path);
    } catch (e) {
      console.error(e);
    }
  };

  if (notifications.length === 0) {
    return (
      <section className="flex w-full items-center justify-center" aria-label={t("noNotifications")}>
        <p className="p-2 text-center text-gray-400">{t("noNotifications")}</p>
      </section>
    );
  }

  return (
    <section className="text-black-400 max-h-[215px] w-full overflow-y-auto" aria-label="알림 목록">
      <ul className="list-none">
        {notifications.map((notification, idx) => (
          <li key={`${notification.id}-${idx}`}>
            {notification.path ? (
              <article
                className={`flex cursor-pointer flex-col items-start p-4 hover:bg-gray-50 ${
                  notification.isRead ? "bg-gray-100" : ""
                } ${idx !== notifications.length - 1 ? "border-b border-gray-200" : ""}`}
                onClick={() => handleClick(notification)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(notification);
                  }
                }}
                aria-label={`${parse(DOMPurify.sanitize(notification.title))} - ${formatRelativeTime(new Date(notification.createdAt))}`}
              >
                <header className="text-sm break-words">
                  {parse(DOMPurify.sanitize(notification.title))}
                </header>
                <time className="mt-1 text-xs text-gray-400" dateTime={notification.createdAt}>
                  {formatRelativeTime(new Date(notification.createdAt))}
                </time>
              </article>
            ) : (
              <article
                className={`flex flex-col items-start p-4 ${
                  idx !== notifications.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <header className="text-sm break-words">
                  {parse(DOMPurify.sanitize(notification.title))}
                </header>
                <time className="mt-1 text-xs text-gray-400" dateTime={notification.createdAt}>
                  {formatRelativeTime(new Date(notification.createdAt))}
                </time>
              </article>
            )}
          </li>
        ))}
      </ul>
      {hasMore && <div ref={ref} style={{ height: 40 }} aria-hidden="true" />}
      {!hasMore && (
        <footer className="py-2 text-center text-xs text-gray-400" aria-label="모든 알림 로드 완료">
          {t("allNotificationsLoaded")}
        </footer>
      )}
    </section>
  );
}
