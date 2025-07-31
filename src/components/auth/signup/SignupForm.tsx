"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BaseInput } from "@/components/common/input/BaseInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { ISignUpFormValues } from "@/types/auth";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/components/common/modal/ModalContext";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useLocale, useTranslations } from "next-intl";
import { TUserType } from "@/types/user";

interface ISignupFormProps {
  userType: TUserType;
  signinLink: string;
}

const SignupForm = ({ userType, signinLink }: ISignupFormProps) => {
  const { signUp, isLoading } = useAuth();
  const validationRules = useValidationRules();
  const { open, close } = useModal();
  const t = useTranslations("auth");
  const currentLocale = useLocale();

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
      userType: userType,
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
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col"
        aria-labelledby="signupFormTitle"
        role="form"
      >
        {/* 시각장애인용 제목 */}
        <h2 id="signupFormTitle" className="sr-only">
          {t("signupFormTitle")}
        </h2>

        {/* 이름 */}
        <div className="mb-6 flex flex-col gap-2 font-normal">
          <label htmlFor="name" className="text-black-400 text-md">
            {t("name")}
          </label>
          <BaseInput
            id="name"
            {...register("name", validationRules.name)}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            error={errors.name?.message}
            placeholder={t("namePlaceholder")}
            inputClassName="py-3.5 px-3.5"
            wrapperClassName="w-full sm:w-full"
          />
          {errors.name && (
            <span id="name-error" className="sr-only">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* 이메일 */}
        <div className="mb-6 flex flex-col gap-2 font-normal">
          <label htmlFor="email" className="text-black-400 text-md">
            {t("email")}
          </label>
          <BaseInput
            id="email"
            {...register("email", validationRules.email)}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            error={errors.email?.message}
            placeholder={t("emailPlaceholder")}
            inputClassName="py-3.5 px-3.5"
            wrapperClassName="w-full sm:w-full"
          />
          {errors.email && (
            <span id="email-error" className="sr-only">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* 전화번호 */}
        <div className="mb-6 flex flex-col gap-2 font-normal">
          <label htmlFor="phoneNumber" className="text-black-400 text-md">
            {t("phoneNumber")}
          </label>
          <BaseInput
            id="phoneNumber"
            {...register("phoneNumber", validationRules.phoneNumber)}
            aria-required="true"
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
            error={errors.phoneNumber?.message}
            placeholder={t("phoneNumberPlaceholder")}
            inputClassName="py-3.5 px-3.5"
            wrapperClassName="w-full sm:w-full"
          />
          {errors.phoneNumber && (
            <span id="phoneNumber-error" className="sr-only">
              {errors.phoneNumber.message}
            </span>
          )}
        </div>

        {/* 비밀번호 */}
        <div className={`flex flex-col gap-2 ${currentLocale === "en" ? "mb-12" : "mb-6"}`}>
          <label htmlFor="password" className="text-black-400 text-md font-normal">
            {t("password")}
          </label>
          <PasswordInput
            id="password"
            {...register("password", validationRules.password)}
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            placeholder={t("passwordPlaceholder")}
            inputClassName="py-3.5 px-3.5"
            wrapperClassName="w-full sm:w-full"
          />
          {errors.password && (
            <span id="password-error" className="sr-only">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-6 flex flex-col gap-2">
          <label htmlFor="passwordCheck" className="text-black-400 text-md font-normal">
            {t("passwordCheck")}
          </label>
          <PasswordInput
            id="passwordCheck"
            {...register("passwordCheck", {
              required: t("passwordCheckRequired"),
              validate: (value) => {
                const passwordValue = watch("password");
                return value === passwordValue || t("passwordMismatch");
              },
            })}
            aria-required="true"
            aria-invalid={!!errors.passwordCheck}
            aria-describedby={errors.passwordCheck ? "passwordCheck-error" : undefined}
            placeholder={t("passwordCheckPlaceholder")}
            inputClassName="py-3.5 px-3.5"
            wrapperClassName="w-full sm:w-full"
          />
          {errors.passwordCheck && (
            <span id="passwordCheck-error" className="sr-only">
              {errors.passwordCheck.message}
            </span>
          )}
        </div>

        {/* 제출 버튼 및 로그인 링크 */}
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`mt-4 rounded-xl px-4 py-4 text-lg font-semibold text-white transition ${
              isFormValid && !isLoading
                ? "bg-primary-400 hover:bg-primary-500 cursor-pointer"
                : "cursor-not-allowed bg-gray-300"
            }`}
            aria-disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="ml-2">{t("signupInProgress")}</span>
              </div>
            ) : (
              t("signup")
            )}
          </button>

          <div className="flex w-full items-center justify-center gap-2" role="presentation">
            <span className="text-black-200 text-lg">{t("alreadyMember")}</span>
            <a href={signinLink}>
              <span className="text-primary-400 text-lg font-semibold underline">{t("login")}</span>
            </a>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignupForm;
