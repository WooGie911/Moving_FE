"use client";

import React from "react";
import { SignupForm, SignupHeader } from "@/components/auth/signup";
import { SocialLoginButtons, MascotCharacter } from "@/components/auth";

const UserSignupPage = () => {
  return (
    <div className="md:bg-primary-400 flex w-full items-center justify-center overflow-x-hidden bg-white md:min-h-[1300px]">
      <div className="relative h-[1150px] w-full bg-white px-6 py-12 md:max-w-[560px] md:rounded-[40px] md:px-10 lg:max-w-[740px]">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-center justify-between gap-[11px] md:gap-[18px]">
          <SignupHeader userType="CUSTOMER" />
        </div>

        {/* 회원가입 폼 */}
        <div className="mt-6 flex flex-col gap-6 md:gap-10">
          <SignupForm userType="CUSTOMER" signinLink="/userSignin" />

          <div className="flex flex-col items-center justify-center gap-6">
            <SocialLoginButtons userType="CUSTOMER" />
          </div>
        </div>

        {/* 캐릭터 - 고정 위치 */}
        <MascotCharacter userType="CUSTOMER" />
      </div>
    </div>
  );
};

export default UserSignupPage;
