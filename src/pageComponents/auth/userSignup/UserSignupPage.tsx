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
import userAvatarLg from "@/assets/img/mascot/user-avatartion-lg.png";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { ISignUpFormValues } from "@/types/auth";
import { useAuth } from "@/providers/AuthProvider";
import { validationRules } from "@/utils/validators";
import { useModal } from "@/components/common/modal/ModalContext";

const UserSignupPage = () => {
  const deviceType = useWindowWidth();
  const { isLoading, signUp, googleLogin } = useAuth();
  const { open, close } = useModal();

  const form = useForm<ISignUpFormValues>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  // 입력 값 감시
  const name = watch("name");
  const email = watch("email");
  const phoneNumber = watch("phoneNumber");
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");

  // 회원 가입 버튼 활성화 조건 (값 존재 + validation 통과)
  const isFormValid = name && email && phoneNumber && password && passwordCheck && isValid;

  const onSubmit = async (data: ISignUpFormValues) => {
    const signUpData = {
      email: data.email,
      password: data.password,
      name: data.name,
      phoneNumber: data.phoneNumber,
      userType: "CUSTOMER" as const,
    };

    try {
      if (isLoading) return;
      const response = await signUp(signUpData);
      if (!response.success) {
        open({
          title: "회원가입 실패",
          children: <div>{response.message}</div>,
          buttons: [{ text: "확인", onClick: () => close() }],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-primary-400 flex min-h-screen w-full items-center justify-center overflow-x-hidden md:px-[52px] md:py-[48px]">
      <div className="flex w-full max-w-[740px] flex-col items-center justify-between gap-[48px] bg-white px-10 py-[48px] md:rounded-[40px] md:px-10">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-center justify-between gap-[11px] md:gap-[18px]">
          <Link href="/">
            <Image src={logo} alt="logo" width={100} height={100} />
          </Link>
          <Link href="/moverSignup">
            <span className="text-black-200 text-lg">기사님이신가요?</span>
            <span className="text-primary-400 ml-2 text-lg font-semibold underline">기사님 전용 페이지</span>
          </Link>
        </div>

        {/* 회원가입 폼 */}
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
            {/* 이름 */}
            <div className="mb-6 flex flex-col gap-2 font-normal">
              <span className="text-black-400 text-md">이름</span>
              <BaseInput
                {...register("name", validationRules.name)}
                error={errors.name?.message}
                placeholder="이름을 입력해주세요."
                inputClassName="py-3.5 px-3.5"
                wrapperClassName="w-full sm:w-full"
              />
            </div>

            {/* 이메일 */}
            <div className="mb-6 flex flex-col gap-2 font-normal">
              <span className="text-black-400 text-md">이메일</span>
              <BaseInput
                {...register("email", validationRules.email)}
                error={errors.email?.message}
                placeholder="이메일을 입력해주세요."
                inputClassName="py-3.5 px-3.5"
                wrapperClassName="w-full sm:w-full"
              />
            </div>

            {/* 전화번호 */}
            <div className="mb-6 flex flex-col gap-2 font-normal">
              <span className="text-black-400 text-md">전화번호</span>
              <BaseInput
                {...register("phoneNumber", validationRules.phoneNumber)}
                error={errors.phoneNumber?.message}
                placeholder="전화번호를 입력해주세요."
                inputClassName="py-3.5 px-3.5"
                wrapperClassName="w-full sm:w-full"
              />
            </div>

            {/* 비밀번호*/}
            <div className="mb-6 flex flex-col gap-2">
              <span className="text-black-400 text-md font-normal">비밀번호</span>
              <PasswordInput
                {...register("password", validationRules.password)}
                placeholder="비밀번호를 입력해주세요."
                inputClassName="py-3.5 px-3.5"
                wrapperClassName="w-full sm:w-full"
              />
            </div>

            {/* 비밀번호 확인*/}
            <div className="mb-6 flex flex-col gap-2">
              <span className="text-black-400 text-md font-normal">비밀번호 확인</span>
              <PasswordInput
                {...register("passwordCheck", {
                  required: "비밀번호 확인은 필수 입력입니다.",
                  validate: (value) => {
                    const passwordValue = watch("password");
                    return value === passwordValue || "비밀번호가 일치하지 않습니다.";
                  },
                })}
                placeholder="비밀번호를 다시 입력해주세요."
                inputClassName="py-3.5 px-3.5"
                wrapperClassName="w-full sm:w-full"
              />
            </div>

            <div className="flex flex-col gap-4">
              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`mt-4 rounded-xl px-4 py-4 text-lg font-semibold text-white transition ${
                  isFormValid && !isLoading
                    ? "bg-primary-400 hover:bg-primary-500 cursor-pointer"
                    : "cursor-not-allowed bg-gray-300"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="ml-2">회원가입 중...</span>
                  </div>
                ) : (
                  "회원가입"
                )}
              </button>
              {/* 회원가입 링크 */}
              <div className="flex w-full items-center justify-center gap-2">
                <span className="text-black-200 text-lg">이미 무빙 회원이신가요?</span>
                <Link href="/userSignin">
                  <span className="text-primary-400 text-lg font-semibold underline">로그인</span>
                </Link>
              </div>
            </div>
          </form>
        </FormProvider>

        {/* 소셜 로그인 및 마스코트 캐릭터 배치*/}
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <span className="text-black-200 text-lg">SNS 계정으로 간편 로그인</span>
          <div className="flex items-center gap-8">
            <Image
              src={google}
              alt="google"
              width={62}
              height={62}
              className="cursor-pointer"
              onClick={() => googleLogin("CUSTOMER")}
            />
            <Image src={kakao} alt="kakao" width={62} height={62} className="cursor-pointer" />
            <Image src={naver} alt="naver" width={62} height={62} className="cursor-pointer" />
          </div>

          {deviceType === "tablet" && (
            <div className="relative flex min-w-[180px]">
              <Image
                src={userAvatarLg}
                alt="moverAvatar"
                width={180}
                className="absolute -right-[330px] -bottom-[54px]"
              />
            </div>
          )}

          {deviceType === "desktop" && (
            <div className="relative flex min-w-[420px]">
              <Image
                src={userAvatarLg}
                alt="moverAvatar"
                width={420}
                className="absolute -right-[520px] -bottom-[80px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSignupPage;
