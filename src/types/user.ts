export interface IEditBasicForm {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface IMoverProfileEditForm {
  nickname: string;
  moverImage: string;
  currentArea: string;
  serviceTypes: string[];
  shortIntro: string;
  detailIntro: string;
  career: number;
  isVeteran: boolean;
} 