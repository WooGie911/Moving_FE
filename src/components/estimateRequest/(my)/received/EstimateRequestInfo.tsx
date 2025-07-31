import { TEstimateRequestResponse } from "@/types/customerEstimateRequest";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { getMovingTypeText, createComplexAddressDisplay, formatDateByLocale } from "@/utils/estimateRequestUtils";

export const EstimateRequestInfo = (props: TEstimateRequestResponse) => {
  const t = useTranslations("estimateRequest");
  const tMoveTypes = useTranslations("moveTypes");
  const locale = useLocale();

  // 주소 생성
  const departureDisplay = createComplexAddressDisplay(
    props.fromAddress.region,
    props.fromAddress.city,
    props.fromAddress.district,
    props.fromAddress.detail,
  );

  const arrivalDisplay = createComplexAddressDisplay(
    props.toAddress.region,
    props.toAddress.city,
    props.toAddress.district,
    props.toAddress.detail,
  );

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 lg:w-[400px]">
      {/* 타이틀 및 견적 요청 날짜 부분 */}
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
          {t("estimateInfo")}
        </h1>
        <p className="hidden text-[14px] leading-[24px] font-normal text-gray-500 md:block">
          {formatDateByLocale(props.createdAt, locale)}
        </p>
      </div>
      {/* 견적 정보 부분 */}
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {/* 이사유형 */}
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-primary-400 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            {t("movingType")}
          </p>
          <p className="text-black-500 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            {getMovingTypeText(props.moveType, tMoveTypes)}
          </p>
        </div>
        {/* 출발지 및 도착지*/}
        <div className="border-border-light flex w-full flex-col items-center justify-center gap-2 border-t-1 border-b-1 pt-2 pb-2">
          <div className="flex w-full flex-row items-start justify-between">
            <p className="text-primary-400 w-[50px] flex-shrink-0 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
              {t("departure")}
            </p>
            <p className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]">
              {departureDisplay}
            </p>
          </div>
          <div className="flex w-full flex-row items-start justify-between">
            <p className="text-primary-400 w-[50px] flex-shrink-0 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
              {t("arrival")}
            </p>
            <p className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]">
              {arrivalDisplay}
            </p>
          </div>
        </div>
        {/* 이사날짜 */}
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-primary-400 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            {t("movingDateLabel")}
          </p>
          <p className="text-black-500 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            {formatDateByLocale(props.moveDate, locale)}
          </p>
        </div>
      </div>
      {/* 모바일용 요청 날짜 */}
      <div className="flex w-full flex-row items-center justify-end">
        <p className="text-[14px] leading-[24px] font-normal text-gray-500 md:hidden">
          {formatDateByLocale(props.createdAt, locale)}
        </p>
      </div>
    </div>
  );
};
export default EstimateRequestInfo;
