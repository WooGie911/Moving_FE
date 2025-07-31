import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  containerClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className = "", containerClassName = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const defaultSpinnerClass = `animate-spin rounded-full border-2 border-gray-200 border-t-primary-400 ${sizeClasses[size]}`;

  return (
    <div className={`flex items-center justify-center ${containerClassName}`}>
      <div className={`${defaultSpinnerClass} ${className}`}></div>
    </div>
  );
};

export default LoadingSpinner;
