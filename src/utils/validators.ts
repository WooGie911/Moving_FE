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
