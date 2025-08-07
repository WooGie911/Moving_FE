"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { TextInput } from "@/components/common/input/TextInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/common/button/Button";
import { IEditBasicForm } from "@/types/user";
import { useRouter } from "next/navigation";
import userApi from "@/lib/api/user.api";
import { useAuth } from "@/providers/AuthProvider";
import { useValidationRules } from "@/hooks/useValidationRules";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";

const EditPage = () => {
  const router = useRouter();
  const { getUser } = useAuth();

  const [formError, setFormError] = useState<string | null>(null);
  const [userProvider, setUserProvider] = useState<string>("LOCAL");
  const t = useTranslations("edit");
  const authT = useTranslations("auth");
  const locale = useLocale();
  const validationRules = useValidationRules();
  const form = useForm<IEditBasicForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  // 유저 정보 불러와서 폼 초기값 세팅
  useEffect(() => {
    async function fetchUser() {
      const res = await userApi.getUser();
      if (res.success && res.data) {
        form.reset({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phoneNumber || "",
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        });
        // 유저의 provider 정보 저장
        setUserProvider(res.data.provider || "LOCAL");
      }
    }
    fetchUser();
  }, [form]);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = form;

  const allFilled = [
    watch("name"),
    watch("phone"),
    watch("currentPassword"),
    watch("newPassword"),
    watch("newPasswordConfirm"),
  ].every((v) => v && v.trim() !== "");

  const requiredFilled = [watch("name"), watch("phone")].every((v) => v && v.trim() !== "");
  
  // 소셜 로그인 유저인지 확인
  const isSocialLogin = userProvider !== "LOCAL";

  const onSubmit = async (data: IEditBasicForm) => {
    try {
      setFormError(null);
      
      // 현재 비밀번호와 새 비밀번호가 같은지 확인
      if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
        form.setError("newPassword", { message: "새 비밀번호는 현재 비밀번호와 달라야 합니다." });
        return;
      }
      
      const req = {
        name: data.name,
        phoneNumber: data.phone,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined,
      };
      const result = await userApi.updateMoverBasicInfo(req);
      if (result.success) {
        await getUser();
        showSuccessToast(t("successMessage"));
        router.push(`/${locale}/moverMyPage`);
      } else {
        if (result.message?.includes("비밀번호")) {
          form.setError("currentPassword", { message: result.message });
        } else {
          showErrorToast(result.message || t("errorMessage"));
        }
      }
    } catch (e) {
      showErrorToast(t("generalError"));
    }
  };

  return (
          <div className="flex min-h-[90vh] w-full items-center justify-center bg-white">
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-12 rounded-3xl bg-white px-4 py-10 lg:max-w-[1200px]">
        <div className="mb-4 text-2xl font-bold !text-black text-black">{t("title")}</div>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className={`grid grid-cols-1 gap-x-40 gap-y-8 ${!isSocialLogin ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
            <div className={`flex flex-col gap-8 ${isSocialLogin ? 'lg:mx-auto lg:max-w-[500px]' : ''}`}>
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">{t("name")}</div>
                <TextInput
                  name="name"
                  rules={validationRules.name}
                  placeholder={t("namePlaceholder")}
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-200 text-base !text-black"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">{t("email")}</div>
                <TextInput
                  name="email"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base text-[#999999] pointer-events-none bg-gray-100"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                  placeholder={t("emailPlaceholder")}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">{t("phone")}</div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-lg">*</div>
                </div>
                <TextInput
                  name="phone"
                  rules={validationRules.phoneNumber}
                  placeholder={t("phonePlaceholder")}
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-200 text-base !text-black"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                />
              </div>
            </div>
            {!isSocialLogin && (
              <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">{t("currentPassword")}</div>
                <PasswordInput
                  name="currentPassword"
                  placeholder={t("currentPasswordPlaceholder")}
                  rules={{
                    validate: (value) => {
                      if (watch("newPassword") || watch("newPasswordConfirm")) {
                        return value ? true : t("currentPasswordRequired");
                      }
                      return true;
                    },
                  }}
                  inputClassName="w-full lg:w-[500px] h-[54px] lg:h-[64px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] relative"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">{t("newPassword")}</div>
                <PasswordInput
                  name="newPassword"
                  placeholder={t("newPasswordPlaceholder")}
                  rules={{
                    validate: (value) => {
                      if (watch("currentPassword") || watch("newPasswordConfirm")) {
                        if (!value) return t("newPasswordRequired");
                        return validationRules.password.validate(value);
                      }
                      return true;
                    },
                  }}
                  inputClassName="w-full lg:w-[500px] h-[54px] lg:h-[64px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] relative"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">{t("confirmNewPassword")}</div>
                <PasswordInput
                  name="newPasswordConfirm"
                  placeholder={t("confirmNewPasswordPlaceholder")}
                  rules={{
                    validate: (value) => {
                      if (watch("currentPassword") || watch("newPassword")) {
                        if (!value) return t("confirmNewPasswordRequired");
                        if (value !== getValues("newPassword")) return t("passwordMismatch");
                      }
                      return true;
                    },
                  }}
                  inputClassName="w-full lg:w-[500px] h-[54px] lg:h-[64px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] relative"
                />
              </div>
            </div>
            )}
            <div className={`mt-8 flex w-full flex-col-reverse gap-3 ${!isSocialLogin ? 'col-span-1 lg:col-span-2 lg:flex-row lg:justify-end' : 'lg:mx-auto lg:max-w-[500px] lg:flex-row lg:justify-end'} lg:gap-4`}>
              <button
                type="button"
                className="h-[54px] w-full rounded-xl px-6 py-4 text-base font-semibold text-neutral-400 shadow-[4px_4px_10px_0px_rgba(195,217,242,0.20)] outline outline-1 outline-offset-[-1px] outline-stone-300 lg:h-[60px] lg:w-[240px] cursor-pointer"
                onClick={() => router.back()}
              >
                {t("cancel")}
              </button>
              <Button
                variant="solid"
                state={requiredFilled ? "default" : "disabled"}
                className="h-[54px] w-full rounded-xl bg-[#F9502E] p-4 text-base font-semibold text-white hover:bg-[#e04322] lg:h-[60px] lg:w-[240px]"
                disabled={!requiredFilled}
                onClick={handleSubmit(onSubmit)}
              >
                {t("save")}
              </Button>
            </div>
            {formError && <div className="col-span-1 mt-2 text-sm text-red-500 lg:col-span-2">{formError}</div>}
          </form>
        </FormProvider>
      </div>
      <style jsx global>{`
        .relative [class*="absolute"][class*="right-"] {
          right: 1rem !important;
        }
        @media (min-width: 1024px) {
          .relative [class*="absolute"][class*="right-"] {
            right: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EditPage;
