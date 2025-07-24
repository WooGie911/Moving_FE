import { IFormState } from "@/types/estimateRequest";

// --- 타입 정의 ---
interface IEstimateRequestPayload {
  movingType: "SMALL" | "HOME" | "OFFICE";
  movingDate: string;
  departure: {
    roadAddress: string;
    detailAddress?: string;
    zonecode: string;
    jibunAddress: string;
    extraAddress: string;
  };
  arrival: {
    roadAddress: string;
    detailAddress?: string;
    zonecode: string;
    jibunAddress: string;
    extraAddress: string;
  };
  description?: string;
}

export function toEstimateRequestPayload(form: IFormState): IEstimateRequestPayload {
  try {
    console.log("toEstimateRequestPayload 진입", form);
    const payload: IEstimateRequestPayload = {
      movingType: form.movingType.toUpperCase() as "SMALL" | "HOME" | "OFFICE",
      movingDate: form.movingDate.split("T")[0],
      departure: {
        roadAddress: form.departure.roadAddress || "",
        detailAddress: form.departure.detailAddress || "",
        zonecode: form.departure.zonecode || "",
        jibunAddress: form.departure.jibunAddress || "",
        extraAddress: form.departure.extraAddress || "",
      },
      arrival: {
        roadAddress: form.arrival.roadAddress || "",
        detailAddress: form.arrival.detailAddress || "",
        zonecode: form.arrival.zonecode || "",
        jibunAddress: form.arrival.jibunAddress || "",
        extraAddress: form.arrival.extraAddress || "",
      },
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
    console.log("견적 요청 payload", payload);
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
  updateActive: async (form: IFormState) => {
    console.log("updateActive 호출", form);
    try {
      const payload = toEstimateRequestPayload(form);
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
      console.error("updateActive 내부 에러", e, form);
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
    return res.json();
  },
};

export default estimateRequestApi;
