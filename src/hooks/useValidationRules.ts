// useValidationRules.ts
import {
  isValidCareer,
  isValidDescription,
  isValidEmail,
  isValidIntro,
  isValidName,
  isValidPassword,
  isValidPhoneNumber,
} from "@/utils/validators";
import { useTranslations } from "next-intl";

export const useValidationRules = () => {
  const t = useTranslations("validation");

  return {
    name: {
      required: t("required.name"),
      validate: (value: string) => isValidName(value) || t("invalid.name"),
    },
    nickname: {
      required: t("required.nickname"),
      validate: (value: string) => isValidName(value) || t("invalid.nickname"),
    },
    email: {
      required: t("required.email"),
      validate: (value: string) => isValidEmail(value) || t("invalid.email"),
    },
    phoneNumber: {
      required: t("required.phoneNumber"),
      validate: (value: string) => isValidPhoneNumber(value) || t("invalid.phoneNumber"),
    },
    password: {
      required: t("required.password"),
      validate: (value: string) => isValidPassword(value) || t("invalid.password"),
    },
    career: {
      required: t("required.career"),
      validate: (value: number) => isValidCareer(value) || t("invalid.career"),
    },
    intro: {
      required: t("required.intro"),
      validate: (value: string) => isValidIntro(value) || t("invalid.intro"),
    },
    description: {
      required: t("required.description"),
      validate: (value: string) => isValidDescription(value) || t("invalid.description"),
    },
  };
};
