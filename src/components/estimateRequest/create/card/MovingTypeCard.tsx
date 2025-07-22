import React from "react";
import CheckIcon from "@/assets/icon/checkbox/icon-checkbox-circle-active.png";
import Image from "next/image";
import { IMovingTypeCardProps } from "@/types/estimateRequest";

const MovingTypeCard = ({ selected, label, description, image, onClick }: IMovingTypeCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border ${selected ? "border-primary-400 bg-primary-50" : "border-gray-200 bg-white"} flex flex-row items-center gap-4 px-4 py-5 transition-colors duration-200 lg:px-6 lg:py-6`}
    >
      {/* 왼쪽 상단 라디오 버튼 */}
      <div className="flex w-2/3 flex-col items-start">
        <div className="mb-2">
          <span
            className={`inline-block h-6 w-6 items-center justify-center rounded-full border-[1px] ${selected ? "border-primary-400 bg-primary-400" : "border-gray-300 bg-white"} transition-colors`}
          >
            {selected && <Image src={CheckIcon} alt="체크" width={24} height={24} />}
          </span>
        </div>
        <div className="text-left">
          <div className="text-black-500 text-base leading-[26px] font-semibold">{label}</div>
          <div className="text-[14px] leading-6 font-normal text-gray-500">{description}</div>
        </div>
      </div>
      {/* 이미지 */}
      <div className="flex w-1/3 items-center justify-end">{image}</div>
    </button>
  );
};

export default MovingTypeCard;
