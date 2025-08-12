// src/utils/handleAuthErrorToast.ts
"use client";

import { showErrorToast } from "@/utils/toastUtils";
import { useTranslations } from "next-intl";

type TFunction = ReturnType<typeof useTranslations>;

export const handleAuthErrorToast = (t: TFunction, message: string) => {
  // 메시지 → 번역 키 매핑을 switch로 지연 평가하여, 존재하지 않는 키에 대한 불필요한 번역 호출을 방지합니다.
  let translationKey: string = "error.unknown";

  switch (message) {
    case "존재하지 않는 유저입니다":
      translationKey = "error.userNotFound";
      break;
    case "소셜 로그인 유저입니다. 소셜로그인으로 로그인 해주세요":
      translationKey = "error.socialLoginOnly";
      break;
    case "비밀번호가 일치하지 않습니다":
      translationKey = "error.invalidPassword";
      break;
    case "이미 사용 중인 이메일입니다.":
      translationKey = "error.duplicateEmail";
      break;
    case "이미 사용중인 닉네임입니다":
      translationKey = "error.duplicateNickname";
      break;
    case "유효하지 않은 이메일 형식입니다.":
      translationKey = "error.invalidEmailFormat";
      break;
    case "이름은 최소 2자 이상이어야 합니다.":
      translationKey = "error.nameTooShort";
      break;
    case "비밀번호는 최소 8자 이상이어야 합니다.":
      translationKey = "error.passwordTooShort";
      break;
    case "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.":
      translationKey = "error.passwordWeak";
      break;
    case "현재 비밀번호와 새로운 비밀번호가 동일합니다":
      translationKey = "error.passwordMismatch";
      break;
    case "현재 비밀번호가 일치하지 않습니다":
      translationKey = "error.invalidCurrentPassword";
      break;
    case "현재 비밀번호를 입력해주세요":
      translationKey = "error.currentPasswordRequired";
      break;
    case "전화번호는 숫자만 입력해야 합니다.":
      translationKey = "error.invalidPhoneNumber";
      break;
    case "전화번호는 최소 10자 이상이어야 합니다.":
      translationKey = "error.phoneTooShort";
      break;
    case "로그인 요청이 너무 많습니다. 1분 후 다시 시도해주세요.":
      translationKey = "error.tooManyLoginRequests";
      break;
    case "회원가입 요청이 너무 많습니다. 30분 후 다시 시도해주세요.":
      translationKey = "error.tooManySignupRequests";
      break;
    case "토큰 생성 실패로 인한 로그인 실패":
      translationKey = "error.tokenGeneration";
      break;
    case "토큰 생성 실패로 인한 회원가입 실패":
      translationKey = "error.tokenGeneration";
      break;
    case "유저 생성 실패로 인한 회원가입 실패":
      translationKey = "error.userCreationFailed";
      break;
    default:
      translationKey = "error.unknown";
  }

  try {
    showErrorToast(t(translationKey));
  } catch {
    // 네임스페이스 불일치 등으로 키가 없을 경우 안전 폴백
    showErrorToast(t("error.unknown"));
  }
};
