import { getTokenFromCookie } from "@/utils/auth";
import { fetchWithAuth } from "./fetcher.api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type TApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
};

// 프로필 조회 응답 타입(고객/기사 공통 초과 타입)
export type TUserProfile = {
  // 공통/고객 필드
  name?: string;
  nickname?: string;
  email?: string;
  phoneNumber?: string;
  preferredServices?: string[];
  currentArea?: string;
  customerImage?: string;
  // 기사 필드
  moverImage?: string;
  career?: number;
  shortIntro?: string;
  detailIntro?: string;
  currentAreas?: string[];
  serviceTypes?: string[];
};

const getAccessToken = async () => {
  return await getTokenFromCookie();
};

interface ICustomerProfileInput {
  nickname: string;
  customerImage: string;
  preferredServices: string[];
  currentArea: string;
}

interface ICustomerUpdateInput extends ICustomerProfileInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface IMoverProfileInput {
  moverImage: string;
  nickname: string;
  career: number;
  shortIntro: string;
  detailIntro: string;
  currentAreas: string[];
  serviceTypes: string[];
}

interface IMoverProfileUpdateInput {
  nickname?: string;
  moverImage?: string;
  currentAreas?: string[];
  serviceTypes?: string[];
  shortIntro?: string;
  detailIntro?: string;
  career?: number;
  isVeteran?: boolean;
}

interface IMoverBasicInfoUpdate {
  name?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}

const userApi = {
  // 사용자 정보 조회
  getUser: async (): Promise<TApiResponse<unknown>> => {
    return fetchWithAuth<TApiResponse<unknown>>(`${API_URL}/users`);
  },

  // 프로필 조회
  getProfile: async (language?: string): Promise<TApiResponse<TUserProfile>> => {
    const query = language ? `?lang=${language}` : "";
    return fetchWithAuth<TApiResponse<TUserProfile>>(`${API_URL}/users/profile${query}`);
  },

  // 프로필 등록
  postProfile: async (profile: ICustomerProfileInput | IMoverProfileInput) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(profile),
      credentials: "include",
    });
    return response.json();
  },

  // 일반 유저 프로필 수정
  updateCustomerBasicInfo: async (data: ICustomerUpdateInput) => {
    const response = await fetch(`${API_URL}/users/profile/customer`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return response.json();
  },

  // 기사님 기본 정보 수정
  updateMoverBasicInfo: async (data: IMoverBasicInfoUpdate) => {
    const response = await fetch(`${API_URL}/users/profile/mover/basic`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return response.json();
  },

  // 기사님 프로필 정보 수정
  updateMoverProfile: async (data: IMoverProfileUpdateInput) => {
    const response = await fetch(`${API_URL}/users/profile/mover`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return response.json();
  },

  // S3 이미지 업로드
  uploadFilesToS3: async (file: File) => {
    // 1. Presigned URL 요청
    const presignedResponse = await fetch(`${API_URL}/users/profile/presignedUrl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    const presigned = await presignedResponse.json();

    // 2. Presigned URL로 S3에 직접 업로드
    const uploadResponse = await fetch(presigned.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("S3 업로드 실패");
    }

    // 3. fileUrl에서 objectKey 바로 추출 및 클라우드프론트 URL 생성
    const objectKey = new URL(presigned.fileUrl).pathname.slice(1);

    const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL;

    if (!CLOUDFRONT_URL) {
      throw new Error("AWS_CLOUDFRONT_URL is not set");
    }
    const fileUrl = `https://${CLOUDFRONT_URL}/${objectKey}`;

    // 4. fileUrl 반환 (서버 저장용)
    return fileUrl;
  },
};

export default userApi;
