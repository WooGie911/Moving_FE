"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
import { ISignInFormValues } from "@/types/auth";
import { useAuth } from "@/providers/AuthProvider";
import { validationRules } from "@/utils/validators";
import { useModal } from "@/components/common/modal/ModalContext";

const UserSigninPage = () => {
  const { login, isLoading, googleLogin } = useAuth();
  const deviceType = useWindowWidth();
  const { open, close } = useModal();
  const t = useTranslations("auth");

  const form = useForm<ISignInFormValues>({
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

  const onSubmit = async () => {
    try {
      if (isLoading) return;
      const response = await login(email, password, "CUSTOMER");
      if (response.success === false) {
        open({
          title: t("loginFailed"),
          children: <div>{response.message}</div>,
          buttons: [{ text: t("confirm"), onClick: () => close() }],
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
          <Link href="/moverSignin">
            <span className="text-black-200 text-lg">{t("areYouMover")}</span>
            <span className="text-primary-400 ml-2 text-lg font-semibold underline">{t("moverPage")}</span>
          </Link>
        </div>

        {/* 로그인 폼 */}
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
            <div className="mb-6 flex flex-col gap-2 font-normal">
              <span className="text-black-400 text-md">{t("email")}</span>
              <BaseInput
                {...register("email", validationRules.email)}
                error={errors.email?.message}
                placeholder={t("emailPlaceholder")}
                inputClassName="py-3.5 px-3.5"
                wrapperClassName="w-full sm:w-full"
              />
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <span className="text-black-400 text-md font-normal">{t("password")}</span>
              <PasswordInput
                {...register("password", validationRules.password)}
                placeholder={t("passwordPlaceholder")}
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
                    <span className="ml-2">로그인 중...</span>
                  </div>
                ) : (
                  "로그인"
                )}
              </button>
              {/* 회원가입 링크 */}
              <div className="flex w-full items-center justify-center gap-2">
                <span className="text-black-200 text-lg">아직 무빙 회원이 아니신가요?</span>
                <Link href="/userSignup">
                  <span className="text-primary-400 text-lg font-semibold underline">회원가입</span>
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

export default UserSigninPage;
