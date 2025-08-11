"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import iconDown from "@/assets/icon/arrow/icon-down.svg";
import iconUp from "@/assets/icon/arrow/icon-up.svg";
import { Option, CustomDropdownProps } from "@/types/dropdown";

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
  className = "",
  buttonClassName = "",
  disabled = false,
  twoColumns = false, // 기본값은 false
  onOpenChange,
  dropdownClassName = "",
  dropdownWidth = 160,
  dropdownHeight = 320,
  dropdownPadding = "",
  optionClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 드롭다운 상태 변경 시 콜백 호출
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      if (isOpen) {
        // 닫힐 때 포커스 제거
        buttonRef.current?.blur();
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`focus:ring-primary-400 cursor-pointer text-left focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${isOpen ? "ring-primary-400 bg-primary-100 border-transparent ring-2" : "border-gray-300 hover:border-gray-400"} border transition-all duration-200 ${buttonClassName}`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`truncate ${
              selectedOption
                ? isOpen
                  ? "text-primary-400"
                  : "text-gray-900"
                : isOpen
                  ? "text-primary-400"
                  : "text-gray-250"
            }`}
          >
            {selectedOption ? selectedOption.label.replace(/이사$/, "") : placeholder}
          </span>
          <Image
            src={isOpen ? iconUp : iconDown}
            alt={isOpen ? "위쪽 화살표" : "아래쪽 화살표"}
            className="h-5 w-5 flex-shrink-0 transition-transform duration-200 lg:h-9 lg:w-9"
          />
        </div>
      </button>

      {isOpen && (
        <div
          className={`lg:rounded-4 absolute z-50 mt-3 rounded-[8px] bg-white ${dropdownClassName}`}
          style={{
            width: dropdownWidth,
            maxHeight: dropdownHeight,
            boxShadow: "4px 4px 10px 0px #E0E0E040",
          }}
        >
          <div
            className={`dropdown-scrollbar overflow-auto rounded-[8px] border-1 border-gray-200 bg-white lg:rounded-[16px] ${twoColumns ? "grid grid-cols-2" : ""} ${dropdownPadding}`}
            style={{ height: dropdownHeight, width: dropdownWidth }}
          >
            {options.map((option, idx) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`hover:bg-primary-100 w-full cursor-pointer text-left leading-[24px] font-medium transition-colors duration-150 hover:bg-gray-50 lg:leading-[26px] ${optionClassName} ${option.value === value ? "bg-primary-50 text-primary-600 font-medium" : "text-gray-700"} ${option.value === "" ? "text-gray-500" : ""} ${twoColumns && idx % 2 === 0 ? "border-r-1 border-gray-200" : ""} `}
              >
                <span className="block truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
