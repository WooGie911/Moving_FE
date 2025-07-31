"use client";

import React, { useState } from "react";
import { SideGnb } from "./SideGnb";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { LogoAndTab } from "./LogoAndTab";
import { GnbActions } from "./GnbActions";
import { useAuth } from "@/providers/AuthProvider";

export const Gnb = () => {
  const { user, logout } = useAuth();
  const deviceType = useWindowWidth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = user?.userType || "GUEST";
  const userName = user?.nickname || user?.name || "";
  const userProfileImage = userRole === "CUSTOMER" ? user?.customerImage : user?.moverImage;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 min-h-[80px] w-full border-b border-[#F2F2F2] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          {deviceType === "desktop" ? (
            // 데스크탑 헤더
            <div className="flex w-full items-center justify-between">
              <LogoAndTab deviceType={deviceType} userRole={userRole} />
              <GnbActions
                userRole={userRole}
                logout={logout}
                userName={userName}
                deviceType={deviceType}
                toggleSideMenu={toggleMobileMenu}
                isSideMenuOpen={isMobileMenuOpen}
                profileImage={userProfileImage}
              />
            </div>
          ) : (
            // 모바일 & 태블릿 헤더
            <div className="flex w-full items-center justify-between">
              <LogoAndTab deviceType={deviceType} userRole={userRole} />
              <GnbActions
                userRole={userRole}
                logout={logout}
                userName={userName}
                deviceType={deviceType}
                toggleSideMenu={toggleMobileMenu}
                isSideMenuOpen={isMobileMenuOpen}
                profileImage={userProfileImage}
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
