import Image from "next/image";
import { useTranslations } from "next-intl";
import small from "../../../assets/icon/box/icon-box.png";
import home from "../../../assets/icon/home/icon-home.png";
import office from "../../../assets/icon/etc/icon-office.png";
import document from "../../../assets/icon/document/icon-document.png";
import { IMoveTypeLabelProps } from "@/types/Chip";

export const MoveTypeLabel = ({ type }: IMoveTypeLabelProps) => {
  const t = useTranslations("service");

  const getIconSrc = (serviceName: string) => {
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
    } else if (serviceName === "document") {
      return document;
    }
    return small;
  };

  const iconSrc = getIconSrc(type);

  const label = t(type);

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
