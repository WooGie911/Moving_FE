import { Button } from "@/components/common/button/Button";
import React from "react";
import { useTranslations } from "next-intl";

export const LgButtonSection = ({ estimatePrice }: { estimatePrice: string }) => {
  const t = useTranslations("estimateRequest");

  return (
    <div className="hidden lg:block">
      <div className="flex flex-col items-start justify-center gap-7">
        <div>
          <p className="text-[18px] leading-[26px] font-semibold text-gray-300">{t("estimatePrice")}</p>
          <p className="text-black-300 text-[24px] leading-[32px] font-bold">{`${estimatePrice}${t("shared.units.currency")}`}</p>
        </div>
        <Button variant="solid" width="w-[320px]" height="h-[64px]" rounded="rounded-[16px]">
          {t("confirmEstimateButton")}
        </Button>
      </div>
    </div>
  );
};
