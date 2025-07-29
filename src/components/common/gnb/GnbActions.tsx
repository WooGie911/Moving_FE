"use client";

import React, { useRef, useState, useEffect } from "react";
import profile from "@/assets/icon/auth/icon-profile-lg.png";
import Image from "next/image";
import notification from "@/assets/icon/notification/icon-notification-lg.png";
import { TDeviceType } from "@/types/deviceType";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { TUserRole } from "@/types/user.types";
import NotificationList from "@/components/notification/NotificationList";
import UserActionDropdown from "../dropdown/UserActionDropdown";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuth } from "@/providers/AuthProvider";

const USER_ACTION_LIST = [
  {
    label: "프로필 수정",
    href: "/profile/edit",
  },
  {
    label: "찜한 기사님",
    href: "/user/favorite",
  },
  {
    label: "이사 리뷰",
    href: "/review/written",
  },
];

// TODO :  이부분은 기사님쪽에 맞춰서 수정 필요
const MOVER_USER_ACTION_LIST = [
  {
    label: "프로필 수정",
    href: "/profile/edit",
  },
  {
    label: "마이페이지",
    href: "/moverMyPage",
  },
  {
    label: "여기는 추가해 주세용",
    href: "/user/favorite",
  },
  {
    label: "여기는 추가해 주세용",
    href: "/user/order",
  },
];

interface IGnbActionsProps {
  userRole: TUserRole;
  userName: string;
  deviceType: TDeviceType;
  toggleSideMenu: () => void;
  isSideMenuOpen: boolean;
}

export const GnbActions = ({ userRole, userName, deviceType, toggleSideMenu, isSideMenuOpen }: IGnbActionsProps) => {
  const { logout } = useAuth();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileModalRef = useRef<HTMLDivElement>(null);

  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const hasUnread = useNotificationStore((state) => state.hasUnread);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);

  const handleNotificationClick = () => {
    setIsNotificationOpen((prev) => {
      const willOpen = !prev;
      if (willOpen) {
        fetchNotifications(4, 0); // 모달이 열릴 때만 전체 알림(첫 페이지) 받아오기
      }
      return willOpen;
    });
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

  useEffect(() => {
    // 헤더가 보일 때(마운트 시) 최신 알림 1개만 받아와서 hasUnread만 갱신
    fetchNotifications(1, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* 언어 변경 버튼 */}
      <LanguageSwitcher />

      {userRole === "GUEST" && deviceType === "desktop" && (
        <Link
          href="/userSignin"
          className="bg-primary-400 hover:bg-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          로그인
        </Link>
      )}

      {userRole !== "GUEST" && (
        <>
          {/* 알림 버튼 */}
          <div className="hover:text-black-400 cursor-pointer p-2 text-gray-400 transition-colors" aria-label="알림">
            <div className="relative h-6 w-6">
              <button
                ref={notificationButtonRef}
                onClick={handleNotificationClick}
                className="cursor-pointer"
                aria-label="알림"
              >
                <Image src={notification} alt="알림" width={24} height={24} />
                {hasUnread && <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></div>}
              </button>
              <UserActionDropdown
                type="alert"
                onClose={() => setIsNotificationOpen(false)}
                isOpen={isNotificationOpen}
                triggerRef={notificationButtonRef}
              >
                <NotificationList onClose={() => setIsNotificationOpen(false)} />
              </UserActionDropdown>
            </div>
          </div>

          {/* 프로필 버튼 */}
          <div className="relative">
            <button
              ref={profileButtonRef}
              onClick={handleProfileClick}
              className="flex cursor-pointer gap-3 p-2 text-black"
              aria-label="프로필"
            >
              <Image src={profile} alt="프로필" width={24} height={24} />
              <div className="hidden lg:block">{userName}</div>
            </button>

            {/* 프로필 모달창 */}
            {isProfileOpen && (
              <div
                ref={profileModalRef}
                className="absolute top-full right-0 z-50 mt-2 w-[180px] rounded-2xl border-2 border-[#F2F2F2] bg-white px-2 py-2.5 font-bold shadow-lg lg:w-[248px]"
              >
                <nav className="flex flex-col items-start justify-start border-b border-[#F2F2F2]">
                  <span className="w-full px-2 py-2 text-left text-lg">
                    {userName} {userRole === "CUSTOMER" ? "고객님" : "기사님"}
                  </span>
                  <ul className="flex w-full flex-col">
                    {userRole === "CUSTOMER"
                      ? USER_ACTION_LIST.map((item, index) => (
                          <Link href={item.href} key={index} onClick={closeProfileModal}>
                            <li className="text-md w-full px-2 py-3 text-left font-medium">{item.label}</li>
                          </Link>
                        ))
                      : MOVER_USER_ACTION_LIST.map((item, index) => (
                          <Link href={item.href} key={index} onClick={closeProfileModal}>
                            <li className="text-md w-full px-2 py-3 text-left font-medium">{item.label}</li>
                          </Link>
                        ))}
                  </ul>
                </nav>
                <button
                  className="w-full cursor-pointer px-3 py-3 text-xs text-gray-500 transition-colors hover:text-gray-700 lg:text-lg"
                  onClick={() => logout()}
                >
                  로그아웃
                </button>
              </div>
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
            aria-label="메뉴"
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
