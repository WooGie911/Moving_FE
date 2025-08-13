import * as Sentry from "@sentry/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 공유 데이터 타입 정의 (기존 컴포넌트들과 일치)
export interface IShareData {
  estimateRequest: {
    id: string;
    customerId: string;
    moveType: "SMALL" | "HOME" | "OFFICE";
    moveDate: Date;
    fromAddressId: string;
    toAddressId: string;
    description: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    fromAddress: {
      zoneCode: string;
      city: string;
      district: string;
      detail: string | null;
      region: string;
    };
    toAddress: {
      zoneCode: string;
      city: string;
      district: string;
      detail: string | null;
      region: string;
    };
    customer: {
      id: string;
      nickname: string | null;
      name: string | null;
    };
  } | null;
  estimate: {
    id: string;
    moverId: string;
    estimateRequestId: string;
    price: number | null;
    comment: string | null;
    status: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
    rejectReason: string | null;
    isDesignated: boolean;
    workingHours: string | null;
    includesPackaging: boolean;
    insuranceAmount: number | null;
    validUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } | null;
}

export interface ShareApiResponse {
  success: boolean;
  data: IShareData;
  message?: string;
}

// API 에러 응답 타입
interface IApiErrorResponse {
  success: false;
  message: string;
  error?: {
    message: string;
  };
}

const shareApi = {
  // 공유 데이터 조회 API
  getShareData: async (estimateRequestId: string, estimateId?: string): Promise<IShareData> => {
    try {
      const url = estimateId
        ? `${API_URL}/share/${estimateRequestId}/${estimateId}`
        : `${API_URL}/share/${estimateRequestId}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        });

        if (response.status === 404) {
          throw new Error("공유 데이터를 찾을 수 없습니다.");
        } else {
          // 실제 에러 메시지를 받아오기
          const errorData = (await response.json().catch(() => ({}))) as IApiErrorResponse;
          console.error("Error response:", errorData);
          throw new Error(errorData.error?.message || "공유 데이터 조회에 실패했습니다.");
        }
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "공유 데이터 조회에 실패했습니다.");
      }

      return result.data;
    } catch (error) {
      console.error("공유 데이터 조회 실패:", error);
      Sentry.captureException(error, {
        tags: {
          api: "share",
          action: "getShareData",
        },
        extra: {
          estimateRequestId,
          estimateId,
          endpoint: `/share/${estimateRequestId}/${estimateId}`,
        },
      });
      throw error;
    }
  },
};

export default shareApi;
