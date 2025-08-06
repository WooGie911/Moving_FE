import { NextRequest, NextResponse } from "next/server";
import { decodeAccessToken } from "./utils/decodeAccessToken";
import { TUserRole } from "./types/user.types";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { logDevError } from "./utils/logDevError";

export async function middleware(request: NextRequest) {
  // next-intl 미들웨어를 먼저 처리
  const handleI18nRouting = createMiddleware(routing);

  // 루트 경로 리디렉션 처리
  if (request.nextUrl.pathname === "/") {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const isAuthenticated = !!accessToken || !!refreshToken;

    // 사용자의 언어 선호도 확인 (쿠키가 없으면 기본값 사용)
    const userLanguagePreference = request.cookies.get("user_language_preference")?.value;
    const preferredLocale =
      userLanguagePreference && routing.locales.includes(userLanguagePreference as any)
        ? userLanguagePreference
        : routing.defaultLocale;

    let userType: TUserRole | undefined = undefined;

    if (accessToken) {
      try {
        const decodedToken = await decodeAccessToken(accessToken);
        if (!decodedToken) throw new Error("Invalid token");
        userType = decodedToken?.userType as TUserRole;
      } catch (error) {
        logDevError(error, "토큰 디코딩 실패");
      }
    }

    if (isAuthenticated && userType) {
      const redirectPath =
        userType === "CUSTOMER" ? `/${preferredLocale}/searchMover` : `/${preferredLocale}/estimate/received`;
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }

  const response = handleI18nRouting(request);

  // 인증 및 권한 체크는 locale이 포함된 경로에서만 수행
  const pathname = request.nextUrl.pathname;
  const localeMatch = pathname.match(/^\/(ko|en|zh)(\/.*)?$/);

  if (!localeMatch) {
    return response;
  }

  const actualPath = localeMatch[2] || "/";
  const locale = localeMatch[1];

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!accessToken || !!refreshToken;

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

  const isAuthRoute =
    actualPath.startsWith("/userSignin") ||
    actualPath.startsWith("/userSignup") ||
    actualPath.startsWith("/moverSignin") ||
    actualPath.startsWith("/moverSignup");

  const isProtectedRoute =
    actualPath.startsWith("/profile") ||
    actualPath.startsWith("/estimateRequest") ||
    actualPath.startsWith("/estimate") ||
    actualPath.startsWith("/moverMyPage") ||
    actualPath.startsWith("/favoriteMover") ||
    actualPath.startsWith("/review");

  const isCustomerOnlyRoute =
    actualPath.startsWith("/estimateRequest") ||
    actualPath.startsWith("/favoriteMover") ||
    actualPath.startsWith("/review");

  const isMoverOnlyRoute =
    (actualPath.startsWith("/estimate") && !actualPath.startsWith("/estimateRequest")) ||
    actualPath.startsWith("/moverMyPage");

  // 일반 로그인 프로필 등록 강제 이동 (accessToken 있는 경우)
  if (isProtectedRoute && accessToken && !hasProfile && actualPath !== "/profile/register") {
    return NextResponse.redirect(new URL(`/${locale}/profile/register`, request.url));
  }

  // 소셜 로그인 프로필 등록 강제 이동 (accessToken 있는 경우)
  if (
    isAuthenticated &&
    accessToken &&
    !hasProfile &&
    (actualPath === "/searchMover" || actualPath === "/estimate/received")
  ) {
    return NextResponse.redirect(new URL(`/${locale}/profile/register`, request.url));
  }

  // 프로필 등록 페이지 접근 방지 (이미 등록된 경우)
  if (isProtectedRoute && accessToken && hasProfile && actualPath === "/profile/register") {
    const redirectPath = userType === "CUSTOMER" ? `/${locale}/searchMover` : `/${locale}/estimate/received`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 로그인/회원가입 접근 제한
  if (isAuthRoute && isAuthenticated && userType) {
    const redirectPath = userType === "CUSTOMER" ? `/${locale}/searchMover` : `/${locale}/estimate/received`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 보호 페이지 인증 안 된 유저 차단
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}/userSignin`, request.url));
  }

  // 역할 기반 차단
  if (isAuthenticated && userType) {
    if (isMoverOnlyRoute && userType === "CUSTOMER") {
      return NextResponse.redirect(new URL(`/${locale}/searchMover`, request.url));
    }

    if (isCustomerOnlyRoute && userType === "MOVER") {
      return NextResponse.redirect(new URL(`/${locale}/estimate/received`, request.url));
    }
  }

  return response;
}

export const config = {
  // next-intl과 호환되는 matcher 설정
  matcher: [
    // 모든 경로에 매치되지만 다음은 제외:
    // - api 루트 (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - robots.txt, sitemap.xml 등 루트 레벨 파일들
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
