"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TUserRole } from "@/types/userRole";
import { GEUST_NAVIGATION_ITEMS, USER_NAVIGATION_ITEMS, MOVER_NAVIGATION_ITEMS } from "@/constant/gnbItems";

interface ISideGnbProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: TUserRole;
  isLoggedIn?: boolean;
}

export const SideGnb = ({ isOpen, onClose, userRole = "user" }: ISideGnbProps) => {
  const pathname = usePathname();

  // 로그인 상태에 따른 메뉴 결정
  const getMenuItems = () => {
    if (userRole === "guest") {
      return [...GEUST_NAVIGATION_ITEMS, { name: "로그인", href: "/userSignin" }];
    } else {
      return userRole === "user" ? USER_NAVIGATION_ITEMS : MOVER_NAVIGATION_ITEMS;
    }
  };

  const menuItems = getMenuItems();

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* 사이드바 */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 헤더 */}
        <div className="flex justify-end border-b border-gray-200">
          <button
            onClick={onClose}
            className="hover:text-black-400 cursor-pointer p-2 px-6 py-4.5 text-gray-400 transition-colors"
            aria-label="메뉴 닫기"
          >
            {/* X 아이콘 */}
            <div className="relative h-6 w-6">
              <div className="absolute top-1/2 left-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current"></div>
              <div className="absolute top-1/2 left-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current"></div>
            </div>
          </button>
        </div>

        {/* 메뉴 내용 */}
        <div className="flex h-full flex-col">
          {/* 네비게이션 메뉴 */}
          <nav>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`block rounded-lg px-5 py-6 text-lg font-medium transition-colors hover:bg-gray-100 ${
                  pathname === item.href || pathname === "/" ? "text-black" : "text-gray-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
