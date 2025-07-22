import React, { useEffect } from "react";
import { LabelArea } from "../LabelArea";
import { IQuoteResponse, TEstimateRequestResponse } from "@/types/moverEstimate";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import Image from "next/image";
import arrow from "@/assets/icon/arrow/icon-arrow.png";
import { TextInput } from "@/components/common/input/TextInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { FormProvider, useForm } from "react-hook-form";

interface IModalProps {
  data: TEstimateRequestResponse;
  isDesignated: boolean;
  estimatePrice?: number;
  type: "received" | "sent" | "rejected";
  onFormChange?: (isValid: boolean) => void;
}

export const ModalChild = ({ data, isDesignated, type, onFormChange }: IModalProps) => {
  const methods = useForm();
  const { watch, setValue } = methods;

  // 폼 값들을 감시
  const estimatePrice = watch("estimatePrice");
  const comment = watch("comment");

  // 폼 유효성 검사
  useEffect(() => {
    const isEstimateValid = type === "rejected" || (estimatePrice && estimatePrice.length > 0);
    const isCommentValid = comment && comment.length >= 10;

    const isValid = isEstimateValid && isCommentValid;

    if (onFormChange) {
      onFormChange(isValid);
    }
  }, [estimatePrice, comment, type, onFormChange]);

  return (
    <div>
      <div className="bg-[#ffffff]py-6 flex w-full max-w-[327px] flex-col items-center justify-center gap-6 rounded-[20px] md:max-w-[600px] lg:max-w-[588px]">
        {/* 라벨과 확정견적/견적서시간/부분 */}
        <div className="flex w-full flex-row items-center justify-between">
          <LabelArea
            movingType={data.moveType.toLowerCase() as "small" | "home" | "office"}
            isDesignated={isDesignated}
          />
        </div>
        {/* 고객 이름 부분  나중에 프로필같은거 추가할수도?*/}
        <div className="border-border-light flex w-full flex-row items-center justify-start border-b-[0.5px] pb-4">
          <p className="text-black-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
            {`${data.customer.name} 고객님`}
          </p>
        </div>
        {/* 이사 정보  부분*/}
        <div className="flex w-full flex-col gap-1 md:flex-row md:justify-between md:pt-2">
          <div className="flex flex-row gap-3">
            <div className="flex flex-col justify-between">
              <p className="text-[14px] leading-6 font-normal text-gray-500">출발지</p>
              <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                {shortenRegionInAddress(data.fromAddress.city + " " + data.fromAddress.district)}
              </p>
            </div>
            <div className="flex flex-col justify-end pb-1">
              <Image src={arrow} alt="arrow" width={16} height={16} />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-[14px] leading-6 font-normal text-gray-500">도착지</p>
              <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                {shortenRegionInAddress(data.toAddress.city + " " + data.toAddress.district)}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-[14px] leading-6 font-normal text-gray-500">이사일</p>
            <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
              {`${data.moveDate.getFullYear()}년 ${data.moveDate.getMonth() + 1}월 ${data.moveDate.getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][data.moveDate.getDay()]})`}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <FormProvider {...methods}>
            {/* 견적가 입력 부분 */}
            <div className={`flex w-full flex-col justify-between ${type === "rejected" ? "hidden" : ""}`}>
              <p className="text-[14px] leading-6 font-normal text-gray-500">견적가를 입력해 주세요.</p>
              <PasswordInput name="estimatePrice" placeholder="견적가를 입력해 주세요." wrapperClassName="w-full" />
              {estimatePrice && !/^[0-9]*$/.test(estimatePrice) && (
                <p className="pb-2 pl-2 text-sm text-red-500">숫자만 입력해 주세요.</p>
              )}
            </div>
            {/* 코멘트 입력 부분 */}
            <div className="flex flex-col justify-between">
              <p className="text-[14px] leading-6 font-normal text-gray-500">코멘트를 입력해 주세요.</p>
              <TextInput name="comment" placeholder="최소 10자 이상 입력해 주세요." wrapperClassName="w-full" />
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
