"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const userApi = {
  getUser: async () => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
};

export default userApi;
