import { TEstimateRequestResponse } from "@/types/customerEstimateRequest";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import React from "react";
import { useTranslations, useLocale } from "next-intl";

export const EstimateRequestInfo = (props: TEstimateRequestResponse) => {
  const t = useTranslations("customerEstimateRequest");
  const locale = useLocale();

  // movingType에 따른 다국어 텍스트 변환 함수
  const getMovingTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case "small":
        return t("movingTypes.small");
      case "home":
        return t("movingTypes.home");
      case "office":
        return t("movingTypes.office");
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

    // UTC 기준으로 날짜를 처리하여 시간대 변환 문제를 방지
    return d.toLocaleDateString(localeCode, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      timeZone: "UTC",
    });
  };

  // 간단한 날짜 형식 함수 (24.07.04)
  const formatSimpleDate = (date?: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;

    // UTC 기준으로 날짜를 가져와서 시간대 변환 문제를 방지
    const year = d.getUTCFullYear().toString().slice(-2); // 24
    const month = (d.getUTCMonth() + 1).toString().padStart(2, "0"); // 07
    const day = d.getUTCDate().toString().padStart(2, "0"); // 04

    return `${year}.${month}.${day}`;
  };

  // fromAddress, toAddress에서 값 추출
  const departureAddr =
    (locale === "ko" ? shortenRegionInAddress(props.fromAddress.region) : props.fromAddress.region) +
    " " +
    props.fromAddress.city +
    " ";
  const arrivalAddr =
    (locale === "ko" ? shortenRegionInAddress(props.toAddress.region) : props.toAddress.region) +
    " " +
    props.toAddress.city +
    " ";
  const departureDistrict = props.fromAddress.district + " ";
  const departureDetail = props.fromAddress.detail;
  const arrivalDistrict = props.toAddress.district + " ";
  const arrivalDetail = props.toAddress.detail;

  return (
    <article
      className="flex w-full flex-col items-center justify-center gap-4 lg:w-[400px]"
      aria-labelledby="estimate-info-title"
    >
      {/* 타이틀 및 견적 요청 날짜 부분 */}
      <header className="flex w-full flex-row items-center justify-center md:justify-between">
        <h1
          id="estimate-info-title"
          className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]"
        >
          {t("estimateInfo")}
        </h1>
        <p
          className="hidden text-[14px] leading-[24px] font-normal text-gray-500 md:block"
          aria-label={`${t("requestDate")} ${formatDate(props.createdAt)}`}
        >
          {formatDate(props.createdAt)}
        </p>
      </header>

      {/* 견적 정보 부분 */}
      <section className="flex w-full flex-col items-center justify-center gap-2" aria-label={t("estimateDetails")}>
        {/* 이사유형 */}
        <div
          className="flex w-full flex-row items-center justify-between"
          role="region"
          aria-labelledby="moving-type-label"
        >
          <p
            id="moving-type-label"
            className="text-primary-400 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]"
          >
            {t("movingType")}
          </p>
          <p
            className="text-black-500 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]"
            aria-label={`${t("movingType")}: ${getMovingTypeText(props.moveType)}`}
          >
            {getMovingTypeText(props.moveType)}
          </p>
        </div>

        {/* 출발지 및 도착지*/}
        <div
          className="border-border-light flex w-full flex-col items-center justify-center gap-2 border-t-1 border-b-1 pt-2 pb-2"
          role="region"
          aria-label={t("movingRoute")}
        >
          <div
            className="flex w-full flex-row items-start justify-between"
            role="region"
            aria-labelledby="departure-label"
          >
            <p
              id="departure-label"
              className="text-primary-400 w-[50px] flex-shrink-0 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]"
            >
              {t("departure")}
            </p>

            {/* 모바일용 */}
            <div className="flex flex-col md:hidden">
              <p
                className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("departure")} ${departureAddr}`}
              >
                {departureAddr}
              </p>
              <p
                className="text-black-500 flex-1 text-right text-[12px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("departure")} ${departureDistrict}`}
              >
                {departureDistrict}
              </p>
              <p
                className="text-black-500 flex-1 text-right text-[12px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("departure")} ${departureDetail}`}
              >
                {departureDetail}
              </p>
            </div>

            {/* 태블릿용 */}
            <div className="hidden md:flex lg:hidden">
              <p
                className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("departure")} ${departureAddr + departureDistrict + departureDetail}`}
              >
                {departureAddr + departureDistrict + departureDetail}
              </p>
            </div>

            {/* pc 사이즈  */}
            <div className="hidden lg:flex lg:flex-col">
              <p
                className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("departure")} ${departureAddr}`}
              >
                {departureAddr}
              </p>
              <p
                className="text-black-500 flex-1 text-right text-[12px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("departure")} ${departureDistrict}`}
              >
                {departureDistrict}
              </p>
              <p
                className="text-black-500 flex-1 text-right text-[12px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("departure")} ${departureDetail}`}
              >
                {departureDetail}
              </p>
            </div>
          </div>

          <div
            className="flex w-full flex-row items-start justify-between"
            role="region"
            aria-labelledby="arrival-label"
          >
            <p
              id="arrival-label"
              className="text-primary-400 w-[50px] flex-shrink-0 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]"
            >
              {t("arrival")}
            </p>

            {/* 모바일용 */}
            <div className="flex flex-col md:hidden">
              <p
                className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("arrival")} ${arrivalAddr}`}
              >
                {arrivalAddr}
              </p>
              <p
                className="text-black-500 flex-1 text-right text-[12px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("arrival")} ${arrivalDistrict}`}
              >
                {arrivalDistrict}
              </p>
              <p
                className="text-black-500 flex-1 text-right text-[12px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("arrival")} ${arrivalDetail}`}
              >
                {arrivalDetail}
              </p>
            </div>

            {/* 태블릿용 */}
            <div className="hidden md:flex lg:hidden">
              <p
                className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("arrival")} ${arrivalAddr + arrivalDistrict + arrivalDetail}`}
              >
                {arrivalAddr + arrivalDistrict + arrivalDetail}
              </p>
            </div>

            {/* pc 사이즈  */}
            <div className="hidden lg:flex lg:flex-col">
              <p
                className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("arrival")} ${arrivalAddr}`}
              >
                {arrivalAddr}
              </p>
              <p
                className="text-black-500 flex-1 text-right text-[12px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("arrival")} ${arrivalDistrict}`}
              >
                {arrivalDistrict}
              </p>
              <p
                className="text-black-500 flex-1 text-right text-[12px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]"
                aria-label={`${t("arrival")} ${arrivalDetail}`}
              >
                {arrivalDetail}
              </p>
            </div>
          </div>
        </div>

        {/* 이사날짜 */}
        <div
          className="flex w-full flex-row items-center justify-between"
          role="region"
          aria-labelledby="moving-date-label"
        >
          <p
            id="moving-date-label"
            className="text-primary-400 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]"
          >
            {t("movingDateLabel")}
          </p>
          <p
            className="text-black-500 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]"
            aria-label={`${t("movingDateLabel")}: ${formatDate(props.moveDate)}`}
          >
            {formatDate(props.moveDate)}
          </p>
        </div>
      </section>

      {/* 모바일용 요청 날짜 */}
      <footer className="flex w-full flex-row items-center justify-end">
        <p
          className="text-[14px] leading-[24px] font-normal text-gray-500 md:hidden"
          aria-label={`${t("requestDate")} ${formatSimpleDate(props.createdAt)}`}
        >
          {formatSimpleDate(props.createdAt)}
        </p>
      </footer>
    </article>
  );
};
export default EstimateRequestInfo;
