import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";
import { useTranslations } from "next-intl";
import { getRegionTranslation } from "@/lib/utils/translationUtils";
import type { MoverProps } from "@/types/mover.types";

const Chip = ({ mover }: MoverProps) => {
  const t = useTranslations("mover");
  const tRegions = useTranslations("regions");
  const tService = useTranslations("service");

  return (
    <section className="flex flex-col gap-8" role="group" aria-labelledby="service-details-title">
      <h3 id="service-details-title" className="sr-only">
        서비스 상세 정보
      </h3>

      {/* 제공 서비스 */}
      <div className="flex flex-col gap-2 md:gap-4" role="group" aria-labelledby="provided-services-title">
        <h4 id="provided-services-title" className="text-lg font-semibold md:text-xl" role="heading" aria-level={4}>
          {t("providedServices")}
        </h4>
        <ul
          className="flex gap-2 md:gap-3"
          role="list"
          aria-labelledby="provided-services-title"
          aria-label={`제공 서비스 ${(mover.serviceTypes || []).length}개`}
        >
          {(mover.serviceTypes || []).map((serviceType, idx) => {
            return (
              <li key={idx} role="listitem">
                <CircleTextLabel text={tService(serviceType.service.name)} hasBorder1={true} hasBorder2={true} />
              </li>
            );
          })}
        </ul>
      </div>

      {/* 서비스 지역 */}
      <div className="flex flex-col gap-2 md:gap-4" role="group" aria-labelledby="service-areas-title">
        <h4 id="service-areas-title" className="text-lg font-semibold md:text-xl" role="heading" aria-level={4}>
          {t("serviceAreas")}
        </h4>
        <ul
          className="flex flex-wrap gap-2 md:gap-3"
          role="list"
          aria-labelledby="service-areas-title"
          aria-label={`서비스 지역 ${(mover.serviceRegions || []).length}개`}
        >
          {(mover.serviceRegions || []).map((region, idx) => {
            // currentAreas는 RegionType[] 배열이므로 region 자체가 지역 코드
            const regionCode = typeof region === "string" ? region : region.region;
            return (
              <li key={idx} role="listitem">
                <CircleTextLabel text={getRegionTranslation(regionCode, tRegions)} hasBorder1={true} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Chip;
