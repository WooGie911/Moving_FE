import React from "react";
import Calendar from "../Calendar";
import { Button } from "@/components/common/button/Button";
import SpeechBubble from "../SpeechBubble";
import { IDateSectionProps } from "@/types/estimateRequest";

const DateSection: React.FC<IDateSectionProps> = ({ value, onChange, onComplete }) => (
  <SpeechBubble type="question">
    <div className="mb-4 min-w-[300px] lg:mb-6 lg:max-w-160">
      <Calendar value={value ? new Date(value) : null} onChange={(date) => onChange(date.toISOString())} />
    </div>
    <Button
      variant="solid"
      width="w-full"
      height="h-[54px]"
      rounded="rounded-[16px]"
      state={value ? "default" : "disabled"}
      disabled={!value}
      onClick={onComplete}
    >
      선택완료
    </Button>
  </SpeechBubble>
);

export default DateSection;
