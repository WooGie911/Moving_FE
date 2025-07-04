import Image from "next/image";
import box from "../../../assets/icon/icon-box.png";
import home from "../../../assets/icon/icon-home.png";
import office from "../../../assets/icon/icon-office.png";
import document from "../../../assets/icon/icon-document.png";

export const MoveTypeLabel = ({ type }: { type: "small" | "home" | "office" | "document" }) => {
  return (
    <div>
      <div className="bg-primary-100 inline-flex h-[26px] items-center justify-start gap-[2px] rounded-sm py-[2px] pr-[7px] pl-[4px] md:h-[32px] md:py-[4px]">
        <div className="relative h-[20px] w-[20px]">
          <Image
            src={type === "small" ? box : type === "home" ? home : type === "office" ? office : document}
            alt="movetype"
            fill
          />
        </div>
        <p className="text-primary-400 inline-block text-center text-sm text-[13px] leading-[22px] font-semibold md:text-[14px] md:leading-[24px]">
          {type === "small"
            ? "소형이사"
            : type === "home"
              ? "가정이사"
              : type === "office"
                ? "사무실이사"
                : "지정 견적 요청"}
        </p>
      </div>
    </div>
  );
};
