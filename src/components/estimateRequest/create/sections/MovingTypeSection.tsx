import React, { useMemo } from "react";
import Image from "next/image";
import MovingTypeCard from "../card/MovingTypeCard";
import SpeechBubble from "../SpeechBubble";
import MovingTypeSmall from "@/assets/img/etc/smallMoving.webp";
import MovingTypeHome from "@/assets/img/etc/homeMoving.webp";
import MovingTypeOffice from "@/assets/img/etc/officeMoving.webp";
import { IMovingTypeSectionProps } from "@/types/estimateRequest";
import { useLanguageStore } from "@/stores/languageStore";

// 이사 타입 데이터
const MOVING_TYPES = [
  {
    type: "small",
    image: MovingTypeSmall,
  },
  {
    type: "home",
    image: MovingTypeHome,
  },
  {
    type: "office",
    image: MovingTypeOffice,
  },
] as const;

const MovingTypeSection: React.FC<IMovingTypeSectionProps> = ({ value, onSelect }) => {
  const { t } = useLanguageStore();

  // 이미지 컴포넌트들을 메모이제이션
  const movingTypeCards = useMemo(() => {
    return MOVING_TYPES.map(({ type, image }) => ({
      type,
      card: (
        <MovingTypeCard
          key={type}
          selected={value === type}
          label={t(`estimateRequest.movingTypes.${type}`)}
          description={t(`estimateRequest.movingTypes.${type}Desc`)}
          image={
            <div className="relative h-30 w-30">
              <Image src={image} alt={t(`estimateRequest.movingTypes.${type}`)} fill className="object-contain" />
            </div>
          }
          onClick={() => onSelect(type)}
        />
      ),
    }));
  }, [value, t, onSelect]);

  return (
    <SpeechBubble type="question">
      <div className="flex flex-col gap-4 lg:flex-row">{movingTypeCards.map(({ card }) => card)}</div>
    </SpeechBubble>
  );
};

export default MovingTypeSection;
