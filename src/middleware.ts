import { NextRequest, NextResponse } from "next/server";
import { decodeAccessToken, decodeRefreshToken } from "./utils/decodeAccessToken";
import { TUserRole } from "./types/user.types";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { logDevError } from "./utils/logDevError";

function getRedirectPathByUserType(userType: TUserRole, locale: string) {
  return userType === "CUSTOMER" ? `/${locale}/searchMover` : `/${locale}/estimate/received`;
}

function isRootOrAuthRoute(actualPath: string) {
  return ["/", "/userSignin", "/userSignup", "/moverSignin", "/moverSignup"].includes(actualPath);
}

async function getUserFromAccessOrRefreshToken(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!accessToken || !!refreshToken;

  let userType: TUserRole | undefined;
  let hasProfile: boolean | undefined;

  try {
    if (accessToken) {
      const decoded = await decodeAccessToken(accessToken);
      userType = decoded?.userType;
      hasProfile = decoded?.hasProfile;
    } else if (refreshToken) {
      const decoded = await decodeRefreshToken(refreshToken);
      userType = decoded?.userType;
      hasProfile = decoded?.hasProfile;
    }
  } catch (error) {
    logDevError(error, "토큰 디코딩 실패");
  }

  return { accessToken, refreshToken, userType, hasProfile, isAuthenticated };
}

export async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  const pathname = request.nextUrl.pathname;

  // ✅ 루트 경로 접근 처리
  if (pathname === "/") {
    const accessToken = request.cookies.get("accessToken")?.value;
    // const refreshToken = request.cookies.get("refreshToken")?.value; // kept for potential future use

    const userLanguagePreference = request.cookies.get("user_language_preference")?.value;
    const preferredLocale =
      userLanguagePreference && routing.locales.includes(userLanguagePreference as (typeof routing.locales)[number])
        ? userLanguagePreference
        : routing.defaultLocale;

    let userType: TUserRole | undefined;

    if (accessToken) {
      try {
        const decodedToken = await decodeAccessToken(accessToken);
        if (!decodedToken) throw new Error("Invalid token");
        userType = decodedToken?.userType as TUserRole;
      } catch (error) {
        logDevError(error, "토큰 디코딩 실패");
      }
    }

    // 루트에서의 자동 분기는 accessToken 기준으로만 수행
    if (accessToken && userType) {
      const redirectPath =
        userType === "CUSTOMER" ? `/${preferredLocale}/searchMover` : `/${preferredLocale}/estimate/received`;
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }

  // ✅ locale 경로가 아닌 경우는 i18n만 처리하고 반환
  const localeMatch = pathname.match(/^\/(ko|en|zh)(\/.*)?$/);
  if (!localeMatch) return response;

  const actualPath = localeMatch[2] || "/";
  const locale = localeMatch[1];

  const { accessToken, userType, hasProfile } = await getUserFromAccessOrRefreshToken(request);

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

  // ✅ 루트 or 인증 경로 자동 리다이렉트는 accessToken 기준으로만 처리
  if (accessToken && isRootOrAuthRoute(actualPath) && userType) {
    return NextResponse.redirect(new URL(getRedirectPathByUserType(userType, locale), request.url));
  }

  // ✅ 일반 로그인 → 프로필 미등록 보호 페이지 접근 시
  if (isProtectedRoute && accessToken && !hasProfile && actualPath !== "/profile/register") {
    return NextResponse.redirect(new URL(`/${locale}/profile/register`, request.url));
  }

  // ✅ 소셜 로그인 후 최초 진입 시 등록 강제
  if (accessToken && !hasProfile && (actualPath === "/searchMover" || actualPath === "/estimate/received")) {
    return NextResponse.redirect(new URL(`/${locale}/profile/register`, request.url));
  }

  // ✅ 등록된 유저가 /profile/register 접근 시 리다이렉트
  if (isProtectedRoute && accessToken && hasProfile && actualPath === "/profile/register") {
    const redirectPath = getRedirectPathByUserType(userType!, locale);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ✅ 인증된 유저가 로그인/회원가입 페이지 접근 시 차단
  if (isAuthRoute && accessToken && userType) {
    const redirectPath = getRedirectPathByUserType(userType, locale);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ✅ 보호 페이지 접근은 accessToken 존재가 필수 (refreshToken만으로는 허용하지 않음)
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL(`/${locale}/userSignin`, request.url));
  }

  // ✅ 역할 기반 보호
  if (accessToken && userType) {
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
