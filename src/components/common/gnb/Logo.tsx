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
  return (
    <Link href="/">
      {userRole !== "GUEST" && size === "mobile" ? (
        <Image src={logo} alt="logo" width={32} height={32} />
      ) : (
        <Image src={fulllogo} alt="logo" width={size === "desktop" ? 116 : 88} height={size === "desktop" ? 44 : 34} />
      )}
    </Link>
  );
};
