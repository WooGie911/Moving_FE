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
  const localeMatch = pathname.match(/^\/(ko|en|zh)(\/.*)?$/);
  const actualPath = localeMatch?.[2] || "/";
  const locale = localeMatch?.[1] || "ko";

  const { accessToken, refreshToken, userType, hasProfile, isAuthenticated } =
    await getUserFromAccessOrRefreshToken(request);

  const isAuthRoute =
    actualPath.startsWith(`/userSignin`) ||
    actualPath.startsWith(`/userSignup`) ||
    actualPath.startsWith(`/moverSignin`) ||
    actualPath.startsWith(`/moverSignup`);

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

  // ✅ 루트 or 인증 경로에서 리프레시 토큰이 있다면 자동 리다이렉트
  if (refreshToken && isRootOrAuthRoute(actualPath)) {
    if (userType) {
      return NextResponse.redirect(new URL(getRedirectPathByUserType(userType, locale), request.url));
    }
  }

  // ✅ 일반 로그인 → 프로필 미등록 보호 페이지 접근 시
  if (isProtectedRoute && accessToken && !hasProfile && actualPath !== "/profile/register") {
    return NextResponse.redirect(new URL(`/${locale}/profile/register`, request.url));
  }

  // ✅ 소셜 로그인 후 최초 진입 시 등록 강제
  if (
    isAuthenticated &&
    accessToken &&
    !hasProfile &&
    (actualPath === "/searchMover" || actualPath === "/estimate/received")
  ) {
    return NextResponse.redirect(new URL(`/${locale}/profile/register`, request.url));
  }

  // ✅ 등록된 유저가 /profile/register 접근 시 리다이렉트
  if (isProtectedRoute && accessToken && hasProfile && actualPath === "/profile/register") {
    const redirectPath = getRedirectPathByUserType(userType!, locale);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ✅ 인증된 유저가 로그인/회원가입 페이지 접근 시 차단
  if (isAuthRoute && isAuthenticated && userType) {
    const redirectPath = getRedirectPathByUserType(userType, locale);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ✅ 보호 페이지인데 비로그인 상태일 경우 로그인 페이지로
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}/userSignin`, request.url));
  }

  // ✅ 역할 기반 보호
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
