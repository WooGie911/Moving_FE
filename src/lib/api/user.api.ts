import { getTokenFromCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
};

interface ICustomerProfileInput {
  profileImage: string;
  currentRegion: string;
  userServices: number[];
}

interface IMoverProfileInput {
  profileImage: string;
  nickname?: string;
  experience?: number;
  introduction?: string;
  description?: string;
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

  postProfile: async (profile: ICustomerProfileInput | IMoverProfileInput) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(profile),
    });
    return response.json();
  },
};

export default userApi;
