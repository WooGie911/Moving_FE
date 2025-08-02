"use client";

import React from "react";
import { SignupForm, SignupHeader } from "@/components/auth/signup";
import { SocialLoginButtons, MascotCharacter } from "@/components/auth";
import { useTranslations } from "next-intl";

const MoverSignupPage = () => {
  const t = useTranslations("auth");

  return (
    <main
      className="md:bg-primary-400 flex h-screen min-h-[1100px] w-full items-center justify-center overflow-x-hidden bg-white md:min-h-[1200px]"
      aria-label={t("signupPageBg")}
    >
      <section
        className="relative h-[1100px] w-full bg-white px-6 py-12 md:max-w-[560px] md:rounded-[40px] md:px-10 lg:max-w-[740px]"
        aria-label={t("signupPageContainer")}
      >
        {/* 시각장애인용 제목 */}
        <h1 id="signupPageTitle" className="sr-only">
          {t("moverSignupPageTitle")}
        </h1>

        {/* 헤더 */}
        <div
          className="flex w-full flex-col items-center justify-between gap-[11px] md:gap-[18px]"
          role="presentation"
          aria-label={t("signupPageHeader")}
        >
          <SignupHeader userType="MOVER" />
        </div>

        {/* 회원가입 폼 */}
        <div className="mt-6 flex flex-col gap-6 md:gap-10" role="presentation" aria-label={t("signupPageForm")}>
          <SignupForm userType="MOVER" signinLink="/moverSignin" />
          <div
            className="flex flex-col items-center justify-center gap-6"
            role="group"
            aria-label={t("signupPageSocial")}
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

export default MoverSignupPage;
