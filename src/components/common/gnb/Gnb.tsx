"use client";

import React, { useState } from "react";
import { SideGnb } from "./SideGnb";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { TUserRole } from "@/types/userRole";
import { LogoAndTab } from "./LogoAndTab";
import { GnbActions } from "./GnbActions";

export const Gnb = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // TODO: 추후 중앙 상태관리에서 가져오도록 수정
  const [userRole] = useState<TUserRole>("guest");
  // const [userRole] = useState<TUserRole>("user");
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
      <header className="sticky top-0 z-30 w-full border-b border-[#F2F2F2] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          {deviceType === "desktop" ? (
            // 데스크탑 헤더
            <div className="flex w-full items-center justify-between">
              <LogoAndTab deviceType={deviceType} userRole={userRole} />
              <GnbActions
                userRole={userRole}
                deviceType={deviceType}
                toggleSideMenu={toggleMobileMenu}
                isSideMenuOpen={isMobileMenuOpen}
              />
            </div>
          ) : (
            // 모바일 & 태블릿 헤더
            <div className="flex w-full items-center justify-between">
              <LogoAndTab deviceType={deviceType} userRole={userRole} />
              <GnbActions
                userRole={userRole}
                deviceType={deviceType}
                toggleSideMenu={toggleMobileMenu}
                isSideMenuOpen={isMobileMenuOpen}
              />
            </div>
          )}
        </div>
      </header>

      {/* 사이드바 */}
      <SideGnb isOpen={isMobileMenuOpen} onClose={closeMobileMenu} userRole={userRole} />
    </>
  );
};
