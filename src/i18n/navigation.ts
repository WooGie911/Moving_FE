import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Next.js의 네비게이션 API를 감싸는 경량 래퍼
// 라우팅 설정을 고려한 API들
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
