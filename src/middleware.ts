// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeAccessToken, DecodedTokenPayload } from "./lib/utils/decodeAccessToken";

// ✅ 미들웨어 엔트리 함수
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //   // ✅ 쿠키에서 토큰 가져오기
  //   const accessToken = request.cookies.get("accessToken")?.value;
  //   const refreshToken = request.cookies.get("refreshToken")?.value;

  //   /**
  //    * ✅ 토큰 기반 유저 역할 추출
  //    * - accessToken이 존재하면 decode하여 role 추출
  //    * - 없으면 undefined
  //    */
  //   let userRole: "USER" | "ADMIN" | undefined;
  //   let decodedToken: DecodedTokenPayload | null = null;

  //   if (accessToken) {
  //     try {
  //       decodedToken = await decodeAccessToken(accessToken);
  //       userRole = decodedToken?.role;
  //     } catch (error) {
  //       console.error("Token decoding failed", error);
  //     }
  //   }

  //   // ✅ 인증 상태
  //   const isAuthenticated = !!refreshToken;

  //   // ✅ 경로별 플래그
  //   const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  //   const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/profile");

  //   const isAdminRoute = pathname.startsWith("/admin");

  //   const isAutoLoginPage = pathname.startsWith("/refresh-login");

  //   /**
  //    * ✅ 인증된 사용자가 루트("/")에 접근하면 dashboard로 리디렉션
  //    */
  //   if (pathname === "/" && isAuthenticated) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }

  //   /**
  //    * ✅ 관리자 권한 없을 시 /admin 접근 차단
  //    */
  //   if (isAdminRoute && userRole !== "ADMIN") {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }

  //   /**
  //    * ✅ refreshToken만 있을 때 자동 로그인 경로로 유도
  //    */
  //   if (!accessToken && refreshToken && !isAutoLoginPage && !isAuthRoute) {
  //     return NextResponse.redirect(new URL("/refresh-login", request.url));
  //   }

  //   /**
  //    * ✅ 인증된 사용자가 로그인/회원가입 페이지 접근 시 dashboard로 리디렉션
  //    */
  //   if (isAuthRoute && isAuthenticated) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }

  //   /**
  //    * ✅ 인증되지 않은 사용자가 보호 페이지 접근 시 로그인으로
  //    */
  //   if (isProtectedRoute && !isAuthenticated) {
  //     return NextResponse.redirect(new URL("/sign-in", request.url));
  //   }

  //   /**
  //    * ✅ 모든 조건을 통과하면 그대로 진행
  //    */
  return NextResponse.next();
}

// ✅ 미들웨어 적용 경로 설정
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // API, static, favicon 제외 전체 경로에 적용
  ],
};
