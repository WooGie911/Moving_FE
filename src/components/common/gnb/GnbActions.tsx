import { TUserRole } from "@/types/userRole";
import React from "react";
import profile from "@/assets/icon/auth/icon-profile-lg.png";
import Image from "next/image";
import notification from "@/assets/icon/notification/icon-notification-lg.png";
import { TDeviceType } from "@/types/deviceType";
import Link from "next/link";

interface IGnbActionsProps {
  userRole: TUserRole;
  deviceType: TDeviceType;
  toggleSideMenu: () => void;
  isSideMenuOpen: boolean;
}

export const GnbActions = ({ userRole, deviceType, toggleSideMenu, isSideMenuOpen }: IGnbActionsProps) => {
  // TODO : 추후 사용자 정보를 가져오는 로직이 작성되면 프로필 이미지 적용하기 없으면 기본이미지

  return (
    <div className="flex items-center gap-4">
      {userRole === "guest" && deviceType === "desktop" && (
        <Link
          href="/signin"
          className="bg-primary-400 hover:bg-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          로그인
        </Link>
      )}

      {userRole !== "guest" && (
        <>
          {/* 알림 버튼 */}
          <button className="hover:text-black-400 cursor-pointer p-2 text-gray-400 transition-colors" aria-label="알림">
            <div className="relative h-6 w-6">
              {/* 알림 아이콘 자리 - 이미지로 교체 예정 */}
              <Image src={notification} alt="알림" width={24} height={24} />
              {/* 알림 뱃지 (필요시) */}
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></div>
            </div>
          </button>

          {/* 프로필 버튼 */}
          <button
            className="hover:text-black-400 cursor-pointer p-2 text-gray-400 transition-colors"
            aria-label="프로필"
          >
            <Image src={profile} alt="프로필" width={24} height={24} />
          </button>
          {/* TODO : 추후 userRole에서 추출후 삽입 */}
          {deviceType === "desktop" && <div>프로필 이름</div>}
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
