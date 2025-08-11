"use client";
import React, { useState, useRef, useEffect } from "react";
import down from "@/assets/icon/arrow/icon-down-sm.svg";
import downLg from "@/assets/icon/arrow/icon-down-lg.svg";
import up from "@/assets/icon/arrow/icon-up-sm.svg";
import upLg from "@/assets/icon/arrow/icon-up-lg.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface DropdownProps {
  value?: "moveDate" | "createdAt";
  onChange?: (value: "moveDate" | "createdAt") => void;
  "aria-label"?: string;
}

export const Dropdown = ({ value = "createdAt", onChange, "aria-label": ariaLabel }: DropdownProps) => {
  const t = useTranslations("estimate");
  const [sortOption, setSortOption] = useState<string>(
    value === "moveDate" ? t("sortByMoveDate") : t("sortByRequestDate"),
  );
  const [isOptionModalOpen, setIsOptionModalOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOptionModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 키보드 접근성
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setIsOptionModalOpen(!isOptionModalOpen);
        break;
      case "Escape":
        setIsOptionModalOpen(false);
        break;
    }
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent, option: "moveDate" | "createdAt") => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const optionText = option === "moveDate" ? t("sortByMoveDate") : t("sortByRequestDate");
      setSortOption(optionText);
      onChange?.(option);
      setIsOptionModalOpen(false);
    }
  };

  return (
    <div className="relative flex flex-row items-center justify-start" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className={`flex h-[36px] cursor-pointer flex-row items-center justify-between gap-[6px] rounded-[8px] py-2 pr-1 pl-3 focus:outline-none lg:h-[50px] lg:pr-3 lg:pl-5`}
        onClick={() => setIsOptionModalOpen(!isOptionModalOpen)}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || t("ariaLabels.sortDropdown")}
        aria-haspopup="listbox"
        aria-expanded={isOptionModalOpen}
        aria-controls="sort-options-listbox"
      >
        <p className={`text-[14px] leading-[24px] font-medium text-gray-400 lg:text-[16px] lg:leading-[26px]`}>
          {sortOption === "" ? t("sortByMoveDateDefault") : sortOption}
        </p>

        <div className="relative flex h-[20px] w-[20px] flex-row items-center justify-center lg:hidden">
          <Image src={isOptionModalOpen ? up : down} alt="" fill aria-hidden="true" />
        </div>

        <div className="relative hidden lg:block lg:h-[36px] lg:w-[36px] lg:flex-row lg:items-center lg:justify-center">
          <Image src={isOptionModalOpen ? upLg : downLg} alt="" fill aria-hidden="true" />
        </div>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOptionModalOpen && (
        <div
          id="sort-options-listbox"
          className="absolute top-[110%] left-0 z-10 min-w-[120px] rounded-[12px] border border-gray-100 bg-white shadow-lg"
          role="listbox"
          aria-label={t("ariaLabels.sortDropdown")}
        >
          <div
            className="flex h-10 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none lg:h-15"
            onClick={() => {
              setSortOption(t("sortByMoveDate"));
              onChange?.("moveDate");
              setIsOptionModalOpen(false);
            }}
            onKeyDown={(e) => handleOptionKeyDown(e, "moveDate")}
            role="option"
            aria-selected={value === "moveDate"}
            tabIndex={0}
          >
            {t("sortByMoveDate")}
          </div>
          <div
            className="flex h-10 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none lg:h-15"
            onClick={() => {
              setSortOption(t("sortByRequestDate"));
              onChange?.("createdAt");
              setIsOptionModalOpen(false);
            }}
            onKeyDown={(e) => handleOptionKeyDown(e, "createdAt")}
            role="option"
            aria-selected={value === "createdAt"}
            tabIndex={0}
          >
            {t("sortByRequestDate")}
          </div>
        </div>
      )}
    </div>
  );
};
