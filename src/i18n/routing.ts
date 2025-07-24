import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // 지원하는 모든 로케일 목록
  locales: ["ko", "en", "zh"],

  // 로케일이 일치하지 않을 때 사용
  defaultLocale: "ko",
});
