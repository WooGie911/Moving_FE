import { TEstimateRequestResponse } from "@/types/customerEstimateRequest";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import React from "react";
import { useTranslations, useLocale } from "next-intl";

export const EstimateRequestInfo = (props: TEstimateRequestResponse) => {
  const t = useTranslations("estimateRequest");
  const tMoveTypes = useTranslations("moveTypes");
  const locale = useLocale();

  // movingType에 따른 다국어 텍스트 변환 함수
  const getMovingTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case "small":
        return tMoveTypes("small");
      case "home":
        return tMoveTypes("home");
      case "office":
        return tMoveTypes("office");
      default:
        return type;
    }
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
    (locale === "ko" ? shortenRegionInAddress(props.fromAddress.region) : props.fromAddress.region) +
    " " +
    props.fromAddress.city +
    " " +
    props.fromAddress.district;
  const arrivalAddr =
    (locale === "ko" ? shortenRegionInAddress(props.toAddress.region) : props.toAddress.region) +
    " " +
    props.toAddress.city +
    " " +
    props.toAddress.district;
  const departureDetail = props.fromAddress.detail;
  const arrivalDetail = props.toAddress.detail;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 lg:w-[400px]">
      {/* 타이틀 및 견적 요청 날짜 부분 */}
      <div className="flex w-full flex-row items-center justify-center md:justify-between">
        <h1 className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
          {t("estimateInfo")}
        </h1>
        <p className="hidden text-[14px] leading-[24px] font-normal text-gray-500 md:block">
          {formatDate(props.createdAt)}
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
            {getMovingTypeText(props.moveType)}
          </p>
        </div>
        {/* 출발지 및 도착지*/}
        <div className="border-border-light flex w-full flex-col items-center justify-center gap-2 border-t-1 border-b-1 pt-2 pb-2">
          <div className="flex w-full flex-row items-start justify-between">
            <p className="text-primary-400 w-[50px] flex-shrink-0 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
              {t("departure")}
            </p>
            <p className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]">
              {formatAddress(departureAddr, departureDetail)}
            </p>
          </div>
          <div className="flex w-full flex-row items-start justify-between">
            <p className="text-primary-400 w-[50px] flex-shrink-0 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
              {t("arrival")}
            </p>
            <p className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]">
              {formatAddress(arrivalAddr, arrivalDetail)}
            </p>
          </div>
        </div>
        {/* 이사날짜 */}
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-primary-400 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            {t("movingDateLabel")}
          </p>
          <p className="text-black-500 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            {formatDate(props.moveDate)}
          </p>
        </div>
      </div>
      {/* 모바일용 요청 날짜 */}
      <div className="flex w-full flex-row items-center justify-end">
        <p className="text-[14px] leading-[24px] font-normal text-gray-500 md:hidden">{formatDate(props.createdAt)}</p>
      </div>
    </div>
  );
};
export default EstimateRequestInfo;
