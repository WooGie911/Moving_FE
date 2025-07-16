import { getServerSideToken, setServerSideTokens } from "@/lib/actions/auth.actions";

/**
 * accessToken을 쿠키에 저장하는 함수
 * @param {string} accessToken - JWT 액세스 토큰
 */
export function setTokensToCookie(accessToken: string) {
  if (typeof window === "undefined") {
    return setServerSideTokens(accessToken);
  }

  console.log(accessToken);

  const accessTokenData = JSON.parse(atob(accessToken.split(".")[1]));

  const accessTokenExpiresIn = accessTokenData.exp - Math.floor(Date.now() / 1000);

  document.cookie = `accessToken=${accessToken}; path=/; max-age=${accessTokenExpiresIn}; SameSite=Strict`;
}

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
export function isAuthenticated() {
  return !!getTokenFromCookie();
}
