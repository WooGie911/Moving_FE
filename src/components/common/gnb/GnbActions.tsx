"use client";

import React, { useRef, useState, useEffect } from "react";
import baseProfileImage from "@/assets/img/mascot/profile-lg.png";
import Image from "next/image";
import notification from "@/assets/icon/notification/icon-notification-lg.webp";
import { TDeviceType } from "@/types/deviceType";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { TUserRole } from "@/types/user.types";
import NotificationList from "@/components/notification/NotificationList";
import UserActionDropdown from "../dropdown/UserActionDropdown";
import { useNotificationStore } from "@/stores/notificationStore";
import { useTranslations } from "next-intl";
import ProfileModal from "./ProfileModal";

interface IGnbActionsProps {
  userRole: TUserRole;
  userName: string;
  deviceType: TDeviceType;
  isSideMenuOpen: boolean;
  hasBothProfiles: boolean;
  profileImage?: string;
  logout: () => void;
  toggleSideMenu: () => void;
}

export const GnbActions = ({
  userRole,
  logout,
  userName,
  hasBothProfiles,
  deviceType,
  toggleSideMenu,
  isSideMenuOpen,
  profileImage,
}: IGnbActionsProps) => {
  const t = useTranslations();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileModalRef = useRef<HTMLDivElement>(null);

  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const hasUnread = useNotificationStore((state) => state.hasUnread);
  const isNotificationOpen = useNotificationStore((state) => state.isNotificationOpen);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const openNotificationModal = useNotificationStore((state) => state.openNotificationModal);
  const closeNotificationModal = useNotificationStore((state) => state.closeNotificationModal);

  const handleNotificationClick = () => {
    if (isNotificationOpen) {
      closeNotificationModal();
    } else {
      openNotificationModal();
      fetchNotifications(4, 0); // 모달이 열릴 때만 전체 알림(첫 페이지) 받아오기
    }
  };

  // 프로필 버튼 클릭 시 프로필 모달창 열기
  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // 프로필 모달창 닫기
  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  // 프로필 모달창 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(target)
      ) {
        closeProfileModal();
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // ESC 키로 프로필 모달창 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isProfileOpen) {
        closeProfileModal();
      }
    };

    if (isProfileOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  // 로그인한 사용자만 알림 데이터 패칭
  useEffect(() => {
    if (userRole !== "GUEST") {
      // 헤더가 보일 때(마운트 시) 최신 알림 1개만 받아와서 hasUnread만 갱신
      fetchNotifications(1, 0);
    }
  }, [userRole, fetchNotifications]);

  // 알림 모달이 열릴 때마다 최신 상태로 동기화
  useEffect(() => {
    if (isNotificationOpen && userRole !== "GUEST") {
      fetchNotifications(4, 0);
    }
  }, [isNotificationOpen, userRole, fetchNotifications]);

  // userRole이나 userName 변경 시 프로필 모달 상태 초기화
  useEffect(() => {
    setIsProfileOpen(false);
  }, [userRole, userName]);

  return (
    <div className="flex items-center gap-4">
      {/* 언어 변경 버튼 */}
      <LanguageSwitcher />

      {userRole === "GUEST" && deviceType === "desktop" && (
        <Link
          href="/userSignin"
          className="bg-primary-400 hover:bg-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          {t("auth.signin")}
        </Link>
      )}

      {userRole !== "GUEST" && (
        <>
          {/* 알림 버튼 */}
          <nav className="relative" aria-label="알림 메뉴">
            <button
              ref={notificationButtonRef}
              onClick={handleNotificationClick}
              className="hover:text-black-400 cursor-pointer p-2 text-gray-400 transition-colors"
              aria-label={t("gnb.notification")}
              aria-expanded={isNotificationOpen}
              aria-haspopup="true"
            >
              <Image src={notification} alt="" width={24} height={24} />
              {hasUnread && (
                <span
                  className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"
                  aria-label="읽지 않은 알림이 있습니다"
                />
              )}
            </button>
            <UserActionDropdown
              type="alert"
              onClose={closeNotificationModal}
              isOpen={isNotificationOpen}
              triggerRef={notificationButtonRef}
            >
              <NotificationList />
            </UserActionDropdown>
          </nav>

          {/* 프로필 버튼 */}
          <div className="relative">
            <button
              ref={profileButtonRef}
              onClick={handleProfileClick}
              className="flex w-auto cursor-pointer items-center gap-3 p-2 text-black"
              aria-label={t("gnb.profile")}
            >
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={profileImage || baseProfileImage.src}
                  alt={t("gnb.profile")}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden lg:block">{userName}</div>
            </button>

            {/* 프로필 모달창 */}
            {isProfileOpen && (
              <ProfileModal
                userName={userName}
                userRole={userRole}
                hasBothProfiles={hasBothProfiles}
                logout={logout}
                profileModalRef={profileModalRef}
                closeProfileModal={closeProfileModal}
              />
            )}
          </div>
        </>
      )}

      {deviceType !== "desktop" && (
        <>
          {/* 사이드 메뉴 버튼 */}
          <button
            onClick={toggleSideMenu}
            className="hover:text-black-400 cursor-pointer p-2 text-gray-400 transition-colors"
            aria-label={t("gnb.menu")}
          >
            <div className="flex h-6 w-6 flex-col justify-center space-y-1">
              <div
                className={`h-0.5 w-full bg-current transition-all ${isSideMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
              ></div>
              <div className={`h-0.5 w-full bg-current transition-all ${isSideMenuOpen ? "opacity-0" : ""}`}></div>
              <div
                className={`h-0.5 w-full bg-current transition-all ${isSideMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
              ></div>
            </div>
          </button>
        </>
      )}
    </div>
  );
};
