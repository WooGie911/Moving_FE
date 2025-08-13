"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import { Button } from "@/components/common/button/Button";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import Image from "next/image";
import { TextInput } from "@/components/common/input/TextInput";
import defaultProfileImage from "@/assets/img/mascot/moverprofile-lg.webp";
import userApi from "@/lib/api/user.api";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { regionLabelMap } from "@/lib/utils/regionMapping";
import { getServiceTypeTranslation, getRegionTranslation } from "@/lib/utils/translationUtils";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import * as Sentry from "@sentry/nextjs";
import { SERVICE_OPTIONS, REGION_OPTIONS, SERVICE_MAPPING, REGION_MAPPING } from "@/constant/profile";

const defaultValues = {
  nickname: "",
  career: "",
  intro: "",
  desc: "",
};

export default function MoverEditPage() {
  const router = useRouter();
  const { getUser } = useAuth();
  const locale = useLocale();
  const t = useTranslations("profile");
  const moverT = useTranslations("mover");
  const tRegions = useTranslations("regions");

  const [services, setServices] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ file: File | null; dataUrl: string }>({
    file: null,
    dataUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({ defaultValues });
  const { watch, handleSubmit, setValue, reset } = methods;
  const nickname = watch("nickname");
  const career = watch("career");
  const intro = watch("intro");
  const desc = watch("desc");

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    setServices([]);
    setRegions([]);
  }, [locale]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await userApi.getProfile();
        if (res.success && res.data) {
          reset({
            nickname: res.data.nickname || "",
            career: res.data.career?.toString() || "",
            intro: res.data.shortIntro || "",
            desc: res.data.detailIntro || "",
          });

          if (res.data.serviceTypes) {
            const serviceCodes = res.data.serviceTypes
              .map((type: string) => type)
              .filter(Boolean);
            setServices(serviceCodes);
          }

          if (res.data.currentAreas) {
            const areaCodes = res.data.currentAreas
              .map((area: string) => area)
              .filter(Boolean);
            setRegions(areaCodes);
          }

          // 이미지 설정
          if (res.data.moverImage) {
            setSelectedImage({ file: null, dataUrl: res.data.moverImage });
          }
        }
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            page: "mover-profile-edit-page",
            action: "fetch-profile",
          },
          extra: {
            component: "MoverEditPage",
            method: "fetchProfile",
          },
        });
        showErrorToast("프로필 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [reset]);

  const allFilled =
    nickname?.trim() &&
    career?.trim() &&
    intro?.trim() &&
    desc?.trim() &&
    desc.trim().length >= 10 &&
    services.length > 0 &&
    regions.length > 0;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSelectedImage({ file, dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // 이미지 업로드 처리
      let imageUrl = selectedImage.dataUrl;
      if (selectedImage.file) {
        imageUrl = await userApi.uploadFilesToS3(selectedImage.file);
      }

      const serviceTypes = services;
      const currentAreas = regions;

      const req = {
        nickname: data.nickname,
        moverImage: imageUrl,
        currentAreas: currentAreas,
        serviceTypes: serviceTypes,
        shortIntro: data.intro,
        detailIntro: data.desc,
        career: parseInt(data.career),
        isVeteran: false,
      };

      const result = await userApi.updateMoverProfile(req);
      if (result.success) {
        await getUser();
        showSuccessToast(t("edit.successMessage"));
        router.push(`/${locale}/moverMyPage`);
      } else {
        showErrorToast(result.message || t("edit.errorMessage"));
      }
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          page: "mover-profile-edit-page",
          action: "update-profile",
        },
        extra: {
          component: "MoverEditPage",
          method: "onSubmit",
          formData: {
            nickname: data.nickname,
            career: data.career,
            intro: data.intro,
            desc: data.desc,
            services,
            regions,
            hasImage: !!selectedImage.file,
          },
        },
      });
      showErrorToast(t("edit.generalError"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <MovingTruckLoader size="lg" loadingText={t("edit.loadingText")} />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <form
          className="mx-auto inline-flex w-[327px] flex-col items-start justify-start gap-4 self-stretch px-4 py-6 lg:w-[1200px] lg:gap-12 lg:rounded-[32px] lg:bg-white lg:px-10 lg:pt-8 lg:pb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-start justify-center gap-4 self-stretch lg:gap-8">
            <div className="justify-center text-lg leading-relaxed font-bold text-neutral-800 lg:text-3xl lg:leading-10 lg:font-semibold">
              {t("edit.title")}
            </div>
          </div>
          <div className="mx-auto h-0 w-[327px] self-stretch outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex w-full flex-col gap-8 lg:w-[500px]">
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  {t("edit.profileImage")}
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image-input"
                  />
                  <label
                    htmlFor="profile-image-input"
                    className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-neutral-100 transition-all hover:bg-neutral-200 lg:h-40 lg:w-40"
                  >
                    {selectedImage.dataUrl ? (
                      <img src={selectedImage.dataUrl} alt="프로필 이미지" className="h-full w-full object-cover" />
                    ) : (
                      <Image
                        src={defaultProfileImage}
                        alt="프로필 이미지"
                        width={160}
                        height={160}
                        className="object-cover"
                      />
                    )}
                  </label>
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    {t("edit.nickname")}
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    {t("edit.required")}
                  </div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextInput
                    name="nickname"
                    placeholder={t("edit.nicknamePlaceholder")}
                    rules={{ required: t("edit.requiredField") }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    {t("edit.career")}
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    {t("edit.required")}
                  </div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextInput
                    name="career"
                    placeholder={t("edit.careerPlaceholder")}
                    rules={{ required: t("edit.requiredField"), min: { value: 0, message: t("edit.minCareer") } }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    {t("edit.shortIntro")}
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    {t("edit.required")}
                  </div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextInput
                    name="intro"
                    placeholder={t("edit.shortIntroPlaceholder")}
                    rules={{
                      required: t("edit.requiredField"),
                      minLength: { value: 8, message: t("edit.minLength8") },
                    }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                    maxLength={30}
                  />
                  <div className="mt-2 flex justify-end">
                    <div className={`text-sm ${intro.length >= 30 ? "text-red-500" : "text-gray-500"}`}>
                      {intro.length}/30
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-8 lg:w-[500px]">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    {t("edit.detailIntro")}
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    {t("edit.required")}
                  </div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextAreaInput
                    name="desc"
                    placeholder={t("edit.detailIntroPlaceholder")}
                    rules={{
                      required: t("edit.requiredField"),
                      minLength: { value: 10, message: t("edit.minLength10") },
                    }}
                    textareaClassName="w-[327px] h-[100px] lg:w-[500px] lg:h-[160px] border border-[1px] !border-[#E6E6E6]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                    maxLength={300}
                  />
                  <div className="mt-2 flex justify-end">
                    <div className={`text-sm ${desc.length >= 300 ? "text-red-500" : "text-gray-500"}`}>
                      {desc.length}/300
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    {t("edit.providedServices")}
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    {t("edit.required")}
                  </div>
                </div>
                <div className="flex flex-wrap items-start gap-1.5 lg:gap-3">
                  {SERVICE_OPTIONS.map((service) => {
                    const serviceCode = SERVICE_MAPPING[service as keyof typeof SERVICE_MAPPING];
                    
                    return (
                      <CircleTextLabel
                        key={service}
                        text={moverT(`serviceTypes.${service}`)}
                        clickAble={true}
                        isSelected={services.includes(serviceCode)}
                        onClick={() =>
                          setServices((prev) =>
                            prev.includes(serviceCode)
                              ? prev.filter((s) => s !== serviceCode)
                              : [...prev, serviceCode],
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    {t("edit.serviceAreas")}
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    {t("edit.required")}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-start gap-2 lg:gap-3.5">
                    {REGION_OPTIONS.map((region) => {
                      const regionValue = REGION_MAPPING[region as keyof typeof REGION_MAPPING];
                      
                      return (
                        <CircleTextLabel
                          key={region}
                          text={getRegionTranslation(regionValue, tRegions)}
                          clickAble={true}
                          isSelected={regions.includes(regionValue)}
                          onClick={() =>
                            setRegions((prev) =>
                              prev.includes(regionValue) ? prev.filter((r) => r !== regionValue) : [...prev, regionValue],
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 lg:flex-row lg:gap-5">
                <Button
                  variant="solid"
                  width="w-full"
                  height="h-[54px] lg:h-14"
                  className="order-1 items-center justify-center rounded-2xl bg-[#F9502E] p-4 text-base leading-relaxed font-semibold text-white lg:order-2"
                  onClick={methods.handleSubmit(onSubmit)}
                  disabled={!allFilled}
                  state={allFilled ? "default" : "disabled"}
                >
                  <div className="justify-center text-center">{t("edit.save")}</div>
                </Button>
                <Button
                  variant="outlined"
                  state="default"
                  width="w-full"
                  height="h-[54px] lg:h-14"
                  className="!hover:bg-white !focus:bg-white !active:bg-white order-2 items-center justify-center rounded-2xl border border-[1px] !border-[#C4C4C4] bg-white px-6 py-4 text-base leading-relaxed font-semibold !text-[#C4C4C4] shadow-none outline-1 outline-offset-[-1px] lg:order-1"
                  onClick={() => router.push(`/${locale}/moverMyPage`)}
                >
                  <div className="justify-center text-center">{t("edit.cancel")}</div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
