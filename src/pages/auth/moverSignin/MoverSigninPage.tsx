"use client";

import React from "react";
import logo from "@/assets/img/logo/textlogo-lg.png";
import Image from "next/image";
import Link from "next/link";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { FormProvider, useForm } from "react-hook-form";
import { BaseInput } from "@/components/common/input/BaseInput";
import google from "@/assets/icon/auth/icon-login-google-lg.png";
import kakao from "@/assets/icon/auth/icon-login-kakao-lg.png";
import naver from "@/assets/icon/auth/icon-login-naver-lg.png";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import moverAvatarLg from "@/assets/img/mascot/mover-avatartion-lg.png";

interface IFormValues {
  email: string;
  password: string;
}

const MoverSigninPage = () => {
  const deviceType = useWindowWidth();

  const form = useForm<IFormValues>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  // 입력 값 감시
  const email = watch("email");
  const password = watch("password");

  // 로그인 버튼 활성화 조건 (값 존재 + validation 통과)
  const isFormValid = email && password && email.trim() !== "" && password.trim() !== "" && isValid;

  const onSubmit = (data: IFormValues) => {
    console.log(data);
    // ✅ TODO: 서버 액션 연동 or mutate
  };

  return (
    <div className="bg-primary-400 flex w-full items-center justify-center md:h-[947px] md:px-[52px] lg:h-[942px]">
      <div className="flex h-full w-full max-w-[740px] flex-col items-center justify-center gap-[48px] bg-white px-10 pt-10 md:max-h-[768px] md:rounded-[40px]">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-center justify-between gap-[11px] md:gap-[18px]">
          <Link href="/">
            <Image src={logo} alt="logo" width={100} height={100} />
          </Link>
          <Link href="/userSignin">
            <span className="text-black-200 text-lg">일반 유저라면?</span>
            <span className="text-primary-400 ml-2 text-lg font-semibold underline">일반 유저 전용 페이지</span>
          </Link>
        </div>

        {/* 로그인 폼 */}
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
            <div className="mb-6 flex flex-col gap-2 font-normal">
              <span className="text-black-400 text-md">이메일</span>
              <BaseInput
                {...register("email", {
                  required: "이메일은 필수 입력입니다.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "유효한 이메일 형식이 아닙니다.",
                  },
                })}
                error={errors.email?.message}
                placeholder="이메일을 입력해주세요."
                inputClassName="py-3.5 px-3.5"
                wrapperClassName="w-full sm:w-full"
              />
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <span className="text-black-400 text-md font-normal">비밀번호</span>
              <PasswordInput
                {...register("password", {
                  required: "비밀번호는 필수 입력입니다.",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
                    message: "비밀번호는 최소 8자 이상이며 영문, 숫자, 특수문자를 포함해야 합니다.",
                  },
                })}
                placeholder="비밀번호를 입력해주세요."
                inputClassName="py-3.5 px-3.5"
                wrapperClassName="w-full sm:w-full"
              />
            </div>

            <div className="flex flex-col gap-4">
              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`mt-4 rounded-xl px-4 py-4 text-lg font-semibold text-white transition ${
                  isFormValid ? "bg-primary-400 hover:bg-primary-500 cursor-pointer" : "cursor-not-allowed bg-gray-300"
                }`}
              >
                로그인
              </button>
              {/* 회원가입 링크 */}
              <div className="flex w-full items-center justify-center gap-2">
                <span className="text-black-200 text-lg">아직 무빙 회원이 아니신가요?</span>
                <Link href="/moverSignup">
                  <span className="text-primary-400 text-lg font-semibold underline">회원가입</span>
                </Link>
              </div>
            </div>
          </form>
        </FormProvider>

        {/* 소셜 로그인 */}
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <span className="text-black-200 text-lg">SNS 계정으로 간편 로그인</span>
          <div className="flex items-center gap-8">
            <Image src={google} alt="google" width={62} height={62} className="cursor-pointer" />
            <Image src={kakao} alt="kakao" width={62} height={62} className="cursor-pointer" />
            <Image src={naver} alt="naver" width={62} height={62} className="cursor-pointer" />
          </div>
        </div>

        {/* 마스코트 캐릭터 */}
        {deviceType === "tablet" && (
          <div className="relative flex min-w-[180px]">
            <Image
              src={moverAvatarLg}
              alt="moverAvatar"
              width={180}
              className="absolute -right-[330px] -bottom-[54px]"
            />
          </div>
        )}

        {deviceType === "desktop" && (
          <div className="relative flex min-w-[320px]">
            <Image
              src={moverAvatarLg}
              alt="moverAvatar"
              width={320}
              className="absolute -right-[480px] -bottom-[32px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MoverSigninPage;
