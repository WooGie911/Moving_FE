// src/utils/handleAuthErrorToast.ts
"use client";

import { showErrorToast } from "@/utils/toastUtils";
import { useTranslations } from "next-intl";

type TFunction = ReturnType<typeof useTranslations>;

export const handleAuthErrorToast = (t: TFunction, message: string) => {
  const errorMap: Record<string, string> = {
    "존재하지 않는 유저입니다": t("error.userNotFound"),
    "소셜 로그인 유저입니다. 소셜로그인으로 로그인 해주세요": t("error.socialLoginOnly"),
    "비밀번호가 일치하지 않습니다": t("error.invalidPassword"),
    "이미 사용 중인 이메일입니다.": t("error.duplicateEmail"),
    // 추가
    "이미 사용중인 닉네임입니다": t("error.duplicateNickname"),
    "유효하지 않은 이메일 형식입니다.": t("error.invalidEmailFormat"),
    "이름은 최소 2자 이상이어야 합니다.": t("error.nameTooShort"),
    "비밀번호는 최소 8자 이상이어야 합니다.": t("error.passwordTooShort"),
    "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.": t("error.passwordWeak"),
    "전화번호는 숫자만 입력해야 합니다.": t("error.invalidPhoneNumber"),
    "전화번호는 최소 10자 이상이어야 합니다.": t("error.phoneTooShort"),
    "토큰 생성 실패로 인한 로그인 실패": t("error.tokenGeneration"),
    "토큰 생성 실패로 인한 회원가입 실패": t("error.tokenGeneration"),
    "유저 생성 실패로 인한 회원가입 실패": t("error.userCreationFailed"),
  };

  const translated = errorMap[message] || t("error.unknown");
  showErrorToast(translated);
};
