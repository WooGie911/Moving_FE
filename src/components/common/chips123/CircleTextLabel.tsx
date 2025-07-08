"use client";
import React, { useState } from "react";

interface IProps {
  text: string;
  clickAble?: boolean;
  onClick?: () => void;
}

export const CircleTextLabel = ({ text, clickAble = false, onClick }: IProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return clickAble ? (
    <div>
      <div
        className={`inline-flex h-[36px] cursor-pointer items-center justify-start rounded-full border px-3 py-1.5 lg:h-[46px] lg:px-5 ${isClicked ? "border-primary-400 bg-primary-100" : "border-gray-300 bg-gray-100"}`}
        onClick={handleClick}
      >
        <p
          className={`text-sm text-[14px] leading-[20px] font-semibold lg:text-[18px] lg:leading-[26px] ${isClicked ? "text-primary-400" : "text-gray-900"}`}
        >
          {text}
        </p>
      </div>
    </div>
  ) : (
    <div>
      <div className="bg-primary-100 inline-flex h-6 items-center justify-start rounded-full px-[6px] py-1.5 md:h-8 md:px-[8.5px]">
        <p className="text-primary-400 text-[12px] leading-[16px] font-semibold md:text-[14px] md:leading-[20px]">
          {text}
        </p>
      </div>
    </div>
  );
};
