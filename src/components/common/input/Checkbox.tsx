"use client";

import React, { useState } from "react";
import Image from "next/image";
import circleActive from "@/assets/icon/checkbox/icon-checkbox-circle-active.svg";
import circleInactive from "@/assets/icon/checkbox/icon-checkbox-circle-inactive.svg";
import squareActive from "@/assets/icon/checkbox/icon-checkbox-square-active.svg";
import squareInactive from "@/assets/icon/checkbox/icon-checkbox-square-inactive.svg";

interface ICheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  type?: "circle" | "square";
  disabled?: boolean;
  className?: string;
}

export const Checkbox = ({
  label,
  checked = false,
  onChange,
  type = "circle",
  disabled = false,
  className = "",
}: ICheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  // 외부 checked prop 변화 감지
  React.useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleClick = () => {
    if (disabled) return;

    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  const getIconSrc = () => {
    if (type === "circle") {
      return isChecked ? circleActive : circleInactive;
    } else {
      return isChecked ? squareActive : squareInactive;
    }
  };

  return (
    <div
      className={`flex cursor-pointer items-center gap-2 px-2 py-2 ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
      onClick={handleClick}
    >
      <div className="relative h-8 w-8">
        <Image src={getIconSrc()} alt={isChecked ? "checked" : "unchecked"} fill className="object-contain" />
      </div>
      {label && <span className="text-black-500 text-[16px] leading-[26px] font-normal">{label}</span>}
    </div>
  );
};
