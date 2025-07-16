"use server";

import { cookies } from "next/headers";

// 서버 사이드 전용 함수
export async function getServerSideToken(type: string) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(type);
  return tokenCookie ? tokenCookie.value : null;
}

export async function setServerSideTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  // 토큰 디코딩 및 만료 시간 계산
  const accessTokenData = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());
  const refreshTokenData = JSON.parse(Buffer.from(refreshToken.split(".")[1], "base64url").toString());

  const accessTokenExpiresIn = accessTokenData.exp - Math.floor(Date.now() / 1000);
  const refreshTokenExpiresIn = refreshTokenData.exp - Math.floor(Date.now() / 1000);

  // 쿠키 설정
  cookieStore.set("accessToken", accessToken, {
    path: "/",
    maxAge: accessTokenExpiresIn,
    sameSite: "strict",
  });

  cookieStore.set("refreshToken", refreshToken, {
    path: "/",
    maxAge: refreshTokenExpiresIn,
    sameSite: "strict",
  });
}

export async function updateAccessToken(accessToken: string) {
  const cookieStore = await cookies();

  // 토큰 디코딩 및 만료 시간 계산
  const accessTokenData = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString());

  const accessTokenExpiresIn = accessTokenData.exp - Math.floor(Date.now() / 1000);

  // 액세스 토큰만 갱신
  cookieStore.set("accessToken", accessToken, {
    path: "/",
    maxAge: accessTokenExpiresIn,
    sameSite: "strict",
  });
}

export async function clearServerSideTokens() {
  const cookieStore = await cookies();

  // 액세스 토큰 삭제
  cookieStore.delete("accessToken");

  // 리프레시 토큰 삭제
  cookieStore.delete("refreshToken");

  return { success: true };
}
