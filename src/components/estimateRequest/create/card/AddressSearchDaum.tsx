import React, { useEffect } from "react";
import { IAddressSearchDaumProps, IDaumAddressData, IDaumPostcodeConstructor } from "@/types/estimateRequest";
import { useLanguageStore } from "@/stores/languageStore";

declare global {
  interface Window {
    daum?: {
      Postcode: IDaumPostcodeConstructor;
    };
  } // 실제 전역 객체
}

const loadDaumPostcodeScript = () => {
  if (document.getElementById("daum-postcode-script")) return;
  const script = document.createElement("script");
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  script.async = true;
  script.id = "daum-postcode-script";
  document.body.appendChild(script);
};

const AddressSearchDaum: React.FC<IAddressSearchDaumProps> = ({ onComplete }) => {
  const { t } = useLanguageStore();
  useEffect(() => {
    if (!window.daum?.Postcode) {
      loadDaumPostcodeScript();
    }
  }, []);

  const handleClick = () => {
    if (!window.daum?.Postcode) {
      alert(t("addressSearchScriptNotLoaded"));
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data: IDaumAddressData) {
        onComplete?.({
          zonecode: data.zonecode,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
          extraAddress: data.bname || "",
        });
      },
    }).open();
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className="border-primary-400 text-primary-400 h-[54px] w-full items-center rounded-2xl border px-6 text-left text-base leading-[26px] font-semibold transition-colors focus:outline-none"
      >
        {t("quote.searchAddress")}
      </button>
      <span className="text-md text-gray-500">{t("serviceAvailableCountry")}</span>
    </div>
  );
};

export default AddressSearchDaum;
