// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeAccessToken, DecodedTokenPayload } from "./utils/decodeAccessToken";
import { TUserRole } from "./types/user.types";

// ✅ 미들웨어 엔트리 함수
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ 쿠키에서 토큰 가져오기
  const accessToken = request.cookies.get("accessToken")?.value;

  /**
   * ✅ 토큰 기반 유저 역할 추출
   * - accessToken이 존재하면 decode하여 role 추출
   * - 없으면 undefined
   */
  let userType: TUserRole | undefined = undefined;
  let nickname: string | undefined = undefined;
  let decodedToken: DecodedTokenPayload | null = null;

  if (accessToken) {
    try {
      decodedToken = await decodeAccessToken(accessToken);
      userType = decodedToken?.userType as TUserRole;
      nickname = decodedToken?.nickname as string;
    } catch (error) {
      console.error("❌ 토큰 디코딩 실패:", error);
    }
  }

  console.log("nickname", nickname);

  // ✅ 인증 상태
  const isAuthenticated = !!accessToken;

  // ✅ 경로별 플래그
  const isAuthRoute =
    pathname.startsWith("/userSignin") ||
    pathname.startsWith("/userSignup") ||
    pathname.startsWith("/moverSignin") ||
    pathname.startsWith("/moverSignup");

  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/quote") ||
    pathname.startsWith("/estimate") ||
    pathname.startsWith("/moverMyPage") ||
    pathname.startsWith("/favoriteMover") ||
    pathname.startsWith("/review");

  const isMoverOnlyRoute = pathname.startsWith("/estimate") || pathname.startsWith("/moverMyPage");

  const isCustomerOnlyRoute =
    pathname.startsWith("/quote") || pathname.startsWith("/favoriteMover") || pathname.startsWith("/review");

  /**
   * 프로필 미등록시 프로필 등록 페이지로 리디렉션
   * (단, 이미 프로필 등록 페이지에 있는 경우 제외)
   */
  if (isProtectedRoute && !nickname && pathname !== "/profile/register") {
    return NextResponse.redirect(new URL("/profile/register", request.url));
  }

  /**
   * ✅ 홈 페이지 접근 제어 (GUEST 전용)
   * 인증된 사용자가 홈에 접근하면 역할에 따라 리디렉션
   */

  if (pathname === "/" && isAuthenticated && userType) {
    if (userType === "CUSTOMER") {
      return NextResponse.redirect(new URL("/searchMover", request.url));
    }
    if (userType === "MOVER") {
      console.log("MOVER 접근");
      return NextResponse.redirect(new URL("/estimate/received", request.url));
    }
  }

  /**
   * ✅ 인증된 사용자가 로그인/회원가입 페이지 접근 시 역할별 페이지로 리디렉션
   */
  if (isAuthRoute && isAuthenticated && userType) {
    if (userType === "CUSTOMER") {
      return NextResponse.redirect(new URL("/searchMover", request.url));
    }
    if (userType === "MOVER") {
      return NextResponse.redirect(new URL("/estimate/received", request.url));
    }
  }

  /**
   * ✅ 인증되지 않은 사용자가 보호 페이지 접근 시 로그인으로
   */
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/userSignin", request.url));
  }

  /**
   * ✅ 역할 기반 접근 제어
   */
  if (isAuthenticated && userType) {
    // 기사 전용 페이지에 고객이 접근하는 경우
    if (isMoverOnlyRoute && userType === "CUSTOMER") {
      return NextResponse.redirect(new URL("/searchMover", request.url));
    }

    // 고객 전용 페이지에 기사가 접근하는 경우
    if (isCustomerOnlyRoute && userType === "MOVER") {
      return NextResponse.redirect(new URL("/estimate/received", request.url));
    }
  }

  /**
   * ✅ 모든 조건을 통과하면 그대로 진행
   */
  return NextResponse.next();
}

// ✅ 미들웨어 적용 경로 설정
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // API, static, favicon 제외 전체 경로에 적용
  ],
};
