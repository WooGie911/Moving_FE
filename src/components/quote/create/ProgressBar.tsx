import React from "react";
import { IProgressBarProps } from "@/types/quote";

const ProgressBar = ({ value }: IProgressBarProps) => {
  // 0~100 사이로 제한
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      <div className="h-2 w-full rounded bg-gray-200">
        <div className="bg-primary-400 h-2 rounded transition-all duration-300" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
