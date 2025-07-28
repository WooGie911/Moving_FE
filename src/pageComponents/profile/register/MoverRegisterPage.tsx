"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import uploadSkeleton from "@/assets/img/etc/profile-upload-skeleton.png";

import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { REGION_OPTIONS, SERVICE_OPTIONS, REGION_MAPPING } from "@/constant/profile";
import { Button } from "@/components/common/button/Button";
import { TextInput } from "@/components/common/input/TextInput";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import userApi from "@/lib/api/user.api";
import { useModal } from "@/components/common/modal/ModalContext";
import { useRouter } from "next/navigation";
import { useValidationRules } from "@/hooks/useValidationRules";
import { useLocale, useTranslations } from "next-intl";

const MoverRegisterPage = () => {
  const router = useRouter();
  const { open, close } = useModal();
  const validationRules = useValidationRules();

  const locale = useLocale();

  const t = useTranslations("profile");
  const serviceT = useTranslations("service");
  const regionT = useTranslations("region");

  const methods = useForm({
    mode: "onChange", // 실시간 벨리데이션
  });
  const { watch, handleSubmit, reset } = methods;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nickname = watch("nickname");
  const career = watch("career");
  const shortIntro = watch("shortIntro");
  const detailIntro = watch("detailIntro");
  const [services, setServices] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>(["SEOUL"]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 1. presigned URL 요청 및 s3 업로드
    const fileUrl = await userApi.uploadFilesToS3(file);

    // 2. 미리보기 이미지와 메타데이터 저장
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        name: file.name,
        type: file.type,
        dataUrl: fileUrl,
      });
    };
    reader.readAsDataURL(file);
  };

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

  // 초기값 설정 (기존 기사 프로필이 있는 경우)
  useEffect(() => {
    const fetchMoverProfile = async () => {
      try {
        setIsLoading(true);
        const res = await userApi.getProfile();
        const profile = res.data;

        // 유저에서 설정한 닉네임이 있는 경우
        if (profile.nickname) {
          reset({
            nickname: profile.nickname ?? "",
          });

          setSelectedImage({
            name: "",
            type: "",
            dataUrl: profile.moverImage || uploadSkeleton.src,
          });

          setServices(profile.serviceTypes ?? ["SMALL"]);
          setRegions(profile.currentAreas ?? ["SEOUL"]);
        }
      } catch (e) {
        console.error("기사 프로필 조회 실패", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMoverProfile();
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
            {t("moverTitle")}
          </span>
          <span className="text-black-200 py-2 text-xs lg:text-xl">{t("moverRegisterInfo")}</span>
        </div>

        {/* 폼 컨테이너 */}
        <form
          className="flex w-full max-w-[327px] flex-col gap-5 lg:max-w-full lg:flex-row lg:justify-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* 왼쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]">
            {/* 프로필 이미지 */}
            <div className="border-border-light flex flex-col gap-4 border-b-1 pb-4">
              <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl">{t("profileImg")}</div>
              <div
                className="flex h-[100px] w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-neutral-100 lg:h-[160px] lg:w-[160px]"
                onClick={handleImageClick}
              >
                {selectedImage.name ? (
                  <Image
                    src={selectedImage.dataUrl}
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

            {/* 경력 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("career")}
                </div>
                <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                  *
                </div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <TextInput
                  name="career"
                  placeholder="ex) 8"
                  rules={validationRules.career}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>

            {/* 한 줄 소개 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("shortIntro")}
                </div>
                <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                  *
                </div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 lg:w-full lg:border-b-0">
                <TextInput
                  name="shortIntro"
                  placeholder={t("shortIntroPlaceholder")}
                  rules={validationRules.intro}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex w-full flex-col gap-5 lg:w-[500px]">
            {/* 상세 설명 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("detailIntro")}
                </div>
                <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                  *
                </div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 lg:w-full">
                <TextAreaInput
                  name="detailIntro"
                  placeholder={t("detailIntroPlaceholder")}
                  rules={validationRules.description}
                  textareaClassName="w-[327px] h-[100px] lg:w-[500px] lg:h-[160px] border border-[1px] !border-[#E6E6E6]"
                  wrapperClassName="w-[327px] lg:w-[500px]  h-[100px]"
                />
              </div>
            </div>

            {/* 제공 서비스 */}
            <div className="border-border-light flex flex-col gap-6 border-b-1 pb-6">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-base leading-relaxed font-semibold text-zinc-800">{t("serviceTypes")}</span>
                  <span className="text-base leading-relaxed font-semibold text-red-500">*</span>
                </div>
              </div>
              <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
                {SERVICE_OPTIONS.map((serviceCode) => (
                  <CircleTextLabel
                    key={serviceCode}
                    text={serviceT(serviceCode)}
                    clickAble={true}
                    isSelected={services.includes(serviceCode)}
                    onClick={() => {
                      setServices((prev) =>
                        prev.includes(serviceCode) ? prev.filter((s) => s !== serviceCode) : [...prev, serviceCode],
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 서비스 가능 지역 */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    {t("currentAreas")}
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
              </div>
              <div className={"flex w-[300px] flex-col gap-4 lg:w-[450px]"}>
                <div className={`grid w-full gap-2 lg:gap-3.5 ${locale === "en" ? "grid-cols-3" : "grid-cols-5"}`}>
                  {REGION_OPTIONS.map((regionName) => {
                    const regionValue = REGION_MAPPING[regionName as keyof typeof REGION_MAPPING];
                    return (
                      <CircleTextLabel
                        key={regionName}
                        text={regionT(regionName)}
                        clickAble={true}
                        isSelected={regions.includes(regionValue)}
                        onClick={() => {
                          setRegions((prev) =>
                            prev.includes(regionValue) ? prev.filter((r) => r !== regionValue) : [...prev, regionValue],
                          );
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
                variant="solid"
                width="w-full"
                height="h-[54px] lg:h-[60px]"
                className={`order-1 items-center justify-center rounded-2xl bg-[#F9502E] p-4 text-base leading-relaxed font-semibold text-white lg:order-2`}
                onClick={methods.handleSubmit(onSubmit)}
                disabled={!allFilled}
                state={allFilled ? "default" : "disabled"}
              >
                <div className="justify-center text-center">{t("start")}</div>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default MoverRegisterPage;
