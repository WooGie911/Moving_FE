import Image from "next/image";
import React from "react";
import iconDown from "@/assets/icon/arrow/icon-down-md.svg";
import iconUp from "@/assets/icon/arrow/icon-up-md.svg";
import { Option, BaseDropdownProps } from "@/types/dropdown";

const SortDropdown: React.FC<BaseDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "정렬 선택",
  className = "",
  buttonClassName = "",
  disabled = false,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  // 외부 클릭 감지
  React.useEffect(() => {
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

  React.useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex h-10 w-[114px] cursor-pointer items-center justify-between px-[10px] py-[8px] text-left text-[12px] font-medium text-[#999999] ${buttonClassName}`}
      >
        <span className={`${selectedOption ? "text-gray-900" : "text-gray-250"} text-md`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Image
          src={isOpen ? iconUp : iconDown}
          alt={isOpen ? "위쪽 화살표" : "아래쪽 화살표"}
          className="h-4 w-4 transition-transform duration-200"
        />
      </button>
      {isOpen && (
        <div
          className="rounded-2 absolute z-50 bg-white"
          style={{ width: 114, boxShadow: "4px 4px 10px 0px #E0E0E040" }}
        >
          <div className="rounded-[8px] border-1 border-gray-200 bg-white" style={{ width: 120 }}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`hover:bg-primary-100 w-full cursor-pointer px-[10px] py-[7px] text-left text-[12px] leading-[18px] font-medium transition-colors duration-150 ${option.value === value ? "bg-primary-50 text-primary-600 font-medium" : "text-gray-700"} ${option.value === "" ? "text-gray-500" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
