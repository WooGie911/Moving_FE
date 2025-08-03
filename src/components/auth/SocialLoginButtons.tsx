"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "next-intl";
import google from "@/assets/icon/auth/icon-login-google.webp";
import kakao from "@/assets/icon/auth/icon-login-kakao.webp";
import naver from "@/assets/icon/auth/icon-login-naver.webp";
import { TUserType } from "@/types/user";

const SocialLoginButtons = ({ userType }: { userType: TUserType }) => {
  const { googleLogin, kakaoLogin, naverLogin } = useAuth();
  const t = useTranslations("auth");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <span className="text-black-200 text-lg">{t("snsLogin")}</span>
      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={() => googleLogin(userType)}
          aria-label={t("loginWithGoogle")}
          className="cursor-pointer"
        >
          <Image src={google} alt="Google" width={62} height={62} sizes="62px" quality={100} />
        </button>

        <button
          type="button"
          onClick={() => kakaoLogin(userType)}
          aria-label={t("loginWithKakao")}
          className="cursor-pointer"
        >
          <Image src={kakao} alt="Kakao" width={62} height={62} sizes="62px" quality={100} />
        </button>

        <button
          type="button"
          onClick={() => naverLogin(userType)}
          aria-label={t("loginWithNaver")}
          className="cursor-pointer"
        >
          <Image src={naver} alt="Naver" width={62} height={62} sizes="62px" quality={100} />
        </button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
