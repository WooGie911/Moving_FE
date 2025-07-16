"use client";
import React, { useState } from "react";
import down from "@/assets/icon/arrow/icon-down-sm.png";
import downLg from "@/assets/icon/arrow/icon-down-lg.png";
import up from "@/assets/icon/arrow/icon-up-sm.png";
import upLg from "@/assets/icon/arrow/icon-up-lg.png";
import Image from "next/image";

export const Dropdown = () => {
  const [sordOption, setSortOption] = useState<string>("이사 빠른순");
  const [isOptionModalOpen, setIsOptionModalOpen] = useState<boolean>(false);

  return (
    <div className="relative flex flex-row items-center justify-start">
      <button
        className={`flex h-[36px] cursor-pointer flex-row items-center justify-between gap-[6px] rounded-[8px] py-2 pr-1 pl-3 lg:h-[50px] lg:pr-3 lg:pl-5`}
        onClick={() => setIsOptionModalOpen(!isOptionModalOpen)}
      >
        <p className={`text-[14px] leading-[24px] font-medium text-gray-400 lg:text-[16px] lg:leading-[26px]`}>
          {sordOption === "" ? "이사빠른순" : sordOption}
        </p>

        <div className="relative flex h-[20px] w-[20px] flex-row items-center justify-center lg:hidden">
          <Image src={isOptionModalOpen ? up : down} alt="dropdown" fill />
        </div>

        <div className="relative hidden lg:block lg:h-[36px] lg:w-[36px] lg:flex-row lg:items-center lg:justify-center">
          <Image src={isOptionModalOpen ? upLg : downLg} alt="dropdown" fill />
        </div>
      </button>
      {/*  드롭다운 메뉴  */}
      {isOptionModalOpen && (
        <div className="absolute top-[110%] left-0 z-10 min-w-[120px] rounded-[12px] border border-gray-100 bg-white shadow-lg">
          <div
            className="flex h-10 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15"
            onClick={() => {
              setSortOption("이사 빠른순");
              setIsOptionModalOpen(false);
            }}
          >
            이사 빠른순
          </div>
          <div
            className="flex h-10 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15"
            onClick={() => {
              setSortOption("요청일 빠른순");
              setIsOptionModalOpen(false);
            }}
          >
            요청일 빠른순
          </div>
        </div>
      )}
    </div>
  );
};
