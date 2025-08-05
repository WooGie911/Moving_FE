import { getTokenFromCookie, setTokensToCookie } from "@/utils/auth";
import authApi from "./auth.api";

// TODO? : 제네릭 any 타입을 각 api 호출의 반환 타입으로 변경? (이게 구조적으로 맞는 방식)
// TODO? : 그러나 파일이 많아지고 비용이 듬

// 토큰 만료 시 재발급 로직 구현
// 요청 api 토큰 인가 실패 -> 리프레쉬 토큰으로 재발급 로직 실행 -> 성공시 이전 요청 재시도
// 만약 리프레쉬 토큰 만료시 로그아웃 처리
export const fetchWithAuth = async <T = any>(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<T> => {
  const accessToken = await getTokenFromCookie();

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include", // refreshToken 쿠키 필요 시 포함
  });

  // 401 Unauthorized → accessToken 만료 가능성
  if (res.status === 401 && retry) {
    const refreshed = await authApi.refreshToken();

    setTokensToCookie(refreshed.accessToken);

    if (refreshed.accessToken) {
      return fetchWithAuth<T>(
        input,
        {
          ...init,
          headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${refreshed.accessToken}`,
          },
        },
        false,
      );
    }
  }

  if (res.status === 404) {
    // 🔒 refreshToken도 만료 → 로그아웃 처리
    authApi.logout();
    throw new Error("로그인이 만료되었습니다.");
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API 요청 실패");
  }

  return res.json();
};
