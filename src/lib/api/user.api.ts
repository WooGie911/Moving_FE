import { getTokenFromCookie } from "@/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
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
};

export default userApi;
