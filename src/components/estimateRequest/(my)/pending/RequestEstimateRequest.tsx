import { IEstimateRequestProps } from "@/types/customerEstimateRequest";
import React from "react";
import arrow from "@/assets/icon/arrow/icon-arrow.png";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/common/button/Button";

export const RequestEstimateRequest = ({
  movingType,
  requestDate,
  movingDate,
  startPoint,
  endPoint,
  hasConfirmedEstimate,
}: IEstimateRequestProps) => {
  const t = useTranslations("estimateRequest");
  const tMoveTypes = useTranslations("moveTypes");

  // movingType을 다국어로 변환하는 함수
  const getMovingTypeTranslated = (movingType: string): string => {
    switch (movingType) {
      case "small":
        return tMoveTypes("small");
      case "office":
        return tMoveTypes("office");
      case "home":
        return tMoveTypes("home");
      case "document":
        return tMoveTypes("document");
      default:
        return movingType;
    }
  };

  // 견적신청일: 다국어 날짜 포맷
  const formatRequestDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 다국어 날짜 포맷
    const yearSuffix = t("dateFormat.year");
    const monthSuffix = t("dateFormat.month");
    const daySuffix = t("dateFormat.day");

    // 영어인 경우 MM/DD/YYYY 형식
    if (monthSuffix === "/" && yearSuffix === "" && daySuffix === "") {
      return `${month}/${day}/${year}`;
    }
    // 한국어, 중국어인 경우 YYYY년 MM월 DD일 형식
    else {
      return `${year}${yearSuffix} ${month}${monthSuffix} ${day}${daySuffix}`;
    }
  };

  // 이사일: 다국어 날짜 포맷
  const formatDateWithDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = [
      t("weekdays.sunday"),
      t("weekdays.monday"),
      t("weekdays.tuesday"),
      t("weekdays.wednesday"),
      t("weekdays.thursday"),
      t("weekdays.friday"),
      t("weekdays.saturday"),
    ];
    const dayOfWeek = weekdays[date.getDay()];

    // 다국어 날짜 포맷 - 언어별로 다른 형식 적용
    const yearSuffix = t("dateFormat.year");
    const monthSuffix = t("dateFormat.month");
    const daySuffix = t("dateFormat.day");

    // 영어인 경우 MM/DD/YYYY 형식
    if (monthSuffix === "/" && yearSuffix === "" && daySuffix === "") {
      return `${month}/${day}/${year} (${dayOfWeek})`;
    }
    // 한국어, 중국어인 경우 YYYY년 MM월 DD일 형식
    else {
      return `${year}${yearSuffix} ${month}${monthSuffix} ${day}${daySuffix} (${dayOfWeek})`;
    }
  };

  return (
    <>
      <div className="flex w-full max-w-300 flex-col items-center justify-center gap-5 p-6 md:px-18 md:py-8 lg:flex-row lg:justify-between lg:px-0">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex w-full flex-col items-start justify-center">
            <h1 className="leading-2xl text-black-500 text-[20px] font-bold md:text-[24px]">
              {getMovingTypeTranslated(movingType)}
            </h1>
            <p className="md:leading-[24 px] text-[12px] leading-[18px] font-normal text-gray-500 md:text-[14px]">{`${t("requestDate")} ${formatRequestDate(requestDate)}`}</p>
          </div>
          {hasConfirmedEstimate && (
            <div className="lg:hidden">
              <Button variant="solid" width="w-[110px]" height="h-[44px]" rounded="rounded-[12px]">
                이사완료
              </Button>
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-1 md:flex-row md:justify-start md:gap-3">
          <div className="flex flex-row justify-between md:flex-col">
            <p className="text-[14px] leading-6 font-normal text-gray-500">{t("departure")}</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]">
              {startPoint}
            </p>
          </div>

          <div className="hidden justify-end pb-1 md:flex md:flex-col">
            <Image src={arrow} alt="arrow" width={16} height={16} />
          </div>

          <div className="flex flex-row justify-between md:flex-col">
            <p className="text-[14px] leading-6 font-normal text-gray-500">{t("arrival")}</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]">
              {endPoint}
            </p>
          </div>
          <div className="flex flex-row justify-between md:ml-7 md:flex-col">
            <p className="text-[14px] leading-6 font-normal text-gray-500">{t("movingDate")}</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]">
              {formatDateWithDay(movingDate)}
            </p>
          </div>

          {hasConfirmedEstimate && (
            <div className="hidden pt-1 pl-4 lg:block">
              <Button variant="solid" width="w-[110px]" height="h-[44px]" rounded="rounded-[12px]">
                이사완료
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
