import { getTokenFromCookie, setTokensToCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
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
  currentArea?: string;
  serviceTypes?: string[];
  shortIntro?: string;
  detailIntro?: string;
  career?: number;
  isVeteran?: boolean;
}

const userApi = {
  getUser: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    return response.json();
  },

  uploadFilesToS3: async (file: File) => {
    // 1) Presigned URL 발급 요청
    const res = await fetch(`${API_URL}/users/profile/presignedUrl`, {
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
    const presigned = await res.json();

    // 2) Presigned URL로 S3에 직접 PUT 업로드
    await fetch(presigned.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // 3) 업로드 완료된 S3 접근 URL 반환
    return presigned.fileUrl;
  },

  // 프로필 조회
  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
    });
    return response.json();
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
    });

    const data = await response.json();

    if (data.success && data.accessToken) {
      await setTokensToCookie(data.accessToken); // 토큰 저장
    }

    return data;
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

  updateMoverBasicInfo: async (data: {
    name?: string;
    phoneNumber?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    const accessToken = await getAccessToken();
    const response = await fetch(`${API_URL}/users/profile/mover/basic`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return response.json();
  },

  updateMoverProfile: async (data: IMoverProfileUpdateInput) => {
    const accessToken = await getAccessToken();
    const response = await fetch(`${API_URL}/users/profile/mover`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return response.json();
  },
};

export default userApi;
