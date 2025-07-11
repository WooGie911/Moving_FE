import React from "react";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { IAddressCardProps } from "@/types/quote";

// 공통 스타일 정의
const styles = {
  addressText: "text-black-250 text-[14px] leading-6 font-normal md:text-base",
  postalCode: "text-black-250 text-[14px] leading-6 font-semibold md:text-base md:leading-[26px]",
};

const AddressCard = ({ postalCode, roadAddress, jibunAddress, selected = false }: IAddressCardProps) => {
  return (
    <div
      className={`flex min-w-65 flex-col items-start gap-4 rounded-2xl border px-4 pt-5 pb-6 shadow-[2px_2px_10px_0px_rgba(224,224,224,0.20)] transition-colors ${selected ? "border-primary-400 bg-primary-100" : "border-border-light bg-white"} `}
    >
      <span className={styles.postalCode}>{postalCode || "우편번호"}</span>

      <div className="flex w-full items-start gap-2">
        <CircleTextLabel text="도로명" />
        <span className={styles.addressText}>{roadAddress || "도로명 주소를 입력해주세요"}</span>
      </div>

      <div className="flex w-full items-start gap-2">
        <CircleTextLabel text="지번" />
        <span className={styles.addressText}>{jibunAddress || "지번 주소를 입력해주세요"}</span>
      </div>
    </div>
  );
};

export default AddressCard;
