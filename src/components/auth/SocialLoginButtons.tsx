"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "next-intl";
import google from "@/assets/icon/auth/icon-login-google-lg.png";
import kakao from "@/assets/icon/auth/icon-login-kakao-lg.png";
import naver from "@/assets/icon/auth/icon-login-naver-lg.png";

interface SocialLoginButtonsProps {
  userType: "CUSTOMER" | "MOVER";
}

const SocialLoginButtons = ({ userType }: SocialLoginButtonsProps) => {
  const { googleLogin, kakaoLogin, naverLogin } = useAuth();
  const t = useTranslations("auth");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <span className="text-black-200 text-lg">{t("snsLogin")}</span>
      <div className="flex items-center gap-8">
        <Image
          src={google}
          alt="google"
          width={62}
          height={62}
          className="cursor-pointer"
          onClick={() => googleLogin(userType)}
        />
        <Image
          src={kakao}
          alt="kakao"
          width={62}
          height={62}
          className="cursor-pointer"
          onClick={() => kakaoLogin(userType)}
        />
        <Image
          src={naver}
          alt="naver"
          width={62}
          height={62}
          className="cursor-pointer"
          onClick={() => naverLogin(userType)}
        />
      </div>
    </div>
  );
};

export default SocialLoginButtons;
