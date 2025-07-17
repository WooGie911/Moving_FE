import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";
import { getRegionLabel } from "@/lib/utils/regionMapping";
import { MoverProps } from "@/types/moverDetail";

const Chip = ({ mover }: MoverProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="text-lg font-semibold md:text-xl">제공 서비스</p>
        <div className="flex gap-2 md:gap-3">
          {mover.serviceTypes.map((serviceType, idx) => (
            <CircleTextLabel key={idx} text={serviceType.service?.name} hasBorder1={true} hasBorder2={true} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="text-lg font-semibold md:text-xl">서비스 가능 지역</p>
        <div className="flex gap-2 md:gap-3">
          {mover.serviceRegions.map((region, idx) => {
            const regionCode = region.region;
            return <CircleTextLabel key={idx} text={getRegionLabel(regionCode)} hasBorder1={true} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Chip;
