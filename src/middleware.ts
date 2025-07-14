// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeAccessToken, DecodedTokenPayload } from "./utils/decodeAccessToken";

// ✅ 미들웨어 엔트리 함수
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ 쿠키에서 토큰 가져오기
  const accessToken = request.cookies.get("accessToken")?.value;

  console.log("Middleware - accessToken:", request.cookies);

  /**
   * ✅ 토큰 기반 유저 역할 추출
   * - accessToken이 존재하면 decode하여 role 추출
   * - 없으면 undefined
   */
  let userRole: "CUSTOMER" | "MOVER" | undefined;
  let decodedToken: DecodedTokenPayload | null = null;

  if (accessToken) {
    try {
      decodedToken = await decodeAccessToken(accessToken);
      userRole = decodedToken?.role;
    } catch (error) {
      console.error("Token decoding failed", error);
    }
  }

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
   * ✅ 인증된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리디렉션
   */
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
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
  if (isAuthenticated && userRole) {
    // 기사 전용 페이지에 고객이 접근하는 경우
    if (isMoverOnlyRoute && userRole === "CUSTOMER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 고객 전용 페이지에 기사가 접근하는 경우
    if (isCustomerOnlyRoute && userRole === "MOVER") {
      return NextResponse.redirect(new URL("/", request.url));
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
