import Image from "next/image";
import small from "../../../assets/icon/box/icon-box.png";
import home from "../../../assets/icon/home/icon-home.png";
import office from "../../../assets/icon/etc/icon-office.png";
import document from "../../../assets/icon/document/icon-document.png";
import { IMoveTypeLabelProps } from "@/types/Chip";

const MOVE_TYPE_LABELS = {
  small: "소형이사",
  home: "가정이사",
  office: "사무실이사",
  document: "지정 견적 요청",
} as const;

const MOVE_TYPE_ICONS = {
  small: small,
  home: home,
  office: office,
  document: document,
} as const;

export const MoveTypeLabel = ({ type }: IMoveTypeLabelProps) => {
  const label = MOVE_TYPE_LABELS[type];
  const iconSrc = MOVE_TYPE_ICONS[type];

  return (
    <div>
      <div className="bg-primary-100 inline-flex h-[26px] items-center justify-start gap-[2px] rounded-sm py-[2px] pr-[7px] pl-[4px] md:h-[32px] md:py-[4px]">
        <div className="relative h-[20px] w-[20px]">
          <Image src={iconSrc} alt="movetype" fill />
        </div>
        <p className="text-primary-400 text-center text-[13px] leading-[22px] font-semibold md:text-[14px] md:leading-[24px]">
          {label}
        </p>
      </div>
    </div>
  );
};
