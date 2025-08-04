import React, { useCallback } from "react";
import { useModal } from "@/components/common/modal/ModalContext";
import { useTranslations } from "next-intl";
import AddressModal from "@/components/estimateRequest/create/card/AddressModal";
import { TAddressType, IDaumAddress } from "@/types/estimateRequest";

export const useEstimateRequestAddressModal = (
  onAddressUpdate: (type: TAddressType, address: IDaumAddress) => void,
) => {
  const { open, close } = useModal();
  const t = useTranslations();

  // 주소 모달 열기 핸들러
  const handleOpenAddressModal = useCallback(
    (type: TAddressType) => {
      // 번역 키를 직접 계산하여 중첩 번역 호출 문제 해결
      const placeText = type === "departure" ? t("estimateRequest.departure") : t("estimateRequest.arrival");

      open({
        title: t("estimateRequest.selectAddressTitle", { place: placeText }),
        children: (
          <AddressModal
            onComplete={(addr) => {
              onAddressUpdate(type, addr);
              close();
            }}
            onClose={close}
          />
        ),
        buttons: [],
      });
    },
    [open, close, t, onAddressUpdate],
  );

  // 주소 모달 핸들러들
  const handleDepartureModal = useCallback(() => handleOpenAddressModal("departure"), [handleOpenAddressModal]);
  const handleArrivalModal = useCallback(() => handleOpenAddressModal("arrival"), [handleOpenAddressModal]);

  return {
    handleOpenAddressModal,
    handleDepartureModal,
    handleArrivalModal,
  };
};
