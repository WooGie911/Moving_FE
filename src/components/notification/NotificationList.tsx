"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useNotificationStore } from "@/stores/notificationStore";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import { INotification } from "@/types/notification.types";
import { useTranslations } from "next-intl";
import { formatRelativeTimeWithTranslations } from "@/utils/dateUtils";
import { useLocale } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";

export default function NotificationList({ onClose }: { onClose?: () => void }) {
  const notifications = useNotificationStore((state) => state.notifications);
  const hasMore = useNotificationStore((state) => state.hasMore);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const closeNotificationModal = useNotificationStore((state) => state.closeNotificationModal);
  const limit = 4;
  const loadingRef = useRef(false);
  const router = useRouter();
  const t = useTranslations("notification");
  const locale = useLocale();
  const { user } = useAuth();

  // 시간 번역 가져오기
  const timeTranslations = {
    justNow: t("time.justNow"),
    minutesAgo: t("time.minutesAgo"),
    hoursAgo: t("time.hoursAgo"),
    daysAgo: t("time.daysAgo"),
  };

  const { ref, inView } = useInView({ threshold: 0.2 });

  const loadMore = useCallback(async () => {
    if (loadingRef.current || isLoading) return;
    loadingRef.current = true;
    try {
      await fetchNotifications(limit, notifications.length, locale, user?.userType);
    } catch (error) {
      console.error("알림 로드 실패:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [fetchNotifications, notifications.length, limit, locale, user?.userType, isLoading]);

  useEffect(() => {
    if (inView && hasMore && !loadingRef.current && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  // 알림 클릭 핸들러 -> 읽음처리 후 이동.
  const handleClick = async (notification: INotification) => {
    try {
      await markAsRead(notification.id, user?.userType);
      onClose?.();
      closeNotificationModal();
      router.push(notification.path);
    } catch (e) {
      console.error(e);
    }
  };

  if (notifications.length === 0 && !isLoading) {
    return (
      <section className="flex w-full items-center justify-center" aria-label={t("noNotifications")}>
        <p className="p-2 text-center text-gray-400">{t("noNotifications")}</p>
      </section>
    );
  }

  return (
    <section className="text-black-400 max-h-[215px] w-full overflow-y-auto" aria-label="알림 목록">
      <ul className="divide-y divide-gray-100">
        {notifications.map((notification, idx) => (
          <li key={notification.id}>
            {notification.isRead ? (
              <article
                className={`flex flex-col items-start p-4 ${
                  idx !== notifications.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <header className="text-sm break-words text-gray-500">{parse(DOMPurify.sanitize(notification.message))}</header>
                <time className="mt-1 text-xs text-gray-400" dateTime={notification.createdAt}>
                  {formatRelativeTimeWithTranslations(new Date(notification.createdAt), timeTranslations, locale === "ko" ? "ko-KR" : locale === "en" ? "en-US" : "zh-CN")}
                </time>
              </article>
            ) : (
              <button
                onClick={() => handleClick(notification)}
                className={`flex flex-col items-start w-full p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                  idx !== notifications.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <article>
                  <header className="text-sm break-words font-medium">{parse(DOMPurify.sanitize(notification.message))}</header>
                  <time className="mt-1 text-xs text-gray-400" dateTime={notification.createdAt}>
                    {formatRelativeTimeWithTranslations(new Date(notification.createdAt), timeTranslations, locale === "ko" ? "ko-KR" : locale === "en" ? "en-US" : "zh-CN")}
                  </time>
                </article>
              </button>
            )}
          </li>
        ))}
      </ul>
      
      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-400"></div>
        </div>
      )}
      
      {/* 더 로드할 데이터가 있는 경우 */}
      {hasMore && !isLoading && notifications.length > 0 && <div ref={ref} style={{ height: 40 }} aria-hidden="true" />}
      
      {/* 모든 알림 로드 완료 */}
      {!hasMore && notifications.length > 0 && (
        <footer className="py-2 text-center text-xs text-gray-400" aria-label="모든 알림 로드 완료">
          {t("allNotificationsLoaded")}
        </footer>
      )}
    </section>
  );
}
