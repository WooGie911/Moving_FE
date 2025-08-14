import { nanoid } from "nanoid";

const ID_LEN = 10 as const;

const getExt = (file: File) => {
  // 1) 파일명에서 확장자 추출
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : "";
  if (fromName) return fromName.toLowerCase();

  // 2) MIME 타입 기반 확장자 매핑
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/avif": "avif",
  };
  return map[file.type] ?? "bin";
};

/**
 * 파일명을 타임스탬프 + nanoid로 변경
 * @param file 원본 파일 객체
 * @returns 새로운 이름이 적용된 File 객체
 */
export const renameFileWithTimestamp = (file: File): File => {
  const ext = getExt(file);
  const timestamp = Date.now();
  const rid = nanoid(ID_LEN);
  const newName = `${timestamp}_${rid}.${ext}`;
  return new File([file], newName, { type: file.type });
};
