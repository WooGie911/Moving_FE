import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import React from "react";
import { TUserRole } from "@/types/user.types";
import { TDeviceType } from "@/types/deviceType";

interface ILogoProps {
  size: TDeviceType;
  userRole: TUserRole;
}

export const Logo = ({ size = "mobile", userRole = "GUEST" }: ILogoProps) => {
  const locale = useLocale();
  const isFullLogo = !(userRole !== "GUEST" && size === "mobile");
  // Vercel CDN 최적화를 위해 public 경로 사용
  const logoSrc = isFullLogo ? "/img/logo/fulllogo.webp" : "/img/logo/logo.webp";
  const width = isFullLogo ? (size === "desktop" ? 116 : 88) : 32;
  const height = isFullLogo ? (size === "desktop" ? 44 : 34) : 32;
  const linkPath = userRole === "GUEST" ? "/" : userRole === "CUSTOMER" ? "/searchMover" : "/estimate/received";
  const linkUrl = `/${locale}${linkPath}`;

  return (
    <Link href={linkUrl} aria-label="홈으로 이동">
      <Image src={logoSrc} alt="logo" width={width} height={height} priority loading="eager" />
    </Link>
  );
};
