import React from "react";

interface IProgressBarProps {
  value: number; // 0~100 (진행률 %)
  label?: string; // (선택) 프로그래스바 위에 표시할 텍스트
}

const ProgressBar = ({ value, label }: IProgressBarProps) => {
  return (
    <div className="w-full items-center justify-center bg-white p-6 lg:p-8">
      {label && <div className="text-black-400 mb-4 text-2xl leading-[26px] font-semibold">{label}</div>}
      <div className="h-2 w-full rounded bg-gray-200">
        <div className="bg-primary-400 h-2 rounded" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
