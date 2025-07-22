"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import uploadSkeleton from "@/assets/img/etc/profile-upload-skeleton.png";

import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { REGION_OPTIONS, SERVICE_OPTIONS, SERVICE_MAPPING, REGION_MAPPING } from "@/constant/profile";
import { Button } from "@/components/common/button/Button";
import { TextInput } from "@/components/common/input/TextInput";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import userApi from "@/lib/api/user.api";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/common/modal/ModalContext";
import { validationRules } from "@/utils/validators";

const MoverRegisterPage = () => {
  const router = useRouter();
  const { open, close } = useModal();

  const methods = useForm({
    mode: "onChange", // 실시간 벨리데이션
  });
  const { watch, handleSubmit } = methods;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nickname = watch("nickname");
  const career = watch("career");
  const shortIntro = watch("shortIntro");
  const detailIntro = watch("detailIntro");
  const [services, setServices] = useState<string[]>(["SMALL"]);
  const [region, setRegion] = useState<string>("SEOUL");
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
    region;

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
      currentArea: region,
      serviceTypes: services,
    };

    const response = await userApi.postProfile(profileData);

    if (response.success) {
      router.push("/estimate/received");
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
      <div className="mx-auto flex max-w-[327px] flex-col gap-8 bg-white py-8 lg:mt-12 lg:min-h-screen lg:max-w-[1100px] lg:justify-between">
        {/* 헤더 */}
        <div className="border-border-light flex max-w-[327px] flex-col border-b-1 pb-4 lg:max-w-[1100px]">
          <span className="text-2lg justify-center leading-relaxed font-bold text-neutral-800 lg:text-3xl">
            기사님 프로필 등록
          </span>
          <span className="text-black-200 py-2 text-xs lg:text-xl">추가 정보를 입력하여 회원가입을 완료해주세요.</span>
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
              <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl">프로필 이미지</div>
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
                  별명
                </div>
                <div className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
                <TextInput
                  name="nickname"
                  placeholder="사이트에 노출될 별명을 입력해 주세요"
                  rules={validationRules.nickname}
                  wrapperClassName="w-[327px] lg:w-[500px] h-[54px]"
                />
              </div>
            </div>

            {/* 경력 */}
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-1">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  경력
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
                  한 줄 소개
                </div>
                <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                  *
                </div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 lg:w-full lg:border-b-0">
                <TextInput
                  name="shortIntro"
                  placeholder="한 줄 소개를 입력하세요"
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
                  상세 설명
                </div>
                <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                  *
                </div>
              </div>
              <div className="border-border-light w-[327px] border-b-1 lg:w-full">
                <TextAreaInput
                  name="detailIntro"
                  placeholder="상세 설명을 입력하세요"
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
                  <span className="text-base leading-relaxed font-semibold text-zinc-800">제공 서비스</span>
                  <span className="text-base leading-relaxed font-semibold text-red-500">*</span>
                </div>
              </div>
              <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
                {SERVICE_OPTIONS.map((service) => {
                  const serviceCode = SERVICE_MAPPING[service as keyof typeof SERVICE_MAPPING];
                  return (
                    <CircleTextLabel
                      key={service}
                      text={service}
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

            {/* 현재 활동 지역 */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    현재 활동 지역
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <span className="text-xs text-gray-400 lg:text-lg">* 현재 활동하고 있는 주요 지역을 선택해주세요</span>
              </div>
              <div className="flex w-[300px] flex-col gap-4 lg:w-[450px]">
                <div className="grid w-full grid-cols-5 gap-2 lg:gap-3.5">
                  {REGION_OPTIONS.map((regionName) => {
                    const regionValue = REGION_MAPPING[regionName as keyof typeof REGION_MAPPING];
                    return (
                      <CircleTextLabel
                        key={regionName}
                        text={regionName}
                        clickAble={true}
                        isSelected={region === regionValue}
                        onClick={() => {
                          setRegion(regionValue);
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
                className="order-1 items-center justify-center rounded-2xl bg-[#F9502E] p-4 text-base leading-relaxed font-semibold text-white lg:order-2"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={!allFilled}
                state={allFilled ? "default" : "disabled"}
              >
                <div className="justify-center text-center">시작하기</div>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default MoverRegisterPage;
