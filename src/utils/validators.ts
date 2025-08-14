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
 * - 한글 완성형, 영어, 중국어, 숫자 허용
 * - 한글 자모(ㄱㄴㄷ 등)는 불허
 * - 최소 1자 이상, 최대 15자 이하
 */
export const isValidName = (name: string): boolean => {
  const allowedRegex = /^[a-zA-Z0-9가-힣\u4E00-\u9FFF]{1,15}$/;
  const disallowedRegex = /[ㄱ-ㅎㅏ-ㅣ]/; // 한글 자모 차단
  return allowedRegex.test(name) && !disallowedRegex.test(name);
};

/**
 * 전화번호 유효성 검사 (대한민국 기준: 010xxxxxxxx 또는 +8210xxxxxxxx)
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/[-\s]/g, "");
  const phoneRegex = /^(010\d{8}|82(10\d{8}))$/;
  return phoneRegex.test(cleaned);
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
 * - 두 자리 숫자만 허용 (0 ~ 99)
 */
export const isValidCareer = (career: number | string): boolean => {
  if (typeof career === "string") {
    if (!/^\d{1,2}$/.test(career)) return false;
    const n = Number(career);
    return n >= 0 && n <= 99;
  }
  return Number.isFinite(career) && career >= 0 && career <= 99;
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
