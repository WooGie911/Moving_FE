import React, { useEffect } from "react";
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

// Daum 주소 검색 스크립트 로드
const loadDaumPostcodeScript = () => {
  if (document.getElementById("daum-postcode-script")) return;

  const script = document.createElement("script");
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  script.async = true;
  script.id = "daum-postcode-script";
  document.body.appendChild(script);
};

const AddressSearchDaum: React.FC<IAddressSearchDaumProps> = ({ onComplete }) => {
  const t = useTranslations();

  useEffect(() => {
    if (!window.daum?.Postcode) {
      loadDaumPostcodeScript();
    }
  }, []);

  const handleAddressSearch = () => {
    if (!window.daum?.Postcode) {
      alert(t("addressSearchScriptNotLoaded"));
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        // 올바른 주소 정보 추출
        const zoneCode = data.zonecode || "";
        const roadAddress = data.roadAddress || "";
        const jibunAddress = data.jibunAddress || "";
        const bname = data.bname || ""; // 동/읍/면

        onComplete?.({
          zoneCode: zoneCode,
          roadAddress: roadAddress,
          jibunAddress: jibunAddress,
          extraAddress: bname,
        });
      },
    }).open();
  };

  return (
    <div className={ADDRESS_SEARCH_STYLES.container}>
      <button type="button" onClick={handleAddressSearch} className={ADDRESS_SEARCH_STYLES.button}>
        {t("estimateRequest.searchAddress")}
      </button>
      <span className={ADDRESS_SEARCH_STYLES.description}>{t("serviceAvailableCountry")}</span>
    </div>
  );
};

export default AddressSearchDaum;
