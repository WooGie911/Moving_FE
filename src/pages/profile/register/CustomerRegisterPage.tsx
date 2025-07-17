"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import moverprofileMd from "@/assets/img/mascot/moverprofile-md.png";

import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { REGION_OPTIONS, SERVICE_OPTIONS } from "@/constant/profile";
import { Button } from "@/components/common/button/Button";

interface ICustomerRegisterPageProps {
  profileImage: string;
  services: string[];
  regions: string[];
}

const CustomerRegisterPage = () => {
  const methods = useForm();
  const { watch, handleSubmit } = methods;

  const [services, setServices] = useState<string[]>(["소형이사"]);
  const [regions, setRegions] = useState<string[]>(["서울", "경기", "인천"]);

  const allFilled = services.length > 0 && regions.length > 0;
  const onSubmit = () => {
    // TODO: 실제 저장 API 연동
    console.log({ ...data, services, regions });
  };
  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex max-w-[327px] flex-col gap-8 bg-white py-4 lg:mt-12 lg:max-w-[640px] lg:px-0 lg:pb-4">
        {/* 폼 컨테이너 */}
        <form className="flex max-w-[327px] flex-col gap-4 lg:max-w-[640px]" onSubmit={handleSubmit(onSubmit)}>
          {/* 헤더 */}
          <div className="border-border-light flex flex-col items-start justify-center self-stretch border-b-1 pb-4">
            <span className="text-2lg justify-center leading-relaxed font-bold text-neutral-800 lg:text-3xl">
              프로필 등록
            </span>
            <span className="text-black-200 py-2 text-xs lg:text-xl">
              추가 정보를 입력하여 회원가입을 완료해주세요.
            </span>
          </div>

          <div className="flex w-full flex-col gap-5 lg:w-[640px]">
            {/* 프로필 이미지 */}
            <div className="border-border-light flex flex-col gap-4 border-b-1 pb-4">
              <div className="text-base leading-relaxed font-semibold text-zinc-800">프로필 이미지</div>
              <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-md bg-neutral-100 lg:h-[160px] lg:w-[160px]">
                <Image src={moverprofileMd} alt="프로필 이미지" width={160} height={160} className="object-cover" />
              </div>
            </div>

            {/* 이용 서비스 */}
            <div className="border-border-light flex flex-col gap-6 border-b-1 pb-4">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1">
                  <span className="text-base leading-relaxed font-semibold text-zinc-800">이용 서비스</span>
                  <span className="text-base leading-relaxed font-semibold text-red-500">*</span>
                </div>
                <span className="text-xs text-gray-400 lg:text-lg">
                  * 이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!
                </span>
              </div>
              <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
                {SERVICE_OPTIONS.map((service) => (
                  <CircleTextLabel
                    key={service}
                    text={service}
                    clickAble={true}
                    onClick={() =>
                      setServices((prev) =>
                        prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* 내가 사는 지역 */}

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1">
                  <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
                    내가 사는 지역
                  </div>
                  <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">
                    *
                  </div>
                </div>
                <span className="text-xs text-gray-400 lg:text-lg">*내가 사는 지역은 언제든 수정 가능해요!</span>
              </div>

              <div className="flex w-[300px] flex-col gap-4 lg:w-[450px]">
                <div className="grid w-full grid-cols-5 gap-2 lg:gap-3.5">
                  {REGION_OPTIONS.map((region) => (
                    <CircleTextLabel
                      key={region}
                      text={region}
                      clickAble={true}
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
          </div>
        </form>
        <div className="flex w-[327px] flex-col gap-2 lg:w-full lg:flex-row lg:gap-5">
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
    </FormProvider>
  );
};

export default CustomerRegisterPage;
