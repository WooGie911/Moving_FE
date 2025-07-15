export type TUserRole = "CUSTOMER" | "MOVER" | "GUEST";

export type TUser = {
  id: number;
  name: string;
  currentRole: TUserRole;
  hasProfile: boolean;
  accessToken?: string;
};
