import React from "react";
import CheckIcon from "@/assets/icon/checkbox/roundCheck.svg";
import Image from "next/image";
import { IMovingTypeCardProps } from "@/types/estimateRequest";

// 공통 스타일 변수
const MOVING_TYPE_CARD_STYLES = {
  base: "w-full rounded-2xl border flex flex-row items-center gap-4 px-4 py-5 transition-colors duration-200 lg:px-6 lg:py-6",
  selected: "border-primary-400 bg-primary-50",
  unselected: "border-gray-200 bg-white",
  radioBase: "inline-block h-6 w-6 items-center justify-center rounded-full border-[1px] transition-colors",
  radioSelected: "border-primary-400 bg-primary-400",
  radioUnselected: "border-gray-300 bg-white",
  textContainer: "flex w-2/3 flex-col items-start",
  radioContainer: "mb-2",
  textArea: "text-left",
  title: "text-black-500 text-base leading-[26px] font-semibold",
  description: "text-[14px] leading-6 font-normal text-gray-500",
  imageContainer: "flex w-1/3 items-center justify-end",
} as const;

const MovingTypeCard: React.FC<IMovingTypeCardProps> = ({ selected, label, description, image, onClick }) => {
  const cardClasses = [
    MOVING_TYPE_CARD_STYLES.base,
    selected ? MOVING_TYPE_CARD_STYLES.selected : MOVING_TYPE_CARD_STYLES.unselected,
  ].join(" ");

  const radioClasses = [
    MOVING_TYPE_CARD_STYLES.radioBase,
    selected ? MOVING_TYPE_CARD_STYLES.radioSelected : MOVING_TYPE_CARD_STYLES.radioUnselected,
  ].join(" ");

  return (
    <button type="button" onClick={onClick} className={cardClasses}>
      {/* 왼쪽 상단 라디오 버튼 */}
      <div className={MOVING_TYPE_CARD_STYLES.textContainer}>
        <div className={MOVING_TYPE_CARD_STYLES.radioContainer}>
          <span className={radioClasses}>
            {selected && <Image src={CheckIcon} alt="체크" width={24} height={24} />}
          </span>
        </div>

        {/* 텍스트 영역 */}
        <div className={MOVING_TYPE_CARD_STYLES.textArea}>
          <div className={MOVING_TYPE_CARD_STYLES.title}>{label}</div>
          <div className={MOVING_TYPE_CARD_STYLES.description}>{description}</div>
        </div>
      </div>

      {/* 이미지 */}
      <div className={MOVING_TYPE_CARD_STYLES.imageContainer}>{image}</div>
    </button>
  );
};

export default MovingTypeCard;
