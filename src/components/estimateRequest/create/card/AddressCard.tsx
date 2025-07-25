import React from "react";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { IAddressCardProps } from "@/types/estimateRequest";
import { useLanguageStore } from "@/stores/languageStore";

// 공통 스타일 변수
const ADDRESS_CARD_STYLES = {
  container:
    "flex min-w-65 flex-col items-start gap-4 rounded-2xl border px-4 pt-5 pb-6 shadow-[2px_2px_10px_0px_rgba(224,224,224,0.20)] transition-colors",
  selected: "border-primary-400 bg-primary-100",
  unselected: "border-border-light bg-white",
  postalCode: "text-black-250 text-[14px] leading-6 font-semibold md:text-base md:leading-[26px]",
  addressText: "text-black-250 text-[14px] leading-6 font-normal md:text-base",
  addressRow: "flex w-full items-start gap-2",
} as const;

const AddressCard: React.FC<IAddressCardProps> = ({ postalCode, roadAddress, jibunAddress, selected = false }) => {
  const { t } = useLanguageStore();

  const containerClass = `${ADDRESS_CARD_STYLES.container} ${
    selected ? ADDRESS_CARD_STYLES.selected : ADDRESS_CARD_STYLES.unselected
  }`;

  return (
    <div className={containerClass}>
      {/* 우편번호 */}
      <span className={ADDRESS_CARD_STYLES.postalCode}>{postalCode || t("estimateRequest.postalCode")}</span>

      {/* 도로명 주소 */}
      <div className={ADDRESS_CARD_STYLES.addressRow}>
        <CircleTextLabel text={t("estimateRequest.roadNameLabel")} />
        <span className={ADDRESS_CARD_STYLES.addressText}>
          {roadAddress || t("estimateRequest.roadAddressPlaceholder")}
        </span>
      </div>

      {/* 지번 주소 */}
      <div className={ADDRESS_CARD_STYLES.addressRow}>
        <CircleTextLabel text={t("estimateRequest.jibunLabel")} />
        <span className={ADDRESS_CARD_STYLES.addressText}>
          {jibunAddress || t("estimateRequest.jibunAddressPlaceholder")}
        </span>
      </div>
    </div>
  );
};

export default AddressCard;
