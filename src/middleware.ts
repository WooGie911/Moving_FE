import { NextRequest, NextResponse } from "next/server";
import { decodeAccessToken } from "./utils/decodeAccessToken";
import { TUserRole } from "./types/user.types";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing"; // ✅ default export 확인

// ✅ 로케일 prefix 붙이기 유틸
function withLocalePrefix(path: string, locale: string) {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

function extractLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split("/");
  const candidate = segments[1];
  if (["ko", "en", "zh"].includes(candidate)) return candidate;
  return null;
}

export async function middleware(request: NextRequest) {
  const rawPathname = request.nextUrl.pathname;
  const pathname = rawPathname.replace(/^\/(ko|en|zh)/, "") || "/";

  const localeFromPath = extractLocaleFromPathname(rawPathname);
  const localeFromCookie = request.cookies.get("NEXT_LOCALE")?.value;
  const acceptLanguage = request.headers.get("accept-language");
  const preferredLocale = acceptLanguage?.split(",")[0]?.split("-")[0];

  const locale =
    localeFromPath ||
    (["ko", "en", "zh"].includes(localeFromCookie ?? "") ? localeFromCookie : undefined) ||
    (["ko", "en", "zh"].includes(preferredLocale ?? "") ? preferredLocale : undefined) ||
    "ko";

  const accessToken = request.cookies.get("accessToken")?.value;

  let userType: TUserRole | undefined = undefined;
  let hasProfile: boolean | undefined = undefined;

  if (accessToken) {
    try {
      const decodedToken = await decodeAccessToken(accessToken);
      if (!decodedToken) throw new Error("Invalid token");
      userType = decodedToken?.userType as TUserRole;
      hasProfile = decodedToken?.hasProfile as boolean;
    } catch (error) {
      console.error("❌ 토큰 디코딩 실패:", error);
    }
  }

  console.log("accessToken", accessToken);

  const isAuthenticated = !!accessToken;

  // ✅ 루트 경로 접근 제어 (next-intl보다 먼저 처리)
  if (rawPathname === "/") {
    if (isAuthenticated && userType) {
      const redirectPath =
        userType === "CUSTOMER"
          ? withLocalePrefix("/searchMover", locale)
          : withLocalePrefix("/estimate/received", locale);
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // ✅ next-intl 미들웨어 (로케일 prefix 붙이기)
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  const isAuthRoute =
    pathname.startsWith("/userSignin") ||
    pathname.startsWith("/userSignup") ||
    pathname.startsWith("/moverSignin") ||
    pathname.startsWith("/moverSignup");

  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/estimateRequest") ||
    pathname.startsWith("/estimate") ||
    pathname.startsWith("/moverMyPage") ||
    pathname.startsWith("/favoriteMover") ||
    pathname.startsWith("/review");

  const isCustomerOnlyRoute =
    pathname.startsWith("/estimateRequest") || pathname.startsWith("/favoriteMover") || pathname.startsWith("/review");

  const isMoverOnlyRoute =
    (pathname.startsWith("/estimate") && !pathname.startsWith("/estimateRequest")) ||
    pathname.startsWith("/moverMyPage");

  // ✅ 일반 로그인 프로필 등록 강제 이동
  if (isProtectedRoute && !hasProfile && pathname !== "/profile/register") {
    return NextResponse.redirect(new URL(withLocalePrefix("/profile/register", locale), request.url));
  }

  // ✅ 소셜 로그인 프로필 등록 강제 이동
  if (!hasProfile && (pathname === "/searchMover" || pathname === "/estimate/received")) {
    return NextResponse.redirect(new URL(withLocalePrefix("/profile/register", locale), request.url));
  }

  // ✅ 프로필 등록 페이지 접근 방지 (이미 등록된 경우)
  if (isProtectedRoute && hasProfile && pathname === "/profile/register") {
    const redirectPath =
      userType === "CUSTOMER"
        ? withLocalePrefix("/searchMover", locale)
        : withLocalePrefix("/estimate/received", locale);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ✅ 로그인/회원가입 접근 제한
  if (isAuthRoute && isAuthenticated && userType) {
    const redirectPath =
      userType === "CUSTOMER"
        ? withLocalePrefix("/searchMover", locale)
        : withLocalePrefix("/estimate/received", locale);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ✅ 보호 페이지 인증 안 된 유저 차단
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(withLocalePrefix("/userSignin", locale), request.url));
  }

  // ✅ 역할 기반 차단
  if (isAuthenticated && userType) {
    if (isMoverOnlyRoute && userType === "CUSTOMER") {
      return NextResponse.redirect(new URL(withLocalePrefix("/searchMover", locale), request.url));
    }

    if (isCustomerOnlyRoute && userType === "MOVER") {
      return NextResponse.redirect(new URL(withLocalePrefix("/estimate/received", locale), request.url));
    }
  }

  return response;
}

// ✅ 미들웨어가 작동할 경로 정의
export const config = {
  matcher: ["/((?!_next|favicon.ico|api|static).*)"], // 내부 자산 제외
};
