export interface ISignInFormValues {
  email: string;
  password: string;
}

export interface ISignUpFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordCheck?: string;
  currentRole: "CUSTOMER" | "MOVER";
}
