"use client";

import React, { useState } from "react";
import { SideGnb } from "./SideGnb";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { TUserRole } from "@/types/userRole";
import { LogoAndTab } from "./LogoAndTab";
import Link from "next/link";
import { GnbActions } from "./GnbActions";

export const Gnb = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // TODO: 추후 중앙 상태관리에서 가져오도록 수정
  // const [userRole] = useState<TUserRole>("guest");
  const [userRole] = useState<TUserRole>("user");
  // const [userRole] = useState<TUserRole>("mover");

  const deviceType = useWindowWidth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-[#F2F2F2]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-[82px] px-[24px] py-[10px]">
          {deviceType === "desktop" ? (
            <div className="flex w-full items-center justify-between">
              <LogoAndTab deviceType={deviceType} userRole={userRole} />
              {/* 로그인 버튼 */}
              <Link
                href="/signin"
                className="bg-primary-400 hover:bg-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                로그인
              </Link>
            </div>
          ) : (
            // 모바일 & 태블릿 메뉴 버튼
            <div className="flex w-full items-center justify-between">
              <LogoAndTab deviceType={deviceType} userRole={userRole} />
              <GnbActions userRole={userRole} toggleSideMenu={toggleMobileMenu} isSideMenuOpen={isMobileMenuOpen} />
            </div>
          )}
        </div>
      </header>

      {/* 사이드바 */}
      <SideGnb isOpen={isMobileMenuOpen} onClose={closeMobileMenu} userRole={userRole} />
    </>
  );
};
