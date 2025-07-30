"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import logo from "@/assets/img/logo/textlogo-lg.png";
import { UserType } from "@/types/user";

const SigninHeader = ({ userType }: { userType: UserType }) => {
  const t = useTranslations("auth");

  const getAlternateUserTypeInfo = () => {
    if (userType === "CUSTOMER") {
      return {
        message: t("areYouMover"),
        link: t("moverPage"),
        href: "/moverSignin",
      };
    } else {
      return {
        message: t("areYouCustomer"),
        link: t("customerPage"),
        href: "/userSignin",
      };
    }
  };

  const alternateInfo = getAlternateUserTypeInfo();

  return (
    <div className="flex h-[100px] w-[250px] flex-col items-center justify-between gap-[11px] md:gap-[18px]">
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

export default SigninHeader;
