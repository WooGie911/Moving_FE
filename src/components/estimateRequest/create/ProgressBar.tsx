import React from "react";
import { IProgressBarProps } from "@/types/estimateRequest";

const ProgressBar: React.FC<IProgressBarProps> = ({ value }) => {
  // 진행률을 0-100 범위로 제한
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="bg-primary-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
