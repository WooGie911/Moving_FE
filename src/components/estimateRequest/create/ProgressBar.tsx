interface IProgressBarProps {
  value: number;
  "aria-labelledby"?: string;
}

const ProgressBar: React.FC<IProgressBarProps> = ({ value, "aria-labelledby": ariaLabelledby }) => {
  // 진행률을 0-100 범위로 제한
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-labelledby={ariaLabelledby}
    >
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="bg-primary-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="sr-only">진행률 {clampedValue}%</span>
    </div>
  );
};

export default ProgressBar;
