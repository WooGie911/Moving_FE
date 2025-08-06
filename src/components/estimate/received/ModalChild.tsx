import React, { useEffect } from "react";
import { LabelArea } from "../LabelArea";
import { TEstimateRequestResponse } from "@/types/moverEstimate";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import Image from "next/image";
import arrow from "@/assets/icon/arrow/icon-arrow.png";
import { TextInput } from "@/components/common/input/TextInput";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";

interface IModalProps {
  data: TEstimateRequestResponse;
  isDesignated: boolean;
  estimatePrice?: number;
  usedAt: "received" | "sent" | "rejected";
  onFormChange?: (isValid: boolean, formData?: { price?: number; comment?: string }) => void;
}

export const ModalChild = ({ data, isDesignated, usedAt, onFormChange }: IModalProps) => {
  const methods = useForm();
  const { watch, setValue } = methods;
  const t = useTranslations("estimate");
  const tShared = useTranslations();
  const locale = useLocale();

  // 폼 값들을 감시
  const estimatePrice = watch("estimatePrice");
  const comment = watch("comment");

  // 코멘트 유효성 검사 함수
  const isCommentValid = (comment: string) => {
    if (!comment) return false;
    // 공백 제거 후 길이 확인
    const trimmedComment = comment.trim();
    return trimmedComment.length >= 10 && trimmedComment.length <= 30;
  };

  // 숫자를 3자리마다 쉼표로 포맷팅하는 함수
  const formatNumberWithCommas = (value: string) => {
    if (!value) return "";
    // 숫자가 아닌 문자 제거
    const numericOnly = value.replace(/[^0-9]/g, "");
    // 3자리마다 쉼표 추가
    return numericOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 견적가 입력값 정리 - 숫자가 아닌 문자 제거하고 포맷팅
  useEffect(() => {
    if (estimatePrice) {
      const numericOnly = estimatePrice.replace(/[^0-9]/g, "");
      const formatted = formatNumberWithCommas(numericOnly);
      if (formatted !== estimatePrice) {
        setValue("estimatePrice", formatted);
      }
    }
  }, [estimatePrice, setValue]);

  // 폼 유효성 검사
  useEffect(() => {
    const numericPrice = estimatePrice ? estimatePrice.replace(/[^0-9]/g, "") : "";
    const isEstimateValid = usedAt === "rejected" || (numericPrice && numericPrice.length > 0);
    const isCommentValidResult = isCommentValid(comment);

    const isValid = isEstimateValid && isCommentValidResult;

    if (onFormChange) {
      onFormChange(isValid, {
        price: numericPrice ? parseInt(numericPrice) : undefined,
        comment: comment,
      });
    }
  }, [estimatePrice, comment, usedAt, onFormChange]);

  return (
    <div>
      <div className="flex w-full flex-col gap-6">
        {/* 라벨과 확정견적/견적서시간/부분 */}
        <div className="flex w-full flex-row items-center justify-between">
          <LabelArea
            movingType={data.moveType.toLowerCase() as "small" | "home" | "office"}
            isDesignated={isDesignated}
            usedAt={usedAt}
          />
        </div>
        {/* 고객 이름 부분  나중에 프로필같은거 추가할수도?*/}
        <div className="border-border-light flex w-full flex-row items-center justify-start border-b-[0.5px] pb-4">
          <p className="text-black-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
            {`${data.customer.name}${t("customerSuffix")}`}
          </p>
        </div>
        {/* 이사 정보  부분*/}
        <div className="flex w-full flex-col gap-1 md:flex-row md:justify-between md:pt-2">
          <div className="flex flex-row gap-3">
            <div className="flex flex-col justify-between">
              <p className="text-[14px] leading-6 font-normal text-gray-500">{t("departure")}</p>
              <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                {shortenRegionInAddress(data.fromAddress.city + " " + data.fromAddress.district)}
              </p>
            </div>
            <div className="flex flex-col justify-end pb-1">
              <Image src={arrow} alt="arrow" width={16} height={16} />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-[14px] leading-6 font-normal text-gray-500">{t("arrival")}</p>
              <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                {shortenRegionInAddress(data.toAddress.city + " " + data.toAddress.district)}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-[14px] leading-6 font-normal text-gray-500">{t("movingDate")}</p>
            <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
              {(() => {
                const moveDate = new Date(data.moveDate);
                const year = moveDate.getFullYear();
                const month = moveDate.getMonth() + 1;
                const day = moveDate.getDate();
                const weekday = [
                  tShared("shared.time.weekdays.sunday"),
                  tShared("shared.time.weekdays.monday"),
                  tShared("shared.time.weekdays.tuesday"),
                  tShared("shared.time.weekdays.wednesday"),
                  tShared("shared.time.weekdays.thursday"),
                  tShared("shared.time.weekdays.friday"),
                  tShared("shared.time.weekdays.saturday"),
                ][moveDate.getDay()];

                // 언어별 날짜 형식
                const yearSuffix = tShared("shared.time.dateFormat.year");
                const monthSuffix = tShared("shared.time.dateFormat.month");
                const daySuffix = tShared("shared.time.dateFormat.day");

                // 영어인 경우 MM/DD/YYYY 형식
                if (monthSuffix === "/" && yearSuffix === "" && daySuffix === "") {
                  return `${month}/${day}/${year} (${weekday})`;
                }
                // 한국어, 중국어인 경우 YYYY년 MM월 DD일 형식
                else {
                  return `${year}${yearSuffix} ${month}${monthSuffix} ${day}${daySuffix} (${weekday})`;
                }
              })()}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <FormProvider {...methods}>
            {/* 견적가 입력 부분 */}
            <div className={`flex w-full flex-col justify-between ${usedAt === "rejected" ? "hidden" : ""}`}>
              <p className="text-black-300 pb-4 text-[18px] leading-[26px] font-semibold">{t("enterEstimatePrice")}</p>
              <PasswordInput
                name="estimatePrice"
                placeholder={t("estimatePricePlaceholder")}
                wrapperClassName="w-full"
                showInit={true}
              />
              {estimatePrice && !/^[0-9,]*$/.test(estimatePrice) && (
                <p className="pb-2 pl-2 text-sm text-red-500">{t("onlyNumbersMessage")}</p>
              )}
            </div>
            {/* 코멘트 입력 부분 */}
            <div className="flex flex-col justify-between">
              <p className="text-black-300 pb-4 text-[18px] leading-[26px] font-semibold">
                {usedAt === "rejected" ? t("enterRejectionReason") : t("enterComment")}
              </p>
              <TextAreaInput
                textareaClassName="h-40 border w-full border-gray-200 rounded-[16px]"
                name="comment"
                placeholder={t("commentPlaceholder")}
                wrapperClassName="w-full"
              />
              {comment && !isCommentValid(comment) && (
                <p className="pb-2 pl-2 text-sm text-red-500">
                  {comment.trim().length > 30 ? t("commentMaxLengthMessage") : t("commentMinLengthMessage")}
                </p>
              )}
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
