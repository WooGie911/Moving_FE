import { IFormState } from "@/types/estimateRequest";

// --- 타입 정의 ---
interface IEstimateRequestPayload {
  moveType: "SMALL" | "HOME" | "OFFICE";
  fromCity: string;
  fromDistrict: string;
  fromDetail: string;
  fromRegion: string;
  toCity: string;
  toDistrict: string;
  toDetail: string;
  toRegion: string;
  moveDate: string;
  description?: string;
}

export function toEstimateRequestPayload(form: IFormState): any {
  try {
    console.log("toEstimateRequestPayload 진입", form);
    const payload = {
      moveType: form.movingType.toUpperCase(),
      fromCity: form.departure.city,
      fromDistrict: form.departure.district,
      fromDetail: form.departure.detailAddress,
      fromRegion: form.departure.region,
      toCity: form.arrival.city,
      toDistrict: form.arrival.district,
      toDetail: form.arrival.detailAddress,
      toRegion: form.arrival.region,
      moveDate: form.movingDate.split("T")[0],
      ...((form as any).description ? { description: (form as any).description } : {}),
    };
    console.log("toEstimateRequestPayload 반환", payload);
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
    console.log("견적 요청 payload", payload); // 실제 전송되는 데이터 확인
    const token = getAccessTokenFromCookie();
    const res = await fetch(`${API_URL}/estimate-requests`, {
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
  getActive: async () => {
    const token = getAccessTokenFromCookie();
    const res = await fetch(`${API_URL}/estimate-requests/active`, {
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
  updateActive: async (payload: any) => {
    console.log("updateActive 호출", payload);
    try {
      const token = getAccessTokenFromCookie();
      console.log("token", token);
      const res = await fetch(`${API_URL}/estimate-requests/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      console.log("fetch 실행됨", res);
      return res.json();
    } catch (e) {
      console.error("updateActive 내부 에러", e, payload);
      throw e;
    }
  },

  /**
   * 활성 견적 요청 취소
   */
  cancelActive: async () => {
    const token = getAccessTokenFromCookie();
    const res = await fetch(`${API_URL}/estimate-requests/active`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    // 204 No Content
    if (res.status === 204) return { success: true };
    return res.json();
  },
};

export default estimateRequestApi;
