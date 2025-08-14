"use client";

import React from "react";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { useTranslations } from "next-intl";

interface IProfileEditServiceSelectionProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  serviceOptions: string[];
  serviceMapping: { [key: string]: string };
  titleKey: string;
  descriptionKey: string;
  className?: string;
}

export const ProfileEditServiceSelection = ({
  selectedServices,
  onServicesChange,
  serviceOptions,
  serviceMapping,
  titleKey,
  descriptionKey,
  className = "",
}: IProfileEditServiceSelectionProps) => {
  const t = useTranslations("profile");
  const moverT = useTranslations("mover");

  return (
    <fieldset className={`border-border-light flex flex-col gap-6 border-b-1 pb-6 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1">
          <span className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
            {t(titleKey)}
          </span>
          <span className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</span>
        </div>
        <span className="text-xs text-gray-400 lg:text-lg">* {t(descriptionKey)}</span>
      </div>
      <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
        {serviceOptions.map((service) => {
          const serviceCode = serviceMapping[service as keyof typeof serviceMapping];
          return (
            <CircleTextLabel
              key={service}
              text={moverT(`serviceTypes.${service}`)}
              clickAble={true}
              isSelected={selectedServices.includes(serviceCode)}
              onClick={() => {
                onServicesChange(
                  selectedServices.includes(serviceCode)
                    ? selectedServices.filter((s) => s !== serviceCode)
                    : [...selectedServices, serviceCode],
                );
              }}
            />
          );
        })}
      </div>
    </fieldset>
  );
};
