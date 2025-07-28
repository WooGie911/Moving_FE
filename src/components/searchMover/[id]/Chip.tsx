import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";
import { useTranslations } from "next-intl";
import { getRegionLabel } from "@/lib/utils/regionMapping";
import { getServiceTypeTranslation, getRegionTranslation } from "@/lib/utils/translationUtils";
import type { MoverProps } from "@/types/mover.types";

const Chip = ({ mover }: MoverProps) => {
  const t = useTranslations("mover");
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="text-lg font-semibold md:text-xl">{t("providedServices")}</p>
        <div className="flex gap-2 md:gap-3">
          {(mover.serviceTypes || []).map((serviceType, idx) => {
            const serviceName = typeof serviceType === "string" ? serviceType : serviceType.service?.name || "기타";

            return (
              <CircleTextLabel
                key={idx}
                text={getServiceTypeTranslation(serviceName, t)}
                hasBorder1={true}
                hasBorder2={true}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="text-lg font-semibold md:text-xl">{t("serviceAreas")}</p>
        <div className="flex gap-2 md:gap-3">
          {(mover.serviceRegions || []).map((region, idx) => {
            const regionCode = region.region;
            return <CircleTextLabel key={idx} text={getRegionTranslation(regionCode, t)} hasBorder1={true} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Chip;
