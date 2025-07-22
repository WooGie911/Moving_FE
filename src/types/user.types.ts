export type TUserRole = "CUSTOMER" | "MOVER" | "GUEST";

export type TUser = {
  id: number;
  name: string;
  userType: TUserRole;
  nickname: string;
  accessToken?: string;
};
