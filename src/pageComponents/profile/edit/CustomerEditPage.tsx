"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/common/button/Button";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import Image from "next/image";
import { TextInput } from "@/components/common/input/TextInput";
import { REGION_OPTIONS, SERVICE_OPTIONS, SERVICE_MAPPING, REGION_MAPPING } from "@/constant/profile";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import userApi from "@/lib/api/user.api";
import uploadSkeleton from "@/assets/img/etc/profile-upload-skeleton.png";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/common/modal/ModalContext";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

export default function CustomerEditPage() {
  const router = useRouter();
  const { open, close } = useModal();
  const validationRules = useValidationRules();

  const locale = useLocale();

  const t = useTranslations("profile");
  const regionT = useTranslations("region");
  const serviceT = useTranslations("service");

  const [isLoading, setIsLoading] = useState(true);
  const [customerImage, setCustomerImage] = useState({
    name: "",
    type: "",
    dataUrl: uploadSkeleton.src,
  });
  const [services, setServices] = useState<string[]>([]);
  const [regions, setRegions] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // 프로필 이미지 클릭
  const handleImageClick = () => fileInputRef.current?.click();

  // 프로필 이미지 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = await userApi.uploadFilesToS3(file);
    setCustomerImage({ name: file.name, type: file.type, dataUrl: fileUrl });
  };

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
        <div className="border-border-light flex max-w-[327px] flex-col border-b-1 pb-4 lg:max-w-[1100px]">
          <span className="text-2lg justify-center leading-relaxed font-bold text-neutral-800 lg:text-3xl">
            {t("customerTitle")}
          </span>
        </div>

        {/* 폼 컨테이너 */}
        <form
          className="flex w-full max-w-[327px] flex-col gap-5 lg:max-w-full lg:flex-row lg:justify-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* 왼쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]">
            {/* 이름*/}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("name")}
                </div>
                <div className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <TextInput
                  name="name"
                  placeholder={t("namePlaceholder")}
                  rules={validationRules.name}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>
            {/* 별명 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("nickname")}
                </div>
                <div className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <TextInput
                  name="nickname"
                  placeholder={t("nicknamePlaceholder")}
                  rules={validationRules.nickname}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>
            {/* 이메일 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("email")}
                </div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <TextInput
                  name="email"
                  placeholder={t("emailPlaceholder")}
                  rules={validationRules.email}
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base text-[#999999] pointer-events-none bg-gray-100"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("phone")}
                </div>
                <div className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <TextInput
                  name="phone"
                  placeholder={t("phonePlaceholder")}
                  rules={validationRules.phoneNumber}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>
            {/* 현재 비밀번호 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("currentPassword")}
                </div>
                <div className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <PasswordInput
                  name="currentPassword"
                  placeholder={t("currentPasswordPlaceholder")}
                  rules={validationRules.password}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>
            {/* 새 비밀번호 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("newPassword")}
                </div>
                <div className="text-sm text-gray-500">{t("optional")}</div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <PasswordInput
                  name="newPassword"
                  placeholder={t("newPasswordPlaceholder")}
                  rules={{
                    validate: (value: string) => {
                      // 비밀번호를 입력했다면 유효성 검사 실행
                      if (value && value.trim()) {
                        return validationRules.password.validate(value);
                      }
                      return true; // 비어있으면 통과
                    },
                    onChange: () => {
                      // 새 비밀번호가 변경될 때마다 확인 필드 재검증
                      const confirmValue = getValues("newPasswordConfirm");
                      if (confirmValue) {
                        trigger("newPasswordConfirm");
                      }
                    },
                  }}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>
            {/* 새 비밀번호 확인 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("newPasswordConfirm")}
                </div>
                <div className="text-sm text-gray-500">{t("optional")}</div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <PasswordInput
                  name="newPasswordConfirm"
                  placeholder={t("newPasswordConfirmPlaceholder")}
                  rules={{
                    validate: (value: string) => {
                      const newPassword = getValues("newPassword");

                      // 새 비밀번호가 없으면 확인도 필요 없음
                      if (!newPassword || !newPassword.trim()) {
                        return true;
                      }

                      // 새 비밀번호가 있으면 확인 필드 필수
                      if (!value || !value.trim()) {
                        return t("newPasswordConfirmPlaceholder");
                      }

                      // 일치 여부 확인
                      if (value !== newPassword) {
                        return t("newPasswordConfirmError");
                      }

                      return true;
                    },
                  }}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]">
            {/* 프로필 이미지 */}
            <div className="border-border-light flex flex-col gap-4 border-b-1 pb-4">
              <div className="text-base leading-relaxed font-semibold text-zinc-800">{t("profileImg")}</div>
              <div
                className="flex h-[100px] w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-neutral-100 lg:h-[160px] lg:w-[160px]"
                onClick={handleImageClick}
              >
                {customerImage.dataUrl !== uploadSkeleton.src ? (
                  <Image
                    src={customerImage.dataUrl}
                    alt="선택된 프로필 이미지"
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={uploadSkeleton}
                    alt="기본 프로필 이미지"
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            {/* 이용 서비스 */}
            <div className="border-border-light flex flex-col gap-6 border-b-1 pb-6">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-base leading-relaxed font-semibold text-zinc-800">
                    {t("customerServiceTypes")}
                  </span>
                  <span className="text-base leading-relaxed font-semibold text-red-500">*</span>
                </div>
                <span className="text-xs text-gray-400 lg:text-lg">* {t("customerServiceTypesInfo")}</span>
              </div>
              <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
                {SERVICE_OPTIONS.map((service) => {
                  const serviceCode = SERVICE_MAPPING[service as keyof typeof SERVICE_MAPPING];
                  return (
                    <CircleTextLabel
                      key={service}
                      text={serviceT(service)}
                      clickAble={true}
                      isSelected={services.includes(serviceCode)}
                      onClick={() => {
                        setServices((prev) =>
                          prev.includes(serviceCode) ? prev.filter((s) => s !== serviceCode) : [...prev, serviceCode],
                        );
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 내가 사는 지역 */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    {t("currentArea")}
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <span className="text-xs text-gray-400 lg:text-lg">* {t("currentAreaInfo")}</span>
              </div>

              <div className="flex w-[300px] flex-col gap-4 lg:w-[450px]">
                <div className={`grid w-full gap-2 lg:gap-3.5 ${locale === "en" ? "grid-cols-3" : "grid-cols-5"}`}>
                  {REGION_OPTIONS.map((region) => {
                    const regionValue = REGION_MAPPING[region as keyof typeof REGION_MAPPING];
                    return (
                      <CircleTextLabel
                        key={region}
                        text={regionT(region)}
                        clickAble={true}
                        isSelected={regions === regionValue}
                        onClick={() => {
                          setRegions(regions === regionValue ? "" : regionValue);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="mt-6 flex w-[327px] flex-col gap-2 lg:mt-12 lg:w-full lg:flex-row lg:gap-5 lg:self-end">
              <Button
                variant="outlined"
                state="default"
                width="w-full"
                height="h-[54px] lg:h-[60px]"
                className="order-2 items-center justify-center rounded-2xl border !border-[#C4C4C4] bg-white px-6 py-4 text-base leading-relaxed font-semibold !text-[#C4C4C4] shadow-none outline outline-1 outline-offset-[-1px] lg:order-1"
                onClick={() => window.history.back()}
              >
                <div className="justify-center text-center">{t("cancel")}</div>
              </Button>
              <Button
                variant="solid"
                width="w-full"
                height="h-[54px] lg:h-[60px]"
                className="order-1 items-center justify-center rounded-2xl bg-[#F9502E] p-4 text-base leading-relaxed font-semibold text-white lg:order-2"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={!allFilled}
                state={allFilled ? "default" : "disabled"}
              >
                <div className="justify-center text-center">{t("edit")}</div>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
