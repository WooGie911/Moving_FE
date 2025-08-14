export interface ISignInFormValues {
  email: string;
  password: string;
  userType: "CUSTOMER" | "MOVER";
}

export interface ISignUpFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordCheck?: string;
  userType: "CUSTOMER" | "MOVER";
}
