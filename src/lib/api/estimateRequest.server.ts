import { cookies } from "next/headers";
import { IFormState, IEstimateRequestPayload } from "@/types/estimateRequest";

export function toEstimateRequestPayload(form: IFormState): IEstimateRequestPayload {
  try {
    const payload: IEstimateRequestPayload = {
      movingType: form.movingType.toUpperCase() as "SMALL" | "HOME" | "OFFICE",
      movingDate: form.movingDate.split("T")[0],
      departure: {
        roadAddress: form.departure.roadAddress || "",
        detailAddress: form.departure.detailAddress || "",
        zoneCode: form.departure.zoneCode || "",
        jibunAddress: form.departure.jibunAddress || "",
        extraAddress: form.departure.extraAddress || "",
      },
      arrival: {
        roadAddress: form.arrival.roadAddress || "",
        detailAddress: form.arrival.detailAddress || "",
        zoneCode: form.arrival.zoneCode || "",
        jibunAddress: form.arrival.jibunAddress || "",
        extraAddress: form.arrival.extraAddress || "",
      },
    };

    // description이 있는 경우에만 추가
    if ("description" in form && typeof form.description === "string" && form.description) {
      payload.description = form.description;
    }

    return payload;
  } catch (e) {
    console.error("toEstimateRequestPayload 내부 에러", e, form);
    throw e;
  }
}

function getAccessTokenFromServer(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get("accessToken")?.value;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const estimateRequestServerApi = {
  /**
   * 활성 견적 요청 조회 (서버 사이드)
   */
  getActive: async (locale: string) => {
    const token = getAccessTokenFromServer();
    const res = await fetch(`${API_URL}/estimateRequests/active?lang=${locale}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store", // 항상 최신 데이터 가져오기
    });
    return res.json();
  },
};
