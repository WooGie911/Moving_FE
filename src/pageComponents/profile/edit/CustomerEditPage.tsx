"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { REGION_OPTIONS, SERVICE_OPTIONS, SERVICE_MAPPING, REGION_MAPPING } from "@/constant/profile";
import userApi from "@/lib/api/user.api";
import uploadSkeleton from "@/assets/img/etc/profile-upload-skeleton.png";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/common/modal/ModalContext";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useTranslations } from "use-intl";
import {
  ProfileEditHeader,
  ProfileEditImageUpload,
  ProfileEditServiceSelection,
  ProfileEditRegionSelection,
  ProfileEditFormField,
  ProfileEditActionButtons,
} from "@/components/profile/edit";

export default function CustomerEditPage() {
  const router = useRouter();
  const { open, close } = useModal();
  const validationRules = useValidationRules();

  const t = useTranslations("profile");

  const [isLoading, setIsLoading] = useState(true);
  const [customerImage, setCustomerImage] = useState({
    name: "",
    type: "",
    dataUrl: uploadSkeleton.src,
  });
  const [services, setServices] = useState<string[]>([]);
  const [regions, setRegions] = useState<string>("");

  const methods = useForm({ mode: "onChange" });
  const { watch, reset, handleSubmit, getValues, trigger } = methods;

  const { name = "", nickname = "", email = "", phone = "", currentPassword = "", newPassword = "" } = watch();

  const allFilled =
    name.trim() &&
    nickname.trim() &&
    email.trim() &&
    phone.trim() &&
    currentPassword.trim() &&
    customerImage.dataUrl !== uploadSkeleton.src &&
    services.length > 0 &&
    regions;

  // 프로필 수정
  const onSubmit = async () => {
    const data: {
      name: string;
      nickname: string;
      email: string;
      phoneNumber: string;
      password: string;
      customerImage: string;
      preferredServices: string[];
      currentArea: string;
      newPassword?: string;
    } = {
      name,
      nickname,
      email,
      phoneNumber: phone,
      password: currentPassword,
      customerImage: customerImage.dataUrl,
      preferredServices: services,
      currentArea: regions,
    };

    // 새 비밀번호가 입력되었을 때만 포함
    if (newPassword && newPassword.trim()) {
      data.newPassword = newPassword;
    }
    const res = await userApi.updateCustomerBasicInfo(data);
    if (res.success) {
      open({
        title: "프로필 수정 완료",
        children: <div>프로필 수정이 완료되었습니다.</div>,
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
        title: "프로필 수정 실패",
        children: <div>{res.message}</div>,
        buttons: [{ text: "확인", onClick: () => close() }],
      });
    }
  };

  // 초기값 설정
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();
        const profile = res.data;

        reset({
          name: profile.name ?? "",
          nickname: profile.nickname ?? "",
          email: profile.email ?? "",
          phone: profile.phoneNumber ?? "",
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        });

        setCustomerImage({
          name: "",
          type: "",
          dataUrl: profile.customerImage || uploadSkeleton.src,
        });

        setServices(profile.preferredServices ?? []);
        setRegions(profile.currentArea ?? "");
      } catch (e) {
        console.error("프로필 조회 실패", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>프로필 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex max-w-[327px] flex-col gap-8 bg-white py-8 lg:mt-12 lg:min-h-screen lg:max-w-[1100px] lg:justify-between">
        {/* 헤더 */}
        <ProfileEditHeader titleKey="edit.customerTitle" />

        {/* 폼 컨테이너 */}
        <form
          className="flex w-full max-w-[327px] flex-col gap-5 lg:max-w-full lg:flex-row lg:justify-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* 왼쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]">
            {/* 이름 */}
            <ProfileEditFormField
              type="text"
              name="name"
              labelKey="name"
              placeholderKey="namePlaceholder"
              rules={validationRules.name}
              required
            />

            {/* 별명 */}
            <ProfileEditFormField
              type="text"
              name="nickname"
              labelKey="nickname"
              placeholderKey="nicknamePlaceholder"
              rules={validationRules.nickname}
              required
            />

            {/* 이메일 */}
            <ProfileEditFormField
              type="text"
              name="email"
              labelKey="email"
              placeholderKey="edit.emailPlaceholder"
              rules={validationRules.email}
              inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base text-[#999999] pointer-events-none bg-gray-100"
              wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
            />

            {/* 전화번호 */}
            <ProfileEditFormField
              type="text"
              name="phone"
              labelKey="phone"
              placeholderKey="edit.phonePlaceholder"
              rules={validationRules.phoneNumber}
              required
            />

            {/* 현재 비밀번호 */}
            <ProfileEditFormField
              type="password"
              name="currentPassword"
              labelKey="currentPassword"
              placeholderKey="edit.currentPasswordPlaceholder"
              rules={validationRules.password}
              required
            />

            {/* 새 비밀번호 */}
            <ProfileEditFormField
              type="password"
              name="newPassword"
              labelKey="newPassword"
              placeholderKey="newPasswordPlaceholder"
              rules={{
                validate: (value: string) => {
                  if (value && value.trim()) {
                    return validationRules.password.validate(value);
                  }
                  return true;
                },
                onChange: () => {
                  const confirmValue = getValues("newPasswordConfirm");
                  if (confirmValue) {
                    trigger("newPasswordConfirm");
                  }
                },
              }}
              optional
            />

            {/* 새 비밀번호 확인 */}
            <ProfileEditFormField
              type="password"
              name="newPasswordConfirm"
              labelKey="newPasswordConfirm"
              placeholderKey="newPasswordConfirmPlaceholder"
              rules={{
                validate: (value: string) => {
                  const newPassword = getValues("newPassword");

                  if (!newPassword || !newPassword.trim()) {
                    return true;
                  }

                  if (!value || !value.trim()) {
                    return t("newPasswordConfirmPlaceholder");
                  }

                  if (value !== newPassword) {
                    return t("newPasswordConfirmError");
                  }

                  return true;
                },
              }}
              optional
            />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]">
            {/* 프로필 이미지 */}
            <ProfileEditImageUpload
              selectedImage={customerImage}
              onImageChange={setCustomerImage}
              uploadSkeleton={uploadSkeleton.src}
            />

            {/* 이용 서비스 */}
            <ProfileEditServiceSelection
              selectedServices={services}
              onServicesChange={setServices}
              serviceOptions={SERVICE_OPTIONS}
              serviceMapping={SERVICE_MAPPING}
              titleKey="customerServiceTypes"
              descriptionKey="customerServiceTypesInfo"
            />

            {/* 내가 사는 지역 */}
            <ProfileEditRegionSelection
              selectedRegions={regions}
              onRegionsChange={(value) => setRegions(value as string)}
              regionOptions={REGION_OPTIONS}
              regionMapping={REGION_MAPPING}
              titleKey="currentArea"
              descriptionKey="currentAreaInfo"
              multiple={false}
            />

            {/* 액션 버튼 */}
            <ProfileEditActionButtons
              onCancel={() => window.history.back()}
              onSubmit={methods.handleSubmit(onSubmit)}
              disabled={!allFilled}
            />
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
