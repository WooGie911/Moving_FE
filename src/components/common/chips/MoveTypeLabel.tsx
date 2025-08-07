import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import small from "../../../assets/icon/box/icon-box.svg";
import home from "../../../assets/icon/home/icon-home.svg";
import office from "../../../assets/icon/etc/icon-office.svg";
import document from "../../../assets/icon/document/icon-document.svg";
import { IMoveTypeLabelProps } from "@/types/Chip";

interface ExtendedMoveTypeLabelProps extends IMoveTypeLabelProps {
  variant?: "list" | "favorite" | "favorite-responsive";
}

export const MoveTypeLabel = ({ type, variant, "aria-label": ariaLabel }: ExtendedMoveTypeLabelProps) => {
  const t = useTranslations("service");

  const getIconSrc = (serviceName: string) => {
    // mapServiceTypeToMoveType에서 반환되는 값들에 대한 직접 매핑 (대소문자 구분 없이)
    if (serviceName.toLowerCase() === "small") {
      return small;
    } else if (serviceName.toLowerCase() === "home") {
      return home;
    } else if (serviceName.toLowerCase() === "office") {
      return office;
    } else if (serviceName.toLowerCase() === "document") {
      return document;
    }
    // 기존 로직도 유지 (다른 경우를 위해)
    if (serviceName.includes("소형") || serviceName.includes("Small") || serviceName.includes("小型")) {
      return small;
    } else if (
      serviceName.includes("가정") ||
      serviceName.includes("Home") ||
      serviceName.includes("家庭") ||
      serviceName === "搬家"
    ) {
      return home;
    } else if (
      serviceName.includes("사무실") ||
      serviceName.includes("Office") ||
      serviceName.includes("办公室") ||
      serviceName.includes("主任")
    ) {
      return office;
    }
    return small; // 기본값
  };

  const iconSrc = getIconSrc(type);
  const locale = useLocale();

  const getLabel = () => {
    const translatedLabel = t(type);

    // variant가 "favorite"이고 영어일 때만 " Move" 제거
    if (locale === "en" && variant === "favorite") {
      const finalLabel = translatedLabel.replace(" Move", "");
      return finalLabel;
    }

    return translatedLabel;
  };

  const label = getLabel();

  return (
    <div aria-label={ariaLabel}>
      <div className="bg-primary-100 inline-flex h-[26px] items-center justify-start gap-[2px] rounded-sm py-[2px] pr-[7px] pl-[4px] md:h-[32px] md:py-[4px]">
        <div className="relative h-[20px] w-[20px]">
          <Image src={iconSrc} alt="movetype" fill className="object-contain" />
        </div>
        <p className="text-primary-400 text-center text-[13px] leading-[22px] font-semibold md:text-[14px] md:leading-[24px]">
          {label}
        </p>
      </div>
    </div>
  );
};
