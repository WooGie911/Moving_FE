import React, { useCallback } from "react";
import { useModal } from "@/components/common/modal/ModalContext";
import { useLanguageStore } from "@/stores/languageStore";
import AddressModal from "@/components/estimateRequest/create/card/AddressModal";
import { TAddressType } from "@/types/estimateRequest";

export const useEstimateRequestAddressModal = (onAddressUpdate: (type: TAddressType, address: any) => void) => {
  const { open, close } = useModal();
  const { t } = useLanguageStore();

  // 주소 모달 열기 핸들러
  const handleOpenAddressModal = useCallback(
    (type: TAddressType) => {
      open({
        title: t("estimateRequest.selectAddressTitle", { place: t(`estimateRequest.${type}`) }),
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
