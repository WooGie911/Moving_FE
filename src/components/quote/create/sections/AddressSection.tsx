import React from "react";
import ChooseAddressBtn from "../ChooseAddressBtn";
import {
  addressBtnClass,
  sectionLabelClass,
  addressSectionClass,
  addressSectionLastClass,
} from "@/constant/quoteStyles";
import { IAddress, IAddressSectionProps } from "@/types/quote";

const AddressSection: React.FC<IAddressSectionProps> = ({ label, value, onClick }) => (
  <div className={label === "출발지" ? addressSectionClass : addressSectionLastClass}>
    <span className={sectionLabelClass}>{label}</span>
    <ChooseAddressBtn className={addressBtnClass} onClick={onClick}>
      {value.roadAddress
        ? `${value.roadAddress}${value.detailAddress ? ` ${value.detailAddress}` : ""}`
        : `${label} 선택하기`}
    </ChooseAddressBtn>
  </div>
);

export default AddressSection;
