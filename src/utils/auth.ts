import { getServerSideToken } from "@/lib/actions/auth.actions";

export async function getTokenFromCookie(type = "accessToken") {
  if (typeof document === "undefined") {
    return getServerSideToken(type);
  }

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${type}=`));
  return tokenCookie ? tokenCookie.trim().split("=")[1] : null;
}

/**
 * 사용자가 인증되었는지 확인하는 함수
 * @returns {boolean} 인증 여부
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookie();
  return !!token;
}
