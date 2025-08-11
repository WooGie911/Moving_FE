"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import uploadSkeleton from "@/assets/img/etc/profile-upload-skeleton.png";

import userApi from "@/lib/api/user.api";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useLocale, useTranslations } from "next-intl";
import {
  ProfileFormHeader,
  ProfileImageUpload,
  FormField,
  ServiceSelection,
  RegionSelection,
  ProfileFormButton,
} from "@/components/profile/register";
import { isValidName } from "@/utils/validators";
import { showSuccessToast } from "@/utils/toastUtils";
import { handleAuthErrorToast } from "@/utils/handleAuthErrorToast";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const MoverRegisterPage = () => {
  const { getUser } = useAuth();
  const router = useRouter();
  const validationRules = useValidationRules();
  const t = useTranslations("profile");
  const currentLocale = useLocale();

  const methods = useForm({
    mode: "onChange",
  });
  const { watch, handleSubmit } = methods;

  const nickname = watch("nickname");
  const career = watch("career");
  const shortIntro = watch("shortIntro");
  const detailIntro = watch("detailIntro");
  const [services, setServices] = useState<string[]>(["SMALL"]);
  const [regions, setRegions] = useState<string[]>(["SEOUL"]);
  const [selectedImage, setSelectedImage] = useState({
    name: "",
    type: "",
    dataUrl: uploadSkeleton.src,
  });

  const isNicknameValid = nickname?.trim().length >= 1 && isValidName(nickname);
  const allFilled =
    isNicknameValid &&
    career?.trim() &&
    shortIntro?.trim()?.length >= 8 &&
    detailIntro?.trim()?.length >= 10 &&
    services.length > 0 &&
    regions.length > 0;

  const onSubmit = async () => {
    try {
      const profileData = {
        moverImage: selectedImage.dataUrl === uploadSkeleton.src ? "" : selectedImage.dataUrl,
        nickname,
        career: Number(career),
        shortIntro,
        detailIntro,
        currentAreas: regions,
        serviceTypes: services,
      };
      await userApi.postProfile(profileData);
      await getUser();

      router.push(`/${currentLocale}/estimate/received`);
      showSuccessToast(t("registerSuccessMessage"));
    } catch (error: any) {
      handleAuthErrorToast(t, error.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        className="mx-auto flex max-w-[327px] flex-col gap-8 bg-white py-10 lg:min-h-screen lg:max-w-[1100px] lg:justify-between"
        aria-label={t("aria.pageLabelMover")}
      >
        {/* 헤더 */}
        <ProfileFormHeader titleKey="moverTitle" descriptionKey="moverRegisterInfo" />

        {/* 폼 컨테이너 */}
        <form
          className="flex w-full max-w-[327px] flex-col gap-5 lg:max-w-full lg:flex-row lg:justify-between"
          onSubmit={handleSubmit(onSubmit)}
          aria-label={t("aria.formLabelMover")}
        >
          {/* 왼쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]" aria-label={t("aria.formLeftColumn")}>
            <ProfileImageUpload
              uploadSkeleton={uploadSkeleton.src}
              selectedImage={selectedImage}
              onImageChange={setSelectedImage}
            />
            <FormField
              name="nickname"
              label={t("nickname")}
              placeholder={t("nicknamePlaceholder")}
              rules={validationRules.nickname}
              methods={methods}
            />
            <FormField
              name="career"
              label={t("career")}
              placeholder="ex) 8"
              rules={validationRules.career}
              methods={methods}
            />
            <FormField
              name="shortIntro"
              label={t("shortIntro")}
              placeholder={t("shortIntroPlaceholder")}
              rules={validationRules.intro}
              methods={methods}
            />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]" aria-label={t("aria.formRightColumn")}>
            <FormField
              name="detailIntro"
              label={t("detailIntro")}
              placeholder={t("detailIntroPlaceholder")}
              rules={validationRules.description}
              type="textarea"
              methods={methods}
            />
            <ServiceSelection selectedServices={services} onServicesChange={setServices} titleKey="serviceTypes" />
            <RegionSelection
              selectedRegions={regions}
              onRegionsChange={(value) => setRegions(value as string[])}
              titleKey="currentAreas"
              multiple
            />
            <div className="mt-6 w-full lg:mt-12 lg:self-end" aria-label={t("aria.submitButtonSection")}>
              <ProfileFormButton onClick={handleSubmit(onSubmit)} disabled={!allFilled} />
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default MoverRegisterPage;
