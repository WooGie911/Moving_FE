"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BaseInput } from "@/components/common/input/BaseInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { ISignInFormValues } from "@/types/auth";
import { useAuth } from "@/providers/AuthProvider";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useLocale, useTranslations } from "next-intl";
import { TUserType } from "@/types/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleAuthErrorToast } from "@/utils/handleAuthErrorToast";

interface ISigninFormProps {
  userType: TUserType;
  signupLink: string;
}

const SigninForm = ({ userType, signupLink }: ISigninFormProps) => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const validationRules = useValidationRules();
  const t = useTranslations("auth");
  const currentLocale = useLocale();

  const form = useForm<ISignInFormValues>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  const email = watch("email");
  const password = watch("password");

  const isFormValid = email && password && email.trim() !== "" && password.trim() !== "" && isValid;

  const onSubmit = async () => {
    try {
      if (isLoading) return;
      const response = await login(email, password, userType);
      if (response.success) {
      } else {
        if (userType === "CUSTOMER") {
          router.push(`/${currentLocale}/searchMover`);
        } else {
          router.push(`/${currentLocale}/estimate/received`);
        }
      }
    } catch (error: any) {
      handleAuthErrorToast(t, error.message);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <div className="mb-6 flex flex-col gap-2 font-normal">
          <label htmlFor="email" className="text-black-400 text-md">
            {t("email")}
          </label>
          <BaseInput
            {...register("email", validationRules.email)}
            error={errors.email?.message}
            placeholder={t("emailPlaceholder")}
            inputClassName="py-3.5 px-3.5"
            wrapperClassName="w-full sm:w-full"
          />
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <label htmlFor="password" className="text-black-400 text-md font-normal">
            {t("password")}
          </label>
          <PasswordInput
            {...register("password", validationRules.password)}
            placeholder={t("passwordPlaceholder")}
            inputClassName="py-3.5 px-3.5"
            wrapperClassName="w-full sm:w-full"
          />
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            aria-disabled={!isFormValid || isLoading}
            aria-busy={isLoading}
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

          <div className="flex w-full items-center justify-center gap-2">
            <span className="text-black-200 text-lg">{t("notMemberYet")}</span>
            <Link href={signupLink} className="text-primary-400 text-lg font-semibold underline">
              {t("signup")}
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SigninForm;
