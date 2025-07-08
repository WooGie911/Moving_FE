"use client"

import { TDeviceType } from "@/types/deviceType";
import throttle from "lodash.throttle";
import { useState, useEffect } from "react";

/**
 * 현재 window의 가로 넓이를 반환하는 커스텀 훅 (throttle 적용)
 *
 * 사용 예시:
 * const windowWidth = useWindowWidth();
 * useEffect(() => {
 *   if (windowWidth >= BREAKPOINTS.lg) { ... }
 * }, [windowWidth]);
 */

const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
};

export const useWindowWidth = (): TDeviceType => {
  const [deviceType, setDeviceType] = useState<TDeviceType>("desktop");

  useEffect(() => {
    const handleResize = throttle(() => {
      setDeviceType(
        window.innerWidth < BREAKPOINTS.tablet
          ? "mobile"
          : window.innerWidth < BREAKPOINTS.desktop
            ? "tablet"
            : "desktop",
      );
    }, 200); // 200ms 쓰로틀링

    handleResize(); // mount 시 초기 width 설정
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel(); // 메모리 누수 방지
    };
  }, []);

  return deviceType;
};
