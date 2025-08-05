"use server";

import { cookies } from "next/headers";

// 서버 사이드 전용 함수
export async function getServerSideToken(type: string) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(type);
  return tokenCookie ? tokenCookie.value : null;
}

export async function clearServerSideTokens() {
  const cookieStore = await cookies();

  // 액세스 토큰 삭제
  cookieStore.delete("accessToken");
  // 리프레시 토큰 삭제
  cookieStore.delete("refreshToken");

  return { success: true };
}
