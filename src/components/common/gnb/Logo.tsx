import Image from "next/image";
import Link from "next/link";
import React from "react";
import fulllogo from "@/assets/img/logo/fulllogo-lg.png";
import logo from "@/assets/img/logo/logo-l.png";
import { TUserRole } from "@/types/user.types";
import { TDeviceType } from "@/types/deviceType";

interface ILogoProps {
  size: TDeviceType;
  userRole: TUserRole;
}

export const Logo = ({ size = "mobile", userRole = "GUEST" }: ILogoProps) => {
  const isFullLogo = !(userRole !== "GUEST" && size === "mobile");
  const logoSrc = isFullLogo ? fulllogo : logo;
  const width = isFullLogo ? (size === "desktop" ? 116 : 88) : 32;
  const height = isFullLogo ? (size === "desktop" ? 44 : 34) : 32;
  const linkUrl = userRole === "GUEST" ? "/" : userRole === "CUSTOMER" ? "/searchMover" : "/estimate/received";

  return (
    <Link href={linkUrl} aria-label="홈으로 이동">
      <Image
        src={logoSrc}
        alt="logo"
        width={width}
        height={height}
        priority // ✅ LCP 최적화 핵심
        loading="eager" // ✅ lazy 제거
      />
    </Link>
  );
};
