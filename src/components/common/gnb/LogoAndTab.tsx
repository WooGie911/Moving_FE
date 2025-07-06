import React, { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { TDeviceType } from "@/types/deviceType";
import { TUserRole } from "@/types/userRole";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GEUST_NAVIGATION_ITEMS, MOVER_NAVIGATION_ITEMS, USER_NAVIGATION_ITEMS } from "@/constant/gnbItems";

type TLogoAndTabProps = {
  deviceType: TDeviceType;
  userRole: TUserRole;
};

type TNavigationItem = {
  name: string;
  href: string;
};

export const LogoAndTab = ({ deviceType, userRole }: TLogoAndTabProps) => {
  const pathname = usePathname();
  const [navigationItems, setNavigationItems] = useState<TNavigationItem[]>([]);

  useEffect(() => {
    if (userRole === "user") {
      setNavigationItems(USER_NAVIGATION_ITEMS);
    } else if (userRole === "mover") {
      setNavigationItems(MOVER_NAVIGATION_ITEMS);
    } else {
      setNavigationItems(GEUST_NAVIGATION_ITEMS);
    }
  }, [userRole]);

  return (
    <>
      {/* 로고 영역 */}
      <div className="flex items-center gap-20">
        <Logo size={deviceType} userRole={userRole} />

        {/* 네비게이션 영역 */}
        {deviceType === "desktop" && (
          <div className="flex gap-10">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-2lg font-bold transition-colors ${
                  pathname === "/" || pathname === item.href ? "text-black" : "text-gray-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
