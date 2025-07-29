"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import iconDown from "@/assets/icon/arrow/icon-down.png";
import iconUp from "@/assets/icon/arrow/icon-up.png";
import { useLanguageStore } from "@/stores/languageStore";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 외부 클릭으로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ESC 키로 드롭다운 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const getCurrentLanguageText = () => {
    return language === "ko" ? t("common.korean") : language === "en" ? t("common.english") : t("common.chinese");
  };

  const handleLanguageChange = (newLanguage: "ko" | "en" | "zh") => {
    setLanguage(newLanguage);

    // URL의 locale 부분 업데이트
    const segments = pathname.split("/");
    segments[1] = newLanguage; // 첫 번째 세그먼트는 locale
    const newPathname = segments.join("/");

    router.push(newPathname);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`focus:ring-primary-400 flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none ${
          isOpen
            ? "border-primary-400 bg-primary-50 text-primary-400"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <span>{getCurrentLanguageText()}</span>
        <Image
          src={isOpen ? iconUp : iconDown}
          alt={isOpen ? "위쪽 화살표" : "아래쪽 화살표"}
          width={12}
          height={12}
          className="transition-transform duration-200"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-1 min-w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {(["ko", "en", "zh"] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                language === loc ? "bg-primary-100 text-primary-400 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {loc === "ko" ? t("common.korean") : loc === "en" ? t("common.english") : t("common.chinese")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
