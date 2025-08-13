"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { TUserType } from "@/types/user";

const SigninHeader = ({ userType }: { userType: TUserType }) => {
  const t = useTranslations("auth");
  const locale = useLocale();

  const getAlternateUserTypeInfo = () => {
    if (userType === "CUSTOMER") {
      return {
        message: t("areYouMover"),
        link: t("moverPage"),
        href: `/${locale}/moverSignin`,
      };
    } else {
      return {
        message: t("areYouCustomer"),
        link: t("customerPage"),
        href: `/${locale}/userSignin`,
      };
    }
  };

  const alternateInfo = getAlternateUserTypeInfo();

  return (
    <header
      className="flex h-[100px] w-[300px] flex-col items-center justify-between gap-[11px] md:gap-[18px]"
      aria-label={t("signinPageHeader")}
    >
      <Link href="/" aria-label={t("goToHome")}>
        <Image src="/img/logo/textlogo.webp" alt="떠나요 로고" width={100} height={100} priority quality={100} />
      </Link>

      <div aria-label={t("signinHeaderSwitchRoleLabel")}>
        <span className="text-black-200 text-lg">{alternateInfo.message}</span>
        <Link href={alternateInfo.href} className="text-primary-400 ml-2 text-xl font-semibold underline">
          {alternateInfo.link}
        </Link>
      </div>
    </header>
  );
};

export default SigninHeader;
