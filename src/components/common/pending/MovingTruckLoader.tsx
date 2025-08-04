import React from "react";
import Image from "next/image";
import CarLg from "@/assets/img/etc/car-lg.webp";
interface MovingTruckLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  loadingText?: string;
}

const MovingTruckLoader: React.FC<MovingTruckLoaderProps> = ({ size = "md", className = "", loadingText = "" }) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center ${className}`}>
      {/* 트럭이 움직이는 애니메이션 컨테이너 */}
      <div className="relative w-full max-w-md overflow-hidden">
        {/* 도로 배경 */}
        <div className="absolute right-0 bottom-0 left-0 h-3 rounded-full bg-gray-300"></div>

        {/* 트럭 이미지 */}
        <div className="animate-truck-move relative">
          <Image
            src={CarLg}
            alt="움직이는 트럭"
            width={120}
            height={90}
            className={`${sizeClasses[size]} object-contain`}
          />
        </div>

        {/* 먼지 효과 */}
        <div className="absolute right-0 bottom-3 left-0 flex justify-center">
          <div className="animate-dust-1 h-1 w-1 rounded-full bg-gray-400 opacity-60"></div>
          <div className="animate-dust-2 mx-1 h-1 w-1 rounded-full bg-gray-400 opacity-60"></div>
          <div className="animate-dust-3 h-1 w-1 rounded-full bg-gray-400 opacity-60"></div>
        </div>
      </div>

      {/* 로딩 텍스트 */}
      <p className="mt-6 animate-pulse text-base font-medium text-gray-600">{loadingText}</p>
    </div>
  );
};

export default MovingTruckLoader;
