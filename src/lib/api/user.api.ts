import { getTokenFromCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
};

const updateMoverBasicInfo = async (data: {
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
};

const userApi = {
  getUser: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    return response.json();
  },
  updateMoverBasicInfo,
};

export default userApi;
