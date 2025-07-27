// locale prefix 제거 함수
export const getPathWithoutLocale = (path: string) => {
  const segments = path.split("/").filter(Boolean); // ['', 'ko', 'estimate', 'request'] → ['ko', 'estimate', 'request']
  if (segments.length > 1) {
    return "/" + segments.slice(1).join("/"); // '/estimate/request'
  }
  return path;
};
