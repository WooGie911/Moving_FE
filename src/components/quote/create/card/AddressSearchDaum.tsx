import React, { useEffect } from "react";
import { IAddressSearchDaumProps, IDaumAddress, IDaumAddressData, IDaumPostcodeConstructor } from "@/types/quote";

declare global {
  interface Window {
    daum?: {
      Postcode: IDaumPostcodeConstructor;
    };
  }
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
  useEffect(() => {
    if (!window.daum?.Postcode) {
      loadDaumPostcodeScript();
    }
  }, []);

  const handleClick = () => {
    if (!window.daum?.Postcode) {
      alert("주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.");
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
    <button
      type="button"
      onClick={handleClick}
      className="border-primary-400 text-primary-400 h-[54px] w-full items-center rounded-2xl border px-6 text-left text-base leading-[26px] font-semibold transition-colors focus:outline-none"
    >
      주소 검색
    </button>
  );
};

export default AddressSearchDaum;
