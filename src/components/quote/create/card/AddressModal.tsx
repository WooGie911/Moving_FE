import React, { useState } from "react";
import AddressSearchDaum from "./AddressSearchDaum";
import AddressCard from "./AddressCard";
import { Button } from "@/components/common/button/Button";
import { BaseInput } from "@/components/common/input/BaseInput";
import { IAddressModalProps, IDaumAddress } from "@/types/quote";

const AddressModal: React.FC<IAddressModalProps> = ({ onComplete, onClose }) => {
  const [base, setBase] = useState<IDaumAddress | null>(null);
  const [detail, setDetail] = useState("");

  const handleComplete = () => {
    if (base && detail) {
      onComplete({ ...base, detailAddress: detail });
    }
  };

  return (
    <div>
      <AddressSearchDaum onComplete={setBase} />
      {base && (
        <>
          <div className="mt-2">
            <BaseInput
              type="text"
              placeholder="상세주소 (예: 101동 202호)"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              inputClassName="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="my-2">
            <AddressCard
              postalCode={base.zonecode}
              roadAddress={base.roadAddress + (detail ? ` ${detail}` : "")}
              jibunAddress={base.jibunAddress}
              selected
            />
          </div>
        </>
      )}
      {base && (
        <Button
          variant="solid"
          width="w-full"
          height="h-[54px]"
          rounded="rounded-[16px]"
          disabled={!base || !detail}
          onClick={handleComplete}
        >
          선택완료
        </Button>
      )}
    </div>
  );
};

export default AddressModal;
