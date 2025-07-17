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
      resolve();
      return;
    }

    // SDK 스크립트 생성
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
    script.integrity = "sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6";
    script.crossOrigin = "anonymous";

    script.onload = () => {
      // SDK 초기화
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || "your-javascript-key");
      }
      resolve();
    };

    script.onerror = () => {
      reject(new Error("카카오톡 SDK 로드 실패"));
    };

    document.head.appendChild(script);
  });
};

// 클립보드에 텍스트 복사
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // HTTPS 환경에서 사용 가능한 최신 API
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
        imageUrl: "https://gomoving.site/og-image.png", // 실제 이미지 URL로 교체 필요
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      social: {
        likeCount: 0,
        commentCount: 0,
        sharedCount: 0,
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
    // 실패 시 링크 복사로 fallback
    copyToClipboard(url);
    showShareSuccess("clip");
  }
};

// 페이스북 공유
export const shareToFacebook = (url: string, title?: string, description?: string): void => {
  try {
    // 페이스북 공유 URL 생성
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

    // 새 창에서 페이스북 공유 페이지 열기
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
  // 이미 존재하는 알림 제거
  const existingAlert = document.getElementById("share-success-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // 새로운 알림 생성
  const alert = document.createElement("div");
  alert.id = "share-success-alert";
  alert.className =
    "w-full max-w-[320px] md:max-w-[660px] lg:max-w-[1200px] h-[54px] lg:h-[66px] fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary-200 text-primary-400 px-4 py-2 leading-[26px] font-semibold text-[16px] rounded-lg shadow-lg transition-all duration-300 items-center justify-center py-[12px] py-[22px] pl-[24px] md:pl-[32px]";

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

  alert.textContent = message;
  document.body.appendChild(alert);

  // 3초 후 알림 제거
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 3000);
};

// 공유 실패 알림 표시
export const showShareError = (message: string): void => {
  // 이미 존재하는 알림 제거
  const existingAlert = document.getElementById("share-error-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // 새로운 알림 생성
  const alert = document.createElement("div");
  alert.id = "share-error-alert";
  alert.className =
    "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center";
  alert.textContent = message;
  document.body.appendChild(alert);

  // 3초 후 알림 제거
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 3000);
};
