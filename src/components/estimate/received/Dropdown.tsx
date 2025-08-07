"use client";
import React, { useState } from "react";
import down from "@/assets/icon/arrow/icon-down-sm.svg";
import downLg from "@/assets/icon/arrow/icon-down-lg.svg";
import up from "@/assets/icon/arrow/icon-up-sm.svg";
import upLg from "@/assets/icon/arrow/icon-up-lg.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface DropdownProps {
  value?: "moveDate" | "createdAt";
  onChange?: (value: "moveDate" | "createdAt") => void;
}

export const Dropdown = ({ value = "createdAt", onChange }: DropdownProps) => {
  const t = useTranslations("estimate");
  const [sortOption, setSortOption] = useState<string>(
    value === "moveDate" ? t("sortByMoveDate") : t("sortByRequestDate"),
  );
  const [isOptionModalOpen, setIsOptionModalOpen] = useState<boolean>(false);

  return (
    <div className="relative flex flex-row items-center justify-start">
      <button
        className={`flex h-[36px] cursor-pointer flex-row items-center justify-between gap-[6px] rounded-[8px] py-2 pr-1 pl-3 lg:h-[50px] lg:pr-3 lg:pl-5`}
        onClick={() => setIsOptionModalOpen(!isOptionModalOpen)}
      >
        <p className={`text-[14px] leading-[24px] font-medium text-gray-400 lg:text-[16px] lg:leading-[26px]`}>
          {sortOption === "" ? t("sortByMoveDateDefault") : sortOption}
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
              setSortOption(t("sortByMoveDate"));
              onChange?.("moveDate");
              setIsOptionModalOpen(false);
            }}
          >
            {t("sortByMoveDate")}
          </div>
          <div
            className="flex h-10 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15"
            onClick={() => {
              setSortOption(t("sortByRequestDate"));
              onChange?.("createdAt");
              setIsOptionModalOpen(false);
            }}
          >
            {t("sortByRequestDate")}
          </div>
        </div>
      )}
    </div>
  );
};
