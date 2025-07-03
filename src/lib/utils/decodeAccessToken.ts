import { jwtVerify, JWTPayload } from "jose";

// 커스텀 토큰 payload 타입 정의
export interface DecodedTokenPayload extends JWTPayload {
  role: "USER" | "ADMIN";
  userId: string;
  email: string;
}

export async function decodeAccessToken(token: string): Promise<DecodedTokenPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));

    // 타입 가드로 필수 필드 검증
    if (
      payload &&
      typeof payload === "object" &&
      "role" in payload &&
      "userId" in payload &&
      "email" in payload &&
      typeof payload.role === "string" &&
      (payload.role === "USER" || payload.role === "ADMIN")
    ) {
      return payload as DecodedTokenPayload;
    }

    throw new Error("Invalid token payload structure");
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
