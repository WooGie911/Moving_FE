"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import uploadSkeleton from "@/assets/img/etc/profile-upload-skeleton.png";

import userApi from "@/lib/api/user.api";
import { useModal } from "@/components/common/modal/ModalContext";
import { useRouter } from "next/navigation";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useTranslations } from "use-intl";
import {
  ProfileFormHeader,
  ProfileImageUpload,
  FormField,
  ServiceSelection,
  RegionSelection,
  ProfileFormButton,
} from "@/components/profile/register";
import { isValidName } from "@/utils/validators";

const CustomerRegisterPage = () => {
  const router = useRouter();
  const validationRules = useValidationRules();
  const t = useTranslations("profile");
  const { open, close } = useModal();

  const methods = useForm({
    mode: "onChange", // 실시간 벨리데이션
    defaultValues: {
      nickname: "",
    },
  });
  const { handleSubmit, watch } = methods;

  const [services, setServices] = useState<string[]>(["SMALL"]);
  const [regions, setRegions] = useState<string>("SEOUL");
  const [selectedImage, setSelectedImage] = useState({
    name: "",
    type: "",
    dataUrl: uploadSkeleton.src,
  });

  const nickname = watch("nickname");

  const isNicknameValid = nickname?.trim().length >= 2 && isValidName(nickname);
  const allFilled = selectedImage && services.length > 0 && regions && isNicknameValid;

  const onSubmit = async (data: { nickname: string }) => {
    const response = await userApi.postProfile({
      customerImage: selectedImage.dataUrl,
      currentArea: regions,
      nickname: data.nickname,
      preferredServices: services,
    });

    if (response.success) {
      open({
        title: "프로필 등록 완료",
        children: <div>프로필 등록이 완료되었습니다.</div>,
        buttons: [
          {
            text: "확인",
            onClick: () => {
              close();
              router.push("/searchMover");
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

  useEffect(() => {
    console.log(allFilled);
  }, [allFilled]);

  return (
    <FormProvider {...methods}>
      <div
        className="mx-auto flex max-w-[327px] flex-col gap-8 bg-white py-10 lg:max-w-[640px] lg:px-0"
        aria-label={t("aria.pageLabel")}
      >
        {/* 폼 컨테이너 */}
        <form
          className="flex max-w-[327px] flex-col gap-4 lg:max-w-[640px]"
          onSubmit={handleSubmit(onSubmit)}
          aria-label={t("aria.formLabel")}
        >
          {/* 헤더 */}
          <ProfileFormHeader titleKey="customerTitle" descriptionKey="customerRegisterInfo" />

          <div className="flex w-full flex-col gap-5 lg:w-[640px]" aria-label={t("aria.formContainerLabel")}>
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

            {/* 이용 서비스 */}
            <ServiceSelection
              selectedServices={services}
              onServicesChange={setServices}
              titleKey="customerServiceTypes"
              descriptionKey="customerServiceTypesInfo"
            />

            {/* 내가 사는 지역 */}
            <RegionSelection
              selectedRegions={regions}
              onRegionsChange={(value) => setRegions(value as string)}
              titleKey="currentArea"
              descriptionKey="currentAreaInfo"
              multiple={false}
            />
          </div>
        </form>

        {/* 제출 버튼 */}
        <ProfileFormButton onClick={methods.handleSubmit(onSubmit)} disabled={!allFilled} />
      </div>
    </FormProvider>
  );
};

export default CustomerRegisterPage;
