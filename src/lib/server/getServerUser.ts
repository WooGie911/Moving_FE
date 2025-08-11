"use server";

import { getServerSideToken } from "../actions/auth.actions";

type GetUserApiResponse = {
  success: boolean;
  data?: unknown;
};

export async function getServerUser() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users`;
  // SSR: 최초 접속 시 초기 유저 값만 안전하게 가져온다.
  // 인증 실패(401) 등은 예외를 던지지 않고 null을 반환해 에러 페이지 전파를 방지한다.
  const accessToken = await getServerSideToken("accessToken");
  if (!accessToken) return null;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data: GetUserApiResponse = await res.json();
    if (!data || data.success === false) return null;

    return (data.data as unknown) ?? null;
  } catch {
    return null;
  }
}
