"use client";

import React from "react";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { SERVICE_OPTIONS, SERVICE_MAPPING } from "@/constant/profile";
import { useTranslations } from "next-intl";

interface IServiceSelectionProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  titleKey: string;
  descriptionKey?: string;
  className?: string;
}

export const ServiceSelection = ({
  selectedServices,
  onServicesChange,
  titleKey,
  descriptionKey,
  className = "",
}: IServiceSelectionProps) => {
  const t = useTranslations("profile");
  const serviceT = useTranslations("service");

  const handleServiceToggle = (serviceCode: string) => {
    onServicesChange(
      selectedServices.includes(serviceCode)
        ? selectedServices.filter((s) => s !== serviceCode)
        : [...selectedServices, serviceCode],
    );
  };

  return (
    <div className={`border-border-light flex flex-col gap-6 border-b-1 pb-4 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1">
          <span className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
            {t(titleKey)}
          </span>
          <span className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</span>
        </div>
        {descriptionKey && <span className="text-xs text-gray-400 lg:text-lg">* {t(descriptionKey)}</span>}
      </div>
      <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
        {SERVICE_OPTIONS.map((service) => {
          const serviceCode = SERVICE_MAPPING[service as keyof typeof SERVICE_MAPPING];
          return (
            <CircleTextLabel
              key={service}
              text={serviceT(service)}
              clickAble={true}
              isSelected={selectedServices.includes(serviceCode)}
              onClick={() => handleServiceToggle(serviceCode)}
            />
          );
        })}
      </div>
    </div>
  );
};
