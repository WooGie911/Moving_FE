'use client';

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import { Button } from "@/components/common/button/Button";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import Image from "next/image";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import moverprofileMd from "@/assets/img/mascot/moverprofile-md.png";

const SERVICE_OPTIONS = ["소형이사", "가정이사", "사무실이사"];
const REGION_OPTIONS = [
  "서울", "경기", "인천", "강원", "충북", "충남", "세종", "대전", "전북", "전남",
  "광주", "경북", "경남", "대구", "울산", "부산", "제주"
];

const defaultValues = {
  nickname: "김코드",
  career: "8년",
  intro: "꼼꼼한 이사를 도와드립니다.",
  desc:
    "안녕하세요. 이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다. 고객님의 물품을 소중하고 안전하게 운송하여 드립니다. 소형이사 및 가정이사 서비스를 제공하며 서비스 가능 지역은 서울과 경기권입니다. 그 외 기타 지역",
};

export default function ProfileEditPage() {
  const methods = useForm({ defaultValues });
  const { watch, handleSubmit } = methods;
  const nickname = watch("nickname");
  const career = watch("career");
  const intro = watch("intro");
  const desc = watch("desc");
  const [services, setServices] = useState<string[]>(["소형이사"]);
  const [regions, setRegions] = useState<string[]>(["서울", "경기", "인천"]);
  const allFilled =
    nickname?.trim() &&
    career?.trim() &&
    intro?.trim() &&
    desc?.trim() && desc.trim().length >= 10 &&
    services.length > 0 &&
    regions.length > 0;
  const onSubmit = (data: any) => {
    // TODO: 실제 저장 API 연동
    console.log({ ...data, services, regions });
  };
  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex justify-center items-center bg-white w-full">
        <form
          className="w-[327px] mx-auto self-stretch inline-flex flex-col justify-start items-start gap-4 px-4 py-6 lg:w-[1200px] lg:px-10 lg:pt-8 lg:pb-10 lg:bg-white lg:rounded-[32px] lg:gap-12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="self-stretch flex flex-col justify-center items-start gap-4 lg:gap-8">
            <div className="justify-center text-neutral-800 text-lg font-bold leading-relaxed lg:text-3xl lg:font-semibold lg:leading-10">
              프로필 수정
            </div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.5px] outline-zinc-100 w-[327px] mx-auto lg:w-full" />
          <div className="w-full flex flex-col gap-8 lg:flex-row lg:justify-between lg:items-start">
            <div className="w-full flex flex-col gap-8 lg:w-[500px]">
              <div className="flex flex-col gap-4">
                <div className="text-zinc-800 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">프로필 이미지</div>
                <div className="w-24 h-24 bg-neutral-100 rounded-md flex justify-center items-center overflow-hidden lg:w-40 lg:h-40">
                  <Image src={moverprofileMd} alt="프로필 이미지" width={160} height={160} className="object-cover" />
                </div>
              </div>
              <div className="h-0 outline outline-1 outline-offset-[-0.5px] outline-zinc-100 w-[327px] mx-auto lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-zinc-800 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">별명</div>
                  <div className="text-red-500 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">*</div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <PasswordInput
                    name="nickname"
                    placeholder="별명을 입력하세요"
                    rules={{ required: "필수 입력" }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
              <div className="h-0 outline outline-1 outline-offset-[-0.5px] outline-zinc-100 w-[327px] mx-auto lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-zinc-800 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">경력</div>
                  <div className="text-red-500 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">*</div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <PasswordInput
                    name="career"
                    placeholder="ex) 8년"
                    rules={{ required: "필수 입력" }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
              <div className="h-0 outline outline-1 outline-offset-[-0.5px] outline-zinc-100 w-[327px] mx-auto lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-zinc-800 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">한 줄 소개</div>
                  <div className="text-red-500 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">*</div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <PasswordInput
                    name="intro"
                    placeholder="한 줄 소개를 입력하세요"
                    rules={{ required: "필수 입력" }}
                    inputClassName="w-[327px] h-[54px] lg:w-[500px] lg:h-[64px]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-8 lg:w-[500px]">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-zinc-800 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">상세 설명</div>
                  <div className="text-red-500 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">*</div>
                </div>
                <div className="w-[327px] lg:w-full">
                  <TextAreaInput
                    name="desc"
                    placeholder="상세 설명을 입력하세요"
                    rules={{ required: "필수 입력", minLength: { value: 10, message: "10자 이상 입력해주세요" } }}
                    textareaClassName="w-[327px] h-[100px] lg:w-[500px] lg:h-[160px] border border-[1px] !border-[#E6E6E6]"
                    wrapperClassName="w-[327px] lg:w-[500px]"
                  />
                </div>
              </div>
              <div className="h-0 outline outline-1 outline-offset-[-0.5px] outline-zinc-100 w-[327px] mx-auto lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-zinc-800 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">제공 서비스</div>
                  <div className="text-red-500 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">*</div>
                </div>
                <div className="inline-flex justify-start items-start gap-1.5 lg:gap-3">
                  {SERVICE_OPTIONS.map((service) => (
                    <CircleTextLabel
                      key={service}
                      text={service}
                      clickAble={true}
                      onClick={() => setServices((prev) => prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service])}
                    />
                  ))}
                </div>
              </div>
              <div className="h-0 outline outline-1 outline-offset-[-0.5px] outline-zinc-100 w-[327px] mx-auto lg:w-full" />
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1">
                  <div className="text-zinc-800 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">서비스 가능 지역</div>
                  <div className="text-red-500 text-base font-semibold leading-relaxed lg:text-xl lg:leading-loose">*</div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-5 gap-2 w-full lg:gap-3.5">
                    {REGION_OPTIONS.map((region) => (
                      <CircleTextLabel
                        key={region}
                        text={region}
                        clickAble={true}
                        onClick={() => setRegions((prev) => prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region])}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row w-full gap-2 lg:gap-5">
                <Button
                  variant="solid"
                  width="w-full"
                  height="h-[54px] lg:h-14"
                  className="p-4 bg-[#F9502E] rounded-2xl text-white text-base font-semibold leading-relaxed justify-center items-center order-1 lg:order-2"
                  onClick={methods.handleSubmit(onSubmit)}
                  disabled={!allFilled}
                  state={allFilled ? "default" : "disabled"}
                >
                  <div className="text-center justify-center">수정하기</div>
                </Button>
                <Button
                  variant="outlined"
                  state="default"
                  width="w-full"
                  height="h-[54px] lg:h-14"
                  className="px-6 py-4 rounded-2xl outline outline-1 outline-offset-[-1px] border border-[1px] !border-[#C4C4C4] !text-[#C4C4C4] !hover:bg-white !focus:bg-white !active:bg-white bg-white shadow-none text-base font-semibold leading-relaxed justify-center items-center order-2 lg:order-1"
                  onClick={() => window.history.back()}
                >
                  <div className="text-center justify-center">취소</div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
