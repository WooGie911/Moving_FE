import { jwtVerify, JWTPayload } from "jose";

// 현재 서버 토큰 구조에 맞춘 타입 정의
export interface DecodedTokenPayload extends JWTPayload {
  role: "CUSTOMER" | "MOVER";
  userId: number;
  name: string;
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
      "name" in payload &&
      typeof payload.role === "string" &&
      (payload.role === "CUSTOMER" || payload.role === "MOVER")
    ) {
      return payload as DecodedTokenPayload;
    }

    throw new Error("Invalid token payload structure");
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
