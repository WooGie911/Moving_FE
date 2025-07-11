import React from "react";
import Image from "next/image";
import MovingTypeCard from "../card/MovingTypeCard";
import SpeechBubble from "../SpeechBubble";
import MovingTypeSmall from "@/assets/img/etc/smallmove.png";
import MovingTypeHome from "@/assets/img/etc/homemove.png";
import MovingTypeOffice from "@/assets/img/etc/officemove.png";
import { TMovingType, IMovingTypeSectionProps } from "@/types/quote";

const MovingTypeSection: React.FC<IMovingTypeSectionProps> = ({ value, onSelect }) => (
  <SpeechBubble type="question">
    <div className="flex flex-col gap-4 lg:flex-row">
      <MovingTypeCard
        selected={value === "small"}
        label="소형 이사"
        description="원룸, 투룸, 20평대 미만"
        image={
          <div className="relative h-30 w-30">
            <Image src={MovingTypeSmall} alt="소형 이사" fill className="object-contain" />
          </div>
        }
        onClick={() => onSelect("small")}
      />
      <MovingTypeCard
        selected={value === "home"}
        label="가정 이사"
        description="쓰리룸, 20평대 이상"
        image={
          <div className="relative h-30 w-30">
            <Image src={MovingTypeHome} alt="가정 이사" fill className="object-contain" />
          </div>
        }
        onClick={() => onSelect("home")}
      />
      <MovingTypeCard
        selected={value === "office"}
        label="사무실 이사"
        description="사무실, 상업공간"
        image={
          <div className="relative h-30 w-30">
            <Image src={MovingTypeOffice} alt="사무실 이사" fill className="object-contain" />
          </div>
        }
        onClick={() => onSelect("office")}
      />
    </div>
  </SpeechBubble>
);

export default MovingTypeSection;
