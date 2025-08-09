import React, { useEffect, useRef, useState } from "react";
import { IAddressSearchDaumProps, IDaumAddressData, IDaumPostcodeConstructor } from "@/types/estimateRequest";
import { useTranslations } from "next-intl";

declare global {
  interface Window {
    daum?: {
      Postcode: IDaumPostcodeConstructor;
    };
  }
}

// 공통 스타일 변수
const ADDRESS_SEARCH_STYLES = {
  container: "space-y-2",
  button:
    "border-primary-400 text-primary-400 h-[54px] w-full items-center rounded-2xl border px-6 text-left text-base leading-[26px] font-semibold transition-colors focus:outline-none",
  description: "text-md text-gray-500",
} as const;

// Daum 주소 검색 스크립트 로드 (Promise 기반)
const loadDaumPostcodeScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById("daum-postcode-script")) {
      // 이미 로드된 경우
      return resolve();
    }

    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.id = "daum-postcode-script";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Daum postcode script load failed"));
    document.body.appendChild(script);
  });
};

const AddressSearchDaum: React.FC<IAddressSearchDaumProps> = ({ onComplete }) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const embeddedRef = useRef(false);
  const EMBED_HEIGHT = 420;
  const [isVisible, setIsVisible] = useState(true);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);
  const ensureTimerRef = useRef<number | null>(null);
  const postcodePollRef = useRef<number | null>(null);

  // 스크립트 로드 후 임베드 준비
  useEffect(() => {
    let isMounted = true;
    loadDaumPostcodeScript()
      .then(() => {
        if (!isMounted) return;
        setIsReady(true);
      })
      .catch(() => {
        // 로드 실패 시 알림
        alert(t("addressSearchScriptNotLoaded"));
      });
    return () => {
      isMounted = false;
    };
  }, [t]);

  // 준비되면 즉시 임베드 (컨테이너가 레이아웃된 뒤에 수행)
  useEffect(() => {
    if (!isReady || !containerRef.current || embeddedRef.current) return;

    const tryEmbed = () => {
      if (!(window as any).daum?.Postcode) return false;
      if (!containerRef.current || embeddedRef.current) return;
      // 컨테이너가 보이지 않으면 표시 후 임베드
      if (getComputedStyle(containerRef.current).display === "none") {
        containerRef.current.style.display = "block";
      }
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight || EMBED_HEIGHT;
      if (width === 0) return false;
      containerRef.current.style.height = `${EMBED_HEIGHT}px`;

      const postcode = new (window as any).daum.Postcode({
        width: "100%",
        height: EMBED_HEIGHT,
        maxSuggestItems: 5,
        oncomplete: function (data: any) {
          const zoneCode = data.zonecode || "";
          const roadAddress = data.roadAddress || "";
          const jibunAddress = data.jibunAddress || "";
          const bname = data.bname || ""; // 동/읍/면

          onComplete?.({
            zoneCode,
            roadAddress,
            jibunAddress,
            extraAddress: bname,
          });

          // 주소 선택 완료 시 임베드 영역 숨김 처리
          if (containerRef.current) {
            containerRef.current.style.display = "none";
            containerRef.current.style.height = "0px";
            containerRef.current.innerHTML = ""; // iframe 제거
          }
          setIsVisible(false);
        },
      });

      postcode.embed(containerRef.current!);
      embeddedRef.current = true;

      // 임베드 후 실제 iframe 렌더가 되었는지 확인, 실패 시 재시도
      setTimeout(() => {
        if (!containerRef.current) return;
        const hasIframe = !!containerRef.current.querySelector("iframe");
        if (!hasIframe) {
          embeddedRef.current = false;
          if (retryCountRef.current < 10) {
            retryCountRef.current += 1;
            tryEmbed();
          }
        }
      }, 100);

      // 보강: 주기적으로 iframe 존재 보장 (가끔 부모 리렌더로 사라질 수 있음)
      if (ensureTimerRef.current) window.clearInterval(ensureTimerRef.current);
      ensureTimerRef.current = window.setInterval(() => {
        if (!containerRef.current) return;
        const hasIframe = !!containerRef.current.querySelector("iframe");
        if (!hasIframe && isVisible) {
          embeddedRef.current = false;
          tryEmbed();
        }
      }, 400) as unknown as number;
      return true;
    };

    // 0) 라이브러리 로딩 대기 (스크립트 onload 후 Postcode 등록 지연 케이스)
    if (!(window as any).daum?.Postcode) {
      postcodePollRef.current = window.setInterval(() => {
        if ((window as any).daum?.Postcode) {
          postcodePollRef.current && window.clearInterval(postcodePollRef.current);
          postcodePollRef.current = null;
          tryEmbed();
        }
      }, 50) as unknown as number;
    }

    // 1) 즉시 시도
    if (tryEmbed()) return;

    // 2) 레이아웃이 잡힐 때까지 관찰 후 임베드
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        if (tryEmbed()) {
          ro && ro.disconnect();
        }
      });
      ro.observe(containerRef.current);
    }

    // 3) 안전망: 다음 프레임에 한 번 더 시도
    const raf = requestAnimationFrame(() => {
      tryEmbed();
    });

    return () => {
      ro && ro.disconnect();
      cancelAnimationFrame(raf);
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
      }
      if (ensureTimerRef.current) {
        window.clearInterval(ensureTimerRef.current);
        ensureTimerRef.current = null;
      }
      if (postcodePollRef.current) {
        window.clearInterval(postcodePollRef.current);
        postcodePollRef.current = null;
      }
    };
  }, [isReady, onComplete]);

  return (
    <div className={ADDRESS_SEARCH_STYLES.container}>
      {isVisible && (
        <div
          ref={containerRef}
          style={{ width: "100%", height: EMBED_HEIGHT, display: "block", overflow: "hidden" }}
          aria-label={t("estimateRequest.searchAddress")}
        />
      )}
      <span className={ADDRESS_SEARCH_STYLES.description}>{t("serviceAvailableCountry")}</span>
    </div>
  );
};

export default AddressSearchDaum;
