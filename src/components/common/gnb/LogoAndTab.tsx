import React, { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { TDeviceType } from "@/types/deviceType";
import { TUserRole } from "@/types/user.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { GEUST_NAVIGATION_ITEMS, MOVER_NAVIGATION_ITEMS, CUSTOMER_NAVIGATION_ITEMS } from "@/constant/gnbItems";
import { getPathWithoutLocale } from "@/utils/locale";
import { useTranslations } from "next-intl";

interface ILogoAndTabProps {
  deviceType: TDeviceType;
  userRole: TUserRole;
}

type TNavigationItem = {
  name: string;
  href: string;
};

export const LogoAndTab = ({ deviceType, userRole }: ILogoAndTabProps) => {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const locale = useLocale();

  const cleanPath = getPathWithoutLocale(pathname);

  const [navigationItems, setNavigationItems] = useState<TNavigationItem[]>([]);

  useEffect(() => {
    if (userRole === "CUSTOMER") {
      setNavigationItems(CUSTOMER_NAVIGATION_ITEMS);
    } else if (userRole === "MOVER") {
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
                href={`/${locale}${item.href}`}
                className={`text-2lg font-bold transition-colors ${
                  cleanPath === "/ko" ||
                  cleanPath === "/en" ||
                  cleanPath === "/zh" ||
                  cleanPath === item.href ||
                  cleanPath.startsWith(item.href + "/") ||
                  (item.href === "/review/writable" &&
                    (cleanPath === "/review/writable" || cleanPath === "/review/written")) ||
                  (item.href === "/estimateRequest/pending" &&
                    (cleanPath === "/estimateRequest/pending" || cleanPath === "/estimateRequest/received"))
                    ? "text-black"
                    : "text-gray-400"
                } transition-colors hover:text-black`}
              >
                {t(item.name)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
