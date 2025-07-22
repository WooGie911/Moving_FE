"use client";
import { ICardListProps } from "@/types/customerEstimateRequest";
import React, { useState } from "react";
import { CardList } from "../CardList";
import down from "@/assets/icon/arrow/icon-down-sm.png";
import downLg from "@/assets/icon/arrow/icon-down-lg.png";
import up from "@/assets/icon/arrow/icon-up-sm.png";
import upLg from "@/assets/icon/arrow/icon-up-lg.png";
import Image from "next/image";

export const EstimateListSection = ({ estimateList }: { estimateList: ICardListProps[] }) => {
  const [option, setOption] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 필터링된 리스트 생성
  const filteredList =
    option === "" || option === "전체"
      ? estimateList
      : option === "확정견적"
        ? estimateList.filter((item) => item.estimateState === "ACCEPTED")
        : estimateList; // 옵션이 더 있다면 else if 추가

  return (
    <div className="lg:border-border-light flex w-full flex-col items-center justify-center gap-4 lg:border-l lg:pl-15">
      {/* 목록 과 견적서 개수 */}
      <div className="flex w-full flex-row items-center justify-start gap-2">
        <h1 className="text-black-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
          견적서 목록
        </h1>
        <p className="text-primary-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
          {filteredList.length}
        </p>
      </div>
      {/* 정렬 버튼 */}
      <div className="relative flex w-full flex-row items-center justify-start">
        <button
          className={`flex h-[36px] cursor-pointer flex-row items-center justify-between gap-[6px] rounded-[8px] border-1 py-2 pr-1 pl-3 lg:h-[50px] lg:pr-3 lg:pl-5 ${option === "" ? "border-border-light" : "border-primary-400 bg-primary-100"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <p
            className={`text-black-400 text-[14px] leading-[24px] font-medium lg:text-[16px] lg:leading-[26px] ${option === "" ? "text-black-400" : "text-primary-400"}`}
          >
            {option === "" ? "전체" : option}
          </p>

          <div className="relative flex h-[20px] w-[20px] flex-row items-center justify-center lg:hidden">
            <Image src={isOpen ? up : down} alt="dropdown" fill />
          </div>

          <div className="relative hidden lg:block lg:h-[36px] lg:w-[36px] lg:flex-row lg:items-center lg:justify-center">
            <Image src={isOpen ? upLg : downLg} alt="dropdown" fill />
          </div>
        </button>
        {/*  드롭다운 메뉴  */}
        {isOpen && (
          <div className="absolute top-[110%] left-0 z-10 rounded-[12px] border border-gray-100 bg-white shadow-lg">
            <div
              className="flex h-10 w-27 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15 lg:w-40"
              onClick={() => {
                setOption("전체");
                setIsOpen(false);
              }}
            >
              전체
            </div>
            <div
              className="flex h-10 w-27 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15 lg:w-40"
              onClick={() => {
                setOption("확정견적");
                setIsOpen(false);
              }}
            >
              확정견적
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-stretch justify-center">
        {filteredList.map((item) => (
          <CardList key={item.estimateId} {...item} />
        ))}
      </div>
    </div>
  );
};
