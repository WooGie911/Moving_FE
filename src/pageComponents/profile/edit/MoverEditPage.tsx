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
import { regionLabelMap } from "@/lib/utils/regionMapping";
import { SERVICE_TYPE_LIST } from "@/lib/utils/moverStaticData";

const SERVICE_OPTIONS = ["소형이사", "가정이사", "사무실이사"];
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
  "소형이사": "1",
  "가정이사": "2",
  "사무실이사": "3",
};

// 지역 매핑
const regionTypeMapping: { [key: string]: string } = {
  "서울": "SEOUL",
  "경기": "GYEONGGI",
  "인천": "INCHEON",
  "강원": "GANGWON",
  "충북": "CHUNGBUK",
  "충남": "CHUNGNAM",
  "세종": "SEJONG",
  "대전": "DAEJEON",
  "전북": "JEONBUK",
  "전남": "JEONNAM",
  "광주": "GWANGJU",
  "경북": "GYEONGBUK",
  "경남": "GYEONGNAM",
  "대구": "DAEGU",
  "울산": "ULSAN",
  "부산": "BUSAN",
  "제주": "JEJU",
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
  const [services, setServices] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ file: File | null; dataUrl: string }>({
    file: null,
    dataUrl: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

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
          const serviceNames = res.data.serviceTypes.map((type: string) => {
            const service = SERVICE_TYPE_LIST.find(s => s.id === parseInt(type));
            return service ? service.name : "";
          }).filter(Boolean);
          setServices(serviceNames);
        }

        // 지역 설정
        if (res.data.currentAreas) {
          const regionNames = res.data.currentAreas.map((area: string) => {
            return regionLabelMap[area] || "";
          }).filter(Boolean);
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
      setFormError(null);
      
      // 이미지 업로드 처리
      let imageUrl = selectedImage.dataUrl;
      if (selectedImage.file) {
        imageUrl = await userApi.uploadFilesToS3(selectedImage.file);
      }

      // 서비스 타입을 API 형식으로 변환
      const serviceTypes = services.map(service => serviceTypeMapping[service]).filter(Boolean);
      
      // 지역을 API 형식으로 변환
      const currentArea = regions.map(region => regionTypeMapping[region]).filter(Boolean)[0];

      const req = {
        nickname: data.nickname,
        moverImage: imageUrl,
        currentArea: currentArea,
        serviceTypes: serviceTypes,
        shortIntro: data.intro,
        detailIntro: data.desc,
        career: parseInt(data.career),
        isVeteran: false, // 기본값
      };

      const result = await userApi.updateMoverProfile(req);
      if (result.success) {
        await getUser();
        alert("프로필이 성공적으로 수정되었습니다.");
        router.push("/moverMyPage");
      } else {
        setFormError(result.message || "수정에 실패했습니다.");
      }
    } catch (e) {
      setFormError("오류가 발생했습니다.");
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
              프로필 수정
            </div>
          </div>
          <div className="mx-auto h-0 w-[327px] self-stretch outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex w-full flex-col gap-8 lg:w-[500px]">
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                  프로필 이미지
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md bg-neutral-100 lg:h-40 lg:w-40">
                    {selectedImage.dataUrl ? (
                      <img src={selectedImage.dataUrl} alt="프로필 이미지" className="h-full w-full object-cover" />
                    ) : (
                      <Image src={moverprofileMd} alt="프로필 이미지" width={160} height={160} className="object-cover" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    별명
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextInput
                    name="nickname"
                    placeholder="별명을 입력하세요"
                    rules={{ required: "필수 입력" }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    경력
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextInput
                    name="career"
                    placeholder="ex) 8"
                    rules={{ required: "필수 입력", min: { value: 0, message: "경력은 0년 이상이어야 합니다" } }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    한 줄 소개
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextInput
                    name="intro"
                    placeholder="한 줄 소개를 입력하세요 (최소 8자)"
                    rules={{ required: "필수 입력", minLength: { value: 8, message: "8자 이상 입력해주세요" } }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-8 lg:w-[500px]">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    상세 설명
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextAreaInput
                    name="desc"
                    placeholder="상세 설명을 입력하세요 (최소 10자)"
                    rules={{ required: "필수 입력", minLength: { value: 10, message: "10자 이상 입력해주세요" } }}
                    textareaClassName="w-[327px] h-[100px] lg:w-[500px] lg:h-[160px] border border-[1px] !border-[#E6E6E6]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
              <div className="mx-auto h-0 w-[327px] outline outline-1 outline-offset-[-0.5px] outline-zinc-100 lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    제공 서비스
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
                  {SERVICE_OPTIONS.map((service) => (
                    <CircleTextLabel
                      key={service}
                      text={service}
                      clickAble={true}
                      isSelected={services.includes(service)}
                      onClick={() =>
                        setServices((prev) =>
                          prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
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
                    서비스 가능 지역
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid w-full grid-cols-5 gap-2 lg:gap-3.5">
                    {REGION_OPTIONS.map((region) => (
                      <CircleTextLabel
                        key={region}
                        text={region}
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
              {formError && <div className="text-sm text-red-500">{formError}</div>}
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
                  <div className="justify-center text-center">수정하기</div>
                </Button>
                <Button
                  variant="outlined"
                  state="default"
                  width="w-full"
                  height="h-[54px] lg:h-14"
                  className="!hover:bg-white !focus:bg-white !active:bg-white order-2 items-center justify-center rounded-2xl border border-[1px] !border-[#C4C4C4] bg-white px-6 py-4 text-base leading-relaxed font-semibold !text-[#C4C4C4] shadow-none outline outline-1 outline-offset-[-1px] lg:order-1"
                  onClick={() => window.history.back()}
                >
                  <div className="justify-center text-center">취소</div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
