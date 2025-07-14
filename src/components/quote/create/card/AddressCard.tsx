import React from "react";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { IAddressCardProps } from "@/types/quote";
import { useLanguageStore } from "@/stores/languageStore";

// 공통 스타일 정의
const styles = {
  addressText: "text-black-250 text-[14px] leading-6 font-normal md:text-base",
  postalCode: "text-black-250 text-[14px] leading-6 font-semibold md:text-base md:leading-[26px]",
};

const AddressCard = ({ postalCode, roadAddress, jibunAddress, selected = false }: IAddressCardProps) => {
  const { t } = useLanguageStore();
  return (
    <div
      className={`flex min-w-65 flex-col items-start gap-4 rounded-2xl border px-4 pt-5 pb-6 shadow-[2px_2px_10px_0px_rgba(224,224,224,0.20)] transition-colors ${selected ? "border-primary-400 bg-primary-100" : "border-border-light bg-white"} `}
    >
      <span className={styles.postalCode}>{postalCode || t("quote.postalCode")}</span>

      <div className="flex w-full items-start gap-2">
        <CircleTextLabel text={t("quote.roadNameLabel")} />
        <span className={styles.addressText}>{roadAddress || t("quote.roadAddressPlaceholder")}</span>
      </div>

      <div className="flex w-full items-start gap-2">
        <CircleTextLabel text={t("quote.jibunLabel")} />
        <span className={styles.addressText}>{jibunAddress || t("quote.jibunAddressPlaceholder")}</span>
      </div>
    </div>
  );
};

export default AddressCard;
