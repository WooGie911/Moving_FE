"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BaseInput } from "@/components/common/input/BaseInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { ISignInFormValues } from "@/types/auth";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/components/common/modal/ModalContext";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useTranslations } from "next-intl";
import { UserType } from "@/types/user";

interface SigninFormProps {
  userType: UserType;
  signupLink: string;
}

const SigninForm = ({ userType, signupLink }: SigninFormProps) => {
  const { login, isLoading } = useAuth();
  const validationRules = useValidationRules();
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
      const response = await login(email, password, userType);
      if (!response.success) {
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
                <span className="ml-2">{t("loginInProgress")}</span>
              </div>
            ) : (
              t("login")
            )}
          </button>
          {/* 회원가입 링크 */}
          <div className="flex w-full items-center justify-center gap-2">
            <span className="text-black-200 text-lg">{t("notMemberYet")}</span>
            <a href={signupLink}>
              <span className="text-primary-400 text-lg font-semibold underline">{t("signup")}</span>
            </a>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SigninForm;
