"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import uploadSkeleton from "@/assets/img/etc/profile-upload-skeleton.png";

import userApi from "@/lib/api/user.api";
import { useModal } from "@/components/common/modal/ModalContext";
import { useRouter } from "next/navigation";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useTranslations } from "next-intl";
import {
  ProfileFormHeader,
  ProfileImageUpload,
  FormField,
  ServiceSelection,
  RegionSelection,
  ProfileFormButton,
} from "@/components/profile/register";

const MoverRegisterPage = () => {
  const router = useRouter();
  const { open, close } = useModal();
  const validationRules = useValidationRules();
  const t = useTranslations("profile");

  const methods = useForm({
    mode: "onChange", // 실시간 벨리데이션
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

  const allFilled =
    nickname?.trim() &&
    career?.trim() &&
    shortIntro?.trim() &&
    shortIntro?.trim().length >= 8 &&
    detailIntro?.trim() &&
    detailIntro?.trim().length >= 10 &&
    services.length > 0 &&
    regions.length > 0;

  const onSubmit = async () => {
    const profileData = {
      moverImage: selectedImage.dataUrl,
      nickname: nickname,
      career: Number(career),
      shortIntro: shortIntro,
      detailIntro: detailIntro,
      currentAreas: regions,
      serviceTypes: services,
    };

    const response = await userApi.postProfile(profileData);

    if (response.success) {
      open({
        title: "프로필 등록 완료",
        children: <div>프로필 등록이 완료되었습니다.</div>,
        buttons: [
          {
            text: "확인",
            onClick: () => {
              close();
              router.push("/estimate/received");
            },
          },
        ],
      });
    } else {
      open({
        title: "프로필 등록 실패",
        children: <div>{response.message}</div>,
        buttons: [{ text: "확인", onClick: () => close() }],
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex max-w-[327px] flex-col gap-8 bg-white py-10 lg:min-h-screen lg:max-w-[1100px] lg:justify-between">
        {/* 헤더 */}
        <ProfileFormHeader titleKey="moverTitle" descriptionKey="moverRegisterInfo" />

        {/* 폼 컨테이너 */}
        <form
          className="flex w-full max-w-[327px] flex-col gap-5 lg:max-w-full lg:flex-row lg:justify-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* 왼쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]">
            {/* 프로필 이미지 */}
            <ProfileImageUpload selectedImage={selectedImage} onImageChange={setSelectedImage} />

            {/* 별명 */}
            <FormField
              name="nickname"
              label={t("nickname")}
              placeholder={t("nicknamePlaceholder")}
              rules={validationRules.nickname}
              methods={methods}
            />

            {/* 경력 */}
            <FormField
              name="career"
              label={t("career")}
              placeholder="ex) 8"
              rules={validationRules.career}
              methods={methods}
            />

            {/* 한 줄 소개 */}
            <FormField
              name="shortIntro"
              label={t("shortIntro")}
              placeholder={t("shortIntroPlaceholder")}
              rules={validationRules.intro}
              methods={methods}
            />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]">
            {/* 상세 설명 */}
            <FormField
              name="detailIntro"
              label={t("detailIntro")}
              placeholder={t("detailIntroPlaceholder")}
              rules={validationRules.description}
              type="textarea"
              methods={methods}
            />

            {/* 제공 서비스 */}
            <ServiceSelection selectedServices={services} onServicesChange={setServices} titleKey="serviceTypes" />

            {/* 서비스 가능 지역 */}
            <RegionSelection
              selectedRegions={regions}
              onRegionsChange={(value) => setRegions(value as string[])}
              titleKey="currentAreas"
              multiple={true}
            />

            {/* 버튼 */}
            <div className="mt-6 w-full lg:mt-12 lg:self-end">
              <ProfileFormButton onClick={methods.handleSubmit(onSubmit)} disabled={!allFilled} />
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default MoverRegisterPage;
