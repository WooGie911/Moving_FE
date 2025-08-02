"use client";

import React from "react";
import { SigninForm, SigninHeader } from "@/components/auth/signin";
import { SocialLoginButtons, MascotCharacter } from "@/components/auth";
import { useTranslations } from "next-intl";

const MoverSigninPage = () => {
  const t = useTranslations("auth");

  return (
    <main
      className="md:bg-primary-400 flex w-full items-center justify-center overflow-x-hidden bg-white sm:h-screen"
      aria-label={t("signinPageBg")}
    >
      <section
        className="relative w-full bg-white px-6 py-12 md:max-w-[560px] md:rounded-[40px] md:px-10 lg:max-w-[740px]"
        aria-label={t("signinPageContainer")}
      >
        {/* 시각장애인용 제목 */}
        <h1 id="signinPageTitle" className="sr-only">
          {t("moverSigninPageTitle")}
        </h1>

        {/* 헤더 */}
        <div className="flex w-full flex-col items-center justify-between gap-[11px] md:gap-[18px]" role="presentation">
          <SigninHeader userType="MOVER" />
        </div>

        {/* 로그인 폼 */}
        <div className="mt-6 flex flex-col gap-6 md:gap-10" role="presentation" aria-label={t("signinPageForm")}>
          <SigninForm userType="MOVER" signupLink="/moverSignup" />
          <div
            className="flex flex-col items-center justify-center gap-6"
            role="group"
            aria-label={t("signinPageSocial")}
          >
            <SocialLoginButtons userType="MOVER" />
          </div>
        </div>

        {/* 캐릭터 */}
        <MascotCharacter userType="MOVER" aria-hidden="true" />
      </section>
    </main>
  );
};

export default MoverSigninPage;
