"use server";

import { getServerSideToken } from "../actions/auth.actions";

type GetUserApiResponse = {
  success: boolean;
  data?: unknown;
};

export async function getServerUser() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users`;
  // SSR: 초기 유저 값만 안전하게 가져온다. accessToken 없으면 null 반환
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
