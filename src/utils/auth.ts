import { getServerSideToken, setServerSideTokens } from "@/lib/actions/auth.actions";

const base64UrlDecode = (input: string): string => {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4;
  if (pad) input += "=".repeat(4 - pad); // 패딩 추가
  return atob(input);
};

/**
 * accessToken을 쿠키에 저장하는 함수
 * @param {string} accessToken - JWT 액세스 토큰
 */
export function setTokensToCookie(accessToken: string) {
  if (typeof window === "undefined") {
    return setServerSideTokens(accessToken);
  }

  try {
    const accessTokenPayload = base64UrlDecode(accessToken.split(".")[1]);
    const accessTokenData = JSON.parse(accessTokenPayload);

    const accessTokenExpiresIn = accessTokenData.exp - Math.floor(Date.now() / 1000);

    document.cookie = `accessToken=${accessToken}; path=/; max-age=${accessTokenExpiresIn}; SameSite=Strict; Secure`;
  } catch (error) {
    console.error("❌ Failed to decode JWT:", error);
  }
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
export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookie();
  return !!token;
}
