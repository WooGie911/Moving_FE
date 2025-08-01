"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import logo from "@/assets/img/logo/textlogo-lg.webp";
import { TUserType } from "@/types/user";

const SignupHeader = ({ userType }: { userType: TUserType }) => {
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
    <header
      className="flex w-full flex-col items-center justify-between gap-[11px] md:gap-[18px]"
      role="presentation"
      aria-label={t("signupPageHeader")}
    >
      <Link href="/" aria-label={t("goToHome")}>
        <Image src={logo} alt="떠나요 로고" width={100} height={100} quality={100} />
      </Link>

      <div aria-label={t("switchUserTypeGuide")}>
        <span className="text-black-200 text-lg">{alternateInfo.message}</span>
        <Link href={alternateInfo.href} className="text-primary-400 ml-2 text-xl font-semibold underline">
          {alternateInfo.link}
        </Link>
      </div>
    </header>
  );
};

export default SignupHeader;
