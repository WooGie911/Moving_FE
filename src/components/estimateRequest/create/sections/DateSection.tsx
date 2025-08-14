import React, { useCallback } from "react";
import Calendar from "../Calendar";
import { Button } from "@/components/common/button/Button";
import { IDateSectionProps } from "@/types/estimateRequest";
import { useTranslations } from "next-intl";

const DateSection: React.FC<IDateSectionProps> = ({ value, onChange, onComplete, className }) => {
  const t = useTranslations();

  const handleDateSelect = useCallback(
    (date: Date) => {
      const formattedDate = date.toISOString().split("T")[0];
      onChange(formattedDate);
    },
    [onChange],
  );

  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="space-y-4">
      <Calendar value={selectedDate} onChange={handleDateSelect} className={className} />

      {value && (
        <Button variant="solid" width="w-full" height="h-[54px]" rounded="rounded-[16px]" onClick={onComplete}>
          {t("estimateRequest.completeSelection")}
        </Button>
      )}
    </div>
  );
};

export default DateSection;
