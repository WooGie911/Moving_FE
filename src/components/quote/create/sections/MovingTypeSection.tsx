import React from "react";
import Image from "next/image";
import MovingTypeCard from "../card/MovingTypeCard";
import SpeechBubble from "../SpeechBubble";
import MovingTypeSmall from "@/assets/img/etc/smallmove.png";
import MovingTypeHome from "@/assets/img/etc/homemove.png";
import MovingTypeOffice from "@/assets/img/etc/officemove.png";
import { IMovingTypeSectionProps } from "@/types/quote";
import { useLanguageStore } from "@/stores/languageStore";

const MovingTypeSection: React.FC<IMovingTypeSectionProps> = ({ value, onSelect }) => {
  const { t } = useLanguageStore();

  return (
    <SpeechBubble type="question">
      <div className="flex flex-col gap-4 lg:flex-row">
        <MovingTypeCard
          selected={value === "small"}
          label={t("quote.movingTypes.small")}
          description={t("quote.movingTypes.smallDesc")}
          image={
            <div className="relative h-30 w-30">
              <Image src={MovingTypeSmall} alt={t("quote.movingTypes.small")} fill className="object-contain" />
            </div>
          }
          onClick={() => onSelect("small")}
        />
        <MovingTypeCard
          selected={value === "home"}
          label={t("quote.movingTypes.home")}
          description={t("quote.movingTypes.homeDesc")}
          image={
            <div className="relative h-30 w-30">
              <Image src={MovingTypeHome} alt={t("quote.movingTypes.home")} fill className="object-contain" />
            </div>
          }
          onClick={() => onSelect("home")}
        />
        <MovingTypeCard
          selected={value === "office"}
          label={t("quote.movingTypes.office")}
          description={t("quote.movingTypes.officeDesc")}
          image={
            <div className="relative h-30 w-30">
              <Image src={MovingTypeOffice} alt={t("quote.movingTypes.office")} fill className="object-contain" />
            </div>
          }
          onClick={() => onSelect("office")}
        />
      </div>
    </SpeechBubble>
  );
};

export default MovingTypeSection;
