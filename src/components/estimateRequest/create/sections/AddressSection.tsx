import React from "react";
import ChooseAddressBtn from "../ChooseAddressBtn";
import { IAddressSectionProps } from "@/types/estimateRequest";
import { useTranslations } from "next-intl";

const AddressSection: React.FC<IAddressSectionProps> = ({ label, value, onClick }) => {
  const t = useTranslations();
  const hasAddress = value.roadAddress;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-black-400 text-base leading-[26px] font-semibold">{t(`estimateRequest.${label}`)}</label>

      <ChooseAddressBtn onClick={onClick}>
        {hasAddress ? (
          <div className="text-left">
            <div className="text-primary-400 text-base leading-[26px] font-medium">{value.roadAddress}</div>
            {value.detailAddress && (
              <div className="text-[14px] leading-6 font-normal text-gray-500">{value.detailAddress}</div>
            )}
          </div>
        ) : (
          <span className="text-primary-400 text-base leading-[26px] font-medium">
            {t(`estimateRequest.select${label.charAt(0).toUpperCase() + label.slice(1)}`)}
          </span>
        )}
      </ChooseAddressBtn>
    </div>
  );
};

export default AddressSection;
