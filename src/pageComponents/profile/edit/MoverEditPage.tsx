"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import { Button } from "@/components/common/button/Button";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import Image from "next/image";
import { TextInput } from "@/components/common/input/TextInput";
import moverprofileMd from "@/assets/img/mascot/moverprofile-md.png";
import userApi from "@/lib/api/user.api";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { regionLabelMap } from "@/lib/utils/regionMapping";
import { getServiceTypeTranslation, getRegionTranslation } from "@/lib/utils/translationUtils";
import { useModal } from "@/components/common/modal/ModalContext";

const SERVICE_OPTIONS = ["small", "home", "office"];
const REGION_OPTIONS = [
  "서울",
  "경기",
  "인천",
  "강원",
  "충북",
  "충남",
  "세종",
  "대전",
  "전북",
  "전남",
  "광주",
  "경북",
  "경남",
  "대구",
  "울산",
  "부산",
  "제주",
];

// 서비스 타입 매핑
const serviceTypeMapping: { [key: string]: string } = {
  small: "SMALL",
  home: "HOME",
  office: "OFFICE",
};

// 지역 매핑
const regionTypeMapping: { [key: string]: string } = {
  서울: "SEOUL",
  경기: "GYEONGGI",
  인천: "INCHEON",
  강원: "GANGWON",
  충북: "CHUNGBUK",
  충남: "CHUNGNAM",
  세종: "SEJONG",
  대전: "DAEJEON",
  전북: "JEONBUK",
  전남: "JEONNAM",
  광주: "GWANGJU",
  경북: "GYEONGBUK",
  경남: "GYEONGNAM",
  대구: "DAEGU",
  울산: "ULSAN",
  부산: "BUSAN",
  제주: "JEJU",
};

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
  const { open, close } = useModal();
  const [services, setServices] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ file: File | null; dataUrl: string }>({
    file: null,
    dataUrl: "",
  });

  const methods = useForm({ defaultValues });
  const { watch, handleSubmit, setValue, reset } = methods;
  const nickname = watch("nickname");
  const career = watch("career");
  const intro = watch("intro");
  const desc = watch("desc");

  // 프로필 정보 불러와서 폼 초기값 세팅
  useEffect(() => {
    async function fetchProfile() {
      const res = await userApi.getProfile();
      if (res.success && res.data) {
        reset({
          nickname: res.data.nickname || "",
          career: res.data.career?.toString() || "",
          intro: res.data.shortIntro || "",
          desc: res.data.detailIntro || "",
        });

        // 서비스 타입 설정
        if (res.data.serviceTypes) {
          const serviceNames = res.data.serviceTypes
            .map((type: string) => {
              // MoveType enum을 한글 이름으로 변환
              const serviceNameMap: { [key: string]: string } = {
                SMALL: "소형이사",
                HOME: "가정이사",
                OFFICE: "사무실이사",
              };
              return serviceNameMap[type] || "";
            })
            .filter(Boolean);
          setServices(serviceNames);
        }

        // 지역 설정
        if (res.data.currentAreas) {
          const regionNames = res.data.currentAreas
            .map((area: string) => {
              return regionLabelMap[area] || "";
            })
            .filter(Boolean);
          setRegions(regionNames);
        }

        // 이미지 설정
        if (res.data.moverImage) {
          setSelectedImage({ file: null, dataUrl: res.data.moverImage });
        }
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

      // 서비스 타입을 API 형식으로 변환
      const serviceTypes = services.map((service) => serviceTypeMapping[service]).filter(Boolean);

      // 지역을 API 형식으로 변환 (여러 지역 지원)
      const currentAreas = regions.map((region) => regionTypeMapping[region]).filter(Boolean);

      const req = {
        nickname: data.nickname,
        moverImage: imageUrl,
        currentAreas: currentAreas,
        serviceTypes: serviceTypes,
        shortIntro: data.intro,
        detailIntro: data.desc,
        career: parseInt(data.career),
        isVeteran: false, // 기본값
      };

      const result = await userApi.updateMoverProfile(req);
      if (result.success) {
        await getUser();
        open({
          title: t("edit.successTitle"),
          children: <div>{t("edit.successMessage")}</div>,
          buttons: [
            {
              text: t("edit.confirm"),
              onClick: () => {
                close();
                router.push(`/${locale}/moverMyPage`);
              },
            },
          ],
        });
      } else {
        open({
          title: t("edit.errorTitle"),
          children: <div>{result.message || t("edit.errorMessage")}</div>,
          buttons: [{ text: t("edit.confirm"), onClick: () => close() }],
        });
      }
    } catch (e) {
      open({
        title: t("edit.errorTitle"),
        children: <div>{t("edit.generalError")}</div>,
        buttons: [{ text: t("edit.confirm"), onClick: () => close() }],
      });
    }
  };

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
          <div className="mx-auto h-0 w-[327px] self-stretch outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
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
                        src={moverprofileMd}
                        alt="프로필 이미지"
                        width={160}
                        height={160}
                        className="object-cover"
                      />
                    )}
                  </label>
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
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
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
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
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
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
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
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
                  {SERVICE_OPTIONS.map((service) => (
                    <CircleTextLabel
                      key={service}
                      text={moverT(`serviceTypes.${service}`)}
                      clickAble={true}
                      isSelected={services.includes(serviceTypeMapping[service])}
                      onClick={() =>
                        setServices((prev) =>
                          prev.includes(serviceTypeMapping[service])
                            ? prev.filter((s) => s !== serviceTypeMapping[service])
                            : [...prev, serviceTypeMapping[service]],
                        )
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
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
                    {REGION_OPTIONS.map((region) => (
                      <CircleTextLabel
                        key={region}
                        text={getRegionTranslation(regionTypeMapping[region], tRegions)}
                        clickAble={true}
                        isSelected={regions.includes(region)}
                        onClick={() =>
                          setRegions((prev) =>
                            prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region],
                          )
                        }
                      />
                    ))}
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
                  className="!hover:bg-white !focus:bg-white !active:bg-white order-2 items-center justify-center rounded-2xl border border-[1px] !border-[#C4C4C4] bg-white px-6 py-4 text-base leading-relaxed font-semibold !text-[#C4C4C4] shadow-none outline outline-1 outline-offset-[-1px] lg:order-1"
                  onClick={() => window.history.back()}
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
