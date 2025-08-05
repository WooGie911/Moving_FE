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

// 카카오톡 SDK 동적 로드
const loadKakaoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 바로 resolve
    if (typeof window !== "undefined" && window.Kakao) {
      // SDK 초기화
      if (!window.Kakao.isInitialized()) {
        const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
        window.Kakao.init(key);
      }
      resolve();
      return;
    }

    // Next.js Script 컴포넌트에서 이미 로드되었으므로 바로 resolve
    resolve();
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
export const shareToKakao = async (url: string, title?: string, description?: string): Promise<void> => {
  try {
    // 카카오톡 SDK 로드
    await loadKakaoSDK();

    // 카카오톡 공유 실행
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: title || "무빙 - 이사 견적",
        description: description || "안전하고 신뢰할 수 있는 이사 서비스를 찾아보세요",
        imageUrl: "https://gomoving.site/logo-m.png", // 로고 이미지 사용
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: "웹으로 보기",
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
    let shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

    if (title) {
      shareUrl += `&quote=${encodeURIComponent(title)}`;
    }

    if (description) {
      shareUrl += `&description=${encodeURIComponent(description)}`;
    }

    const popup = window.open(shareUrl, "_blank", "width=600,height=400");
    // 페이스북 공유 후 안내 메시지
    if (popup) {
      // 팝업이 열린 후 안내 메시지 표시
      setTimeout(() => {
        showShareSuccess("facebook");
      }, 1000);
    }
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
      message = "페이스북으로 공유되었어요";
      break;
  }

  showSuccessToast(message);
};

// 공유 실패 알림 표시
export const showShareError = (message: string): void => {
  showErrorToast(message);
};
