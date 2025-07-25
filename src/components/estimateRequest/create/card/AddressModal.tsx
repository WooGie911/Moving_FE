import React, { useState } from "react";
import AddressSearchDaum from "../AddressSearchDaum";
import AddressCard from "./AddressCard";
import { Button } from "@/components/common/button/Button";
import { BaseInput } from "@/components/common/input/BaseInput";
import { IAddressModalProps, IDaumAddress } from "@/types/estimateRequest";
import { useLanguageStore } from "@/stores/languageStore";

const AddressModal: React.FC<IAddressModalProps> = ({ onComplete }) => {
  const [baseAddress, setBaseAddress] = useState<IDaumAddress | undefined>(undefined);
  const [detailAddress, setDetailAddress] = useState("");
  const { t } = useLanguageStore();

  const handleComplete = () => {
    if (baseAddress && detailAddress) {
      onComplete({
        ...baseAddress,
        detailAddress,
      });
    }
  };

  const isFormValid = baseAddress && detailAddress;

  return (
    <div className="space-y-4">
      {/* 주소 검색 */}
      <AddressSearchDaum onComplete={setBaseAddress} />

      {/* 상세 주소 입력 */}
      {baseAddress && (
        <div className="space-y-2">
          <BaseInput
            type="text"
            placeholder={t("estimateRequest.detailAddressPlaceholder")}
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            wrapperClassName="w-full"
          />
        </div>
      )}

      {/* 선택된 주소 카드 */}
      {baseAddress && (
        <div className="my-2">
          <AddressCard
            postalCode={baseAddress.zonecode}
            roadAddress={baseAddress.roadAddress + (detailAddress ? ` ${detailAddress}` : "")}
            jibunAddress={baseAddress.jibunAddress}
            selected
          />
        </div>
      )}

      {/* 완료 버튼 */}
      {isFormValid && (
        <Button variant="solid" width="w-full" height="h-[54px]" rounded="rounded-[16px]" onClick={handleComplete}>
          {t("estimateRequest.completeSelection")}
        </Button>
      )}
    </div>
  );
};

export default AddressModal;
