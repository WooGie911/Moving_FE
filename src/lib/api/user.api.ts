import { getTokenFromCookie } from "@/utils/auth";
import { apiGet, apiPatch, apiPost, apiPut } from "@/utils/apiHelpers";

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
  currentAreas?: string[];
  serviceTypes?: string[];
  shortIntro?: string;
  detailIntro?: string;
  career?: number;
  isVeteran?: boolean;
}

interface IMoverBasicInfoUpdateInput {
  name?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}

const userApi = {
  getUser: async () => {

    const response = await apiGet(`/users`);


    return response;
  },

  uploadFilesToS3: async (file: File) => {
    // 1) Presigned URL 발급 요청
    const res = await apiPost(`/users/profile/presignedUrl`, {
      filename: file.name,
      contentType: file.type,
    });

    // 2) Presigned URL로 S3에 직접 PUT 업로드
    await fetch(res.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    // 3) 업로드 완료된 S3 접근 URL 반환
    return res.fileUrl;
  },

  // 프로필 조회
  getProfile: async (language?: string) => {
    const queryParams = language ? `?lang=${language}` : "";
    const response = await apiGet(`/users/profile${queryParams}`);
    return response;
  },

  // 프로필 등록
  postProfile: async (profile: ICustomerProfileInput | IMoverProfileInput) => {
    const response = await apiPost(`/users/profile`, profile);

    return response;
  },

  // 일반 유저 프로필 수정
  updateCustomerBasicInfo: async (data: ICustomerUpdateInput) => {
    const response = await apiPatch(`/users/profile/customer`, data);
    return response;
  },

  // 기사님 기본정보 수정
  updateMoverBasicInfo: async (data: IMoverBasicInfoUpdateInput) => {
    return apiPatch(`/users/profile/mover/basic`, data);
  },

  // 기사님 프로필 수정
  updateMoverProfile: async (data: IMoverProfileUpdateInput) => {
    return apiPatch(`/users/profile/mover`, data);
  },
};

export default userApi;
