"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import logo from "@/assets/img/logo/textlogo-lg.png";

interface SignupHeaderProps {
  userType: "CUSTOMER" | "MOVER";
}

const SignupHeader = ({ userType }: SignupHeaderProps) => {
  const t = useTranslations("auth");

  const getAlternateUserTypeInfo = () => {
    if (userType === "CUSTOMER") {
      return {
        message: t("areYouMover"),
        link: t("moverPage"),
        href: "/moverSignup",
      };
    } else {
      return {
        message: t("areYouCustomer"),
        link: t("customerPage"),
        href: "/userSignup",
      };
    }
  };

  const alternateInfo = getAlternateUserTypeInfo();

  return (
    <div className="flex w-full flex-col items-center justify-between gap-[11px] md:gap-[18px]">
      <Link href="/">
        <Image src={logo} alt="logo" width={100} height={100} />
      </Link>
      <Link href={alternateInfo.href}>
        <span className="text-black-200 text-lg">{alternateInfo.message}</span>
        <span className="text-primary-400 ml-2 text-lg font-semibold underline">{alternateInfo.link}</span>
      </Link>
    </div>
  );
};

export default SignupHeader;
