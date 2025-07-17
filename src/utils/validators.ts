/**
 * 허용 TLD 리스트
 * 필요에 따라 확장 가능
 */
const allowedTlds = [
  "com",
  "net",
  "org",
  "co.kr",
  "kr",
  "io",
  "dev",
  "app",
  "me",
  "edu",
  "gov",
  "us",
  "co",
  "info",
  "biz",
  "tv",
  "store",
];

/**
 * 이메일 유효성 검사
 * - 기본 이메일 구문 검사
 * - 허용된 TLD 검사
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split("@")[1];
  if (!domain) return false;

  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  const tld = domainParts.slice(-1)[0].toLowerCase();
  if (!allowedTlds.includes(tld)) return false;

  return true;
};

/**
 * 이름 유효성 검사
 * - 한글, 영문만 허용
 * - 최소 1자 이상 (백엔드 기준)
 * - 최대 10자 이하
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[가-힣a-zA-Z]{1,10}$/;
  return nameRegex.test(name);
};

/**
 * 전화번호 유효성 검사 (대한민국 기준: 010xxxxxxxx 또는 +8210xxxxxxxx)
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(010\d{8}|(\+82)?10\d{8})$/;
  return phoneRegex.test(phoneNumber.replace(/[-\s]/g, ""));
};

/**
 * 비밀번호 유효성 검사
 * - 최소 8자 이상
 * - 영문, 숫자, 특수문자 각각 1개 이상 포함
 */
export const isValidPassword = (password: string): boolean => {
  const lengthCheck = password.length >= 8;
  const letterCheck = /[a-zA-Z]/.test(password);
  const numberCheck = /\d/.test(password);
  const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return lengthCheck && letterCheck && numberCheck && specialCheck;
};

/**
 * 경력 유효성 검사
 * - 숫자만, 0 이상 (백엔드 기준)
 */
export const isValidCareer = (career: number): boolean => {
  return !isNaN(career) && career >= 0;
};

/**
 * 소개글 유효성 검사
 * - 최소 8자 이상
 */
export const isValidIntro = (intro: string): boolean => {
  return intro.trim().length >= 8;
};

/**
 * 설명 유효성 검사
 * - 최소 10자 이상
 */
export const isValidDescription = (desc: string): boolean => {
  return desc.trim().length >= 10;
};

/**
 * React Hook Form에서 사용할 벨리데이션 규칙
 */
export const validationRules = {
  name: {
    required: "이름을 입력해주세요",
    validate: (value: string) => isValidName(value) || "이름은 1~10자의 한글, 영문만 입력 가능합니다.",
  },
  nickname: {
    required: "별명을 입력해주세요",
    validate: (value: string) => isValidName(value) || "별명은 1~10자의 한글, 영문만 입력 가능합니다.",
  },
  email: {
    required: "이메일은 필수 입력입니다.",
    validate: (value: string) => isValidEmail(value) || "올바른 이메일 형식이 아니거나 허용되지 않는 도메인입니다.",
  },
  phoneNumber: {
    required: "전화번호는 필수 입력입니다.",
    validate: (value: string) => isValidPhoneNumber(value) || "올바른 전화번호 형식이 아닙니다. (예: 01012345678)",
  },
  password: {
    required: "비밀번호는 필수 입력입니다.",
    validate: (value: string) =>
      isValidPassword(value) || "비밀번호는 최소 8자 이상이며 영문, 숫자, 특수문자를 각각 포함해야 합니다.",
  },
  career: {
    required: "경력을 입력해주세요",
    validate: (value: number) => isValidCareer(value) || "경력은 0 이상의 숫자로 입력해주세요. (예: 8)",
  },
  intro: {
    required: "한줄 소개를 입력해주세요",
    validate: (value: string) => isValidIntro(value) || "한 줄 소개는 8자 이상 입력해주세요.",
  },
  description: {
    required: "상세 설명을 입력해주세요",
    validate: (value: string) => isValidDescription(value) || "상세 설명은 10자 이상 입력해주세요.",
  },
};
