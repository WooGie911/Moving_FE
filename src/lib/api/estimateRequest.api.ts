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

function getAccessTokenFromCookie(): string | undefined {
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const estimateRequestApi = {
  /**
   * 견적 요청 생성
   */
  create: async (form: IFormState) => {
    const payload = toEstimateRequestPayload(form);
    const token = getAccessTokenFromCookie();
    const res = await fetch(`${API_URL}/estimateRequests/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return res.json();
  },

  /**
   * 활성 견적 요청 조회
   */
  getActive: async (language?: string) => {
    const token = getAccessTokenFromCookie();
    const queryParams = language ? `?lang=${language}` : "";
    const res = await fetch(`${API_URL}/estimateRequests/active${queryParams}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    return res.json();
  },

  /**
   * 활성 견적 요청 수정
   */
  updateActive: async (form: IFormState) => {
    try {
      const payload = toEstimateRequestPayload(form);
      const token = getAccessTokenFromCookie();
      const res = await fetch(`${API_URL}/estimateRequests/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      return res.json();
    } catch (e) {
      console.error("updateActive 내부 에러", e, form);
      throw e;
    }
  },

  /**
   * 활성 견적 요청 취소
   */
  cancelActive: async () => {
    const token = getAccessTokenFromCookie();
    const res = await fetch(`${API_URL}/estimateRequests/active`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    // 204 상태 코드는 성공이지만 응답 본문이 없음
    if (res.status === 204) {
      return { success: true, message: "견적 요청이 성공적으로 취소되었습니다." };
    }

    // 다른 상태 코드는 JSON 응답을 파싱
    return res.json();
  },
};

export default estimateRequestApi;
