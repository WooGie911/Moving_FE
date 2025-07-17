import React from "react";
import ChooseAddressBtn from "../ChooseAddressBtn";
import {
  addressBtnClass,
  sectionLabelClass,
  addressSectionClass,
  addressSectionLastClass,
} from "@/constant/quoteStyles";
import { IAddressSectionProps } from "@/types/quote";
import { useLanguageStore } from "@/stores/languageStore";

const AddressSection: React.FC<IAddressSectionProps> = ({ label, value, onClick }) => {
  const { t } = useLanguageStore();
  const isDeparture = label === "departure";
  return (
    <div className={isDeparture ? addressSectionClass : addressSectionLastClass}>
      <span className={sectionLabelClass}>{t(`quote.${label}`)}</span>
      <ChooseAddressBtn className={addressBtnClass} onClick={onClick}>
        {value.roadAddress
          ? `${value.roadAddress}${value.detailAddress ? ` ${value.detailAddress}` : ""}`
          : `${t(`quote.${label}`)} ${t("quote.selectAddress")}`}
      </ChooseAddressBtn>
    </div>
  );
};

export default AddressSection;
