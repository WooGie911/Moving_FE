import React from "react";

// 공통 스타일 정의
const styles = {
  label:
    "bg-primary-100 text-primary-400 flex w-11 items-center justify-center rounded-2xl px-[6px] py-[2px] text-[12px] leading-5 font-semibold md:w-[54px] md:text-[14px]",
  addressText: "text-black-250 text-[14px] leading-6 font-normal md:text-base",
  postalCode: "text-black-250 text-[14px] leading-6 font-semibold md:text-base md:leading-[26px]",
};

interface IAddressCardProps {
  postalCode?: string;
  roadAddress?: string;
  jibunAddress?: string;
}

const AddressCard = ({ postalCode, roadAddress, jibunAddress }: IAddressCardProps) => {
  return (
    <div className="border-border-light flex min-w-65 flex-col items-start gap-4 rounded-2xl border px-4 pt-5 pb-6 shadow-[2px_2px_10px_0px_rgba(224,224,224,0.20)]">
      <label className={styles.postalCode}>{postalCode || "우편번호"}</label>

      <div className="flex w-full items-start gap-2">
        <div className="flex items-start gap-2">
          <label className={styles.label}>도로명</label>
        </div>
        <span className={styles.addressText}>{roadAddress || "도로명 주소를 입력해주세요"}</span>
      </div>

      <div className="flex w-full items-start gap-2">
        <div className="flex items-start gap-2">
          <label className={styles.label}>지번</label>
        </div>
        <span className={styles.addressText}>{jibunAddress || "지번 주소를 입력해주세요"}</span>
      </div>

      <div className="flex w-full items-center gap-2"></div>
    </div>
  );
};

export default AddressCard;
