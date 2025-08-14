import logo from "@/assets/img/logo/logo-m.png";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
/**
 * 공유 관련 유틸리티 함수들
 */

// 카카오톡 SDK 타입 정의
declare global {
  interface Window {
    Kakao: any;
  }
}

// 카카오톡 SDK 동적 로드 (필요할 때만)
const loadKakaoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();

    // 이미 로드되어 있으면 초기화만 보장
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
        window.Kakao.init(key);
      }
      return resolve();
    }

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      try {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
          window.Kakao.init(key);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    script.onerror = () => reject(new Error("Kakao SDK load failed"));
    document.head.appendChild(script);
  });
};

// 클립보드에 텍스트 복사
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // HTTPS 환경에서 사용 가능한 최신 API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 구형 브라우저 지원을 위한 fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error("클립보드 복사 실패:", error);
    return false;
  }
};

// 현재 페이지 URL 가져오기
export const getCurrentPageUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return "";
};

// 카카오톡 공유 (카카오톡 웹 API 사용)
export const shareToKakao = async (
  url: string,
  title?: string,
  description?: string,
  imageUrl?: string,
): Promise<void> => {
  try {
    // 카카오톡 SDK 로드
    await loadKakaoSDK();

    // 카카오톡 공유 실행
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: title || "무빙 - 이사 견적",
        description: description || "안전하고 신뢰할 수 있는 이사 서비스를 찾아보세요",
        imageUrl: imageUrl || "https://gomoving.site/logo-m.png", // 기사님 프로필 이미지 또는 기본 로고 사용
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: "상세 페이지 보기",
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });
  } catch (error) {
    console.error("카카오톡 공유 실패:", error);

    // 로컬호스트 환경에서는 클립보드 복사로 대체
    if (url.includes("localhost")) {
      copyToClipboard(url);
      showShareSuccess("clip");
    } else {
      // 실제 도메인에서 실패 시에도 클립보드 복사
      copyToClipboard(url);
      showShareSuccess("clip");
    }
  }
};

// Open Graph 메타 태그 설정 함수
const setOpenGraphMetaTags = (title?: string, description?: string) => {
  if (typeof document === "undefined") return;

  // 기존 메타 태그 제거
  const existingTags = document.querySelectorAll('meta[property^="og:"]');
  existingTags.forEach((tag) => tag.remove());

  // 새로운 메타 태그 추가
  if (title) {
    const metaTitle = document.createElement("meta");
    metaTitle.setAttribute("property", "og:title");
    metaTitle.setAttribute("content", title);
    document.head.appendChild(metaTitle);
  }

  if (description) {
    const metaDesc = document.createElement("meta");
    metaDesc.setAttribute("property", "og:description");
    metaDesc.setAttribute("content", description);
    document.head.appendChild(metaDesc);
  }
};

// 페이스북 공유
export const shareToFacebook = (url: string, title?: string, description?: string): void => {
  try {
    // Open Graph 메타 태그 동적 설정
    if (title || description) {
      setOpenGraphMetaTags(title, description);
    }

    // 제목과 설명을 결합하여 공유할 텍스트 생성
    let shareText = "";
    if (title && description) {
      shareText = `${title}\n\n${description}`;
    } else if (title) {
      shareText = title;
    } else if (description) {
      shareText = description;
    }

    // 상세 페이지 링크 추가
    if (shareText && url) {
      shareText += `\n\n상세 페이지: ${url}`;
    }

    // 페이스북 공유 URL 생성
    let shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

    if (shareText) {
      // 페이스북에서 지원하는 파라미터 추가
      shareUrl += `&quote=${encodeURIComponent(shareText)}`;
    }

    // 먼저 클립보드에 공유 텍스트 복사
    if (shareText) {
      copyToClipboard(shareText);
    }

    const popup = window.open(shareUrl, "_blank", "width=600,height=400");
  } catch (error) {
    console.error("페이스북 공유 실패:", error);
    throw new Error("페이스북 공유에 실패했습니다.");
  }
};

// 공유 성공 알림 표시
export const showShareSuccess = (type: "clip" | "kakao" | "facebook"): void => {
  let message = "";
  switch (type) {
    case "clip":
      message = "링크가 복사되었어요";
      break;
    case "kakao":
      message = "카카오톡으로 공유되었어요";
      break;
    case "facebook":
      message = "페이스북 공유 창이 열렸어요. 공유할 내용이 클립보드에 복사되었습니다.";
      break;
  }

  showSuccessToast(message);
};

// 공유 실패 알림 표시
export const showShareError = (message: string): void => {
  showErrorToast(message);
};
