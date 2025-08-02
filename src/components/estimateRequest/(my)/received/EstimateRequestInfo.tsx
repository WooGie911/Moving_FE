import { TEstimateRequestResponse } from "@/types/customerEstimateRequest";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { getMovingTypeKey } from "@/lib/utils/getMovingTypeTranslated";

export const EstimateRequestInfo = (props: TEstimateRequestResponse) => {
  const t = useTranslations("estimateRequest");
  const tMoveTypes = useTranslations("moveTypes");
  const locale = useLocale();

  // movingType에 따른 다국어 텍스트 변환 함수
  const getMovingTypeText = (type: string) => {
    const key = getMovingTypeKey(type.toLowerCase());
    return tMoveTypes(key);
  };

  // Date 객체를 다국어 날짜 문자열로 변환하는 함수
  const formatDate = (date?: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;

    // locale에 따른 적절한 로케일 설정
    let localeCode = "ko-KR";
    if (locale === "en") localeCode = "en-US";
    else if (locale === "zh") localeCode = "zh-CN";
    else if (locale === "ko") localeCode = "ko-KR";

    return d.toLocaleDateString(localeCode, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // 주소와 상세주소를 결합하는 함수
  const formatAddress = (addr: string, detail: string | null) => {
    return detail ? `${addr} ${detail}` : addr;
  };

  // fromAddress, toAddress에서 값 추출
  const departureAddr =
    shortenRegionInAddress(props.fromAddress.region) + " " + props.fromAddress.city + " " + props.fromAddress.district;
  const arrivalAddr =
    shortenRegionInAddress(props.toAddress.region) + " " + props.toAddress.city + " " + props.toAddress.district;
  const departureDetail = props.fromAddress.detail;
  const arrivalDetail = props.toAddress.detail;

  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] bg-gray-50 p-6 md:gap-6 md:p-8">
      <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-[16px] leading-[26px] font-semibold text-gray-500 md:text-[18px]">
            {getMovingTypeText(props.moveType)}
          </h3>
          <p className="text-[14px] leading-[22px] font-normal text-gray-400 md:text-[16px]">
            {formatDate(props.createdAt)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-[16px] leading-[26px] font-semibold text-gray-500 md:text-[18px]">{t("movingDate")}</h3>
          <p className="text-[14px] leading-[22px] font-normal text-gray-400 md:text-[16px]">
            {formatDate(props.moveDate)}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-[16px] leading-[26px] font-semibold text-gray-500 md:text-[18px]">{t("departure")}</h3>
          <p className="text-[14px] leading-[22px] font-normal text-gray-400 md:text-[16px]">
            {formatAddress(departureAddr, departureDetail)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-[16px] leading-[26px] font-semibold text-gray-500 md:text-[18px]">{t("arrival")}</h3>
          <p className="text-[14px] leading-[22px] font-normal text-gray-400 md:text-[16px]">
            {formatAddress(arrivalAddr, arrivalDetail)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default EstimateRequestInfo;
