"use client";

import React from "react";
import { SignupForm, SignupHeader } from "@/components/auth/signup";
import { SocialLoginButtons, MascotCharacter } from "@/components/auth";

const MoverSignupPage = () => {
  return (
    <div className="bg-primary-400 flex min-h-screen w-full items-center justify-center overflow-x-hidden md:px-[52px] md:py-[48px]">
      <div className="flex w-full max-w-[740px] flex-col items-center justify-between gap-[48px] bg-white px-10 py-[48px] md:rounded-[40px] md:px-10">
        {/* 헤더 */}
        <SignupHeader userType="MOVER" />

        {/* 회원가입 폼 */}
        <SignupForm userType="MOVER" signinLink="/moverSignin" />

        {/* 소셜 로그인 및 마스코트 캐릭터 배치*/}
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <SocialLoginButtons userType="MOVER" />
          <MascotCharacter userType="MOVER" />
        </div>
      </div>
    </div>
  );
};

export default MoverSignupPage;
