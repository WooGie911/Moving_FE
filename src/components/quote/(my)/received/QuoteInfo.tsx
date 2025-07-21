import { IQuote } from "@/types/userQuote";
import React from "react";

export const QuoteInfo = ({
  movingType,
  createdAt,
  movingDate,
  departureAddr,
  arrivalAddr,
  departureDetail,
  arrivalDetail,
}: IQuote) => {
  // movingType에 따른 텍스트 변환 함수
  const getMovingTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case "small":
        return "소형이사";
      case "home":
        return "가정이사";
      case "office":
        return "사무실이사";
      default:
        return type;
    }
  };

  // Date 객체를 한국어 날짜 문자열로 변환하는 함수
  // ✅ 수정된 formatDate 함수
const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toLocaleDateString("ko-KR", {
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

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 lg:w-[400px]">
      {/* 타이틀 및 견적 요청 날짜 부분 */}
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
          견적 정보
        </h1>
        <p className="hidden text-[14px] leading-[24px] font-normal text-gray-500 md:block">{formatDate(createdAt)}</p>
      </div>
      {/* 견적 정보 부분 */}
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {/* 이사유형 */}
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-primary-400 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            이사유형
          </p>
          <p className="text-black-500 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            {getMovingTypeText(movingType)}
          </p>
        </div>
        {/* 출발지 및 도착지*/}
        <div className="border-border-light flex w-full flex-col items-center justify-center gap-2 border-t-1 border-b-1 pt-2 pb-2">
          <div className="flex w-full flex-row items-start justify-between">
            <p className="text-primary-400 w-[50px] flex-shrink-0 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
              출발지
            </p>
            <p className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]">
              {formatAddress(departureAddr, departureDetail)}
            </p>
          </div>
          <div className="flex w-full flex-row items-start justify-between">
            <p className="text-primary-400 w-[50px] flex-shrink-0 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
              도착지
            </p>
            <p className="text-black-500 flex-1 text-right text-[14px] leading-[24px] font-semibold break-words md:text-[16px] md:leading-[26px]">
              {formatAddress(arrivalAddr, arrivalDetail)}
            </p>
          </div>
        </div>
        {/* 이사날짜 */}
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-primary-400 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            이사날짜
          </p>
          <p className="text-black-500 text-[14px] leading-[24px] font-semibold md:text-[16px] md:leading-[26px]">
            {formatDate(movingDate)}
          </p>
        </div>
      </div>
      {/* 모바일용 요청 날짜 */}
      <div className="flex w-full flex-row items-center justify-end">
        <p className="text-[14px] leading-[24px] font-normal text-gray-500 md:hidden">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};
export default QuoteInfo;
