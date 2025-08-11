"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import iconDown from "@/assets/icon/arrow/icon-down.svg";
import iconUp from "@/assets/icon/arrow/icon-up.svg";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { setLanguagePreference } from "@/utils/languageUtils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations();
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
    return locale === "ko" ? t("common.korean") : locale === "en" ? t("common.english") : t("common.chinese");
  };

  const handleLanguageChange = async (newLanguage: "ko" | "en" | "zh") => {
    setIsOpen(false);

    // 쿠키와 로컬스토리지에 언어 설정 저장 (동기화)
    setLanguagePreference(newLanguage);

    // 페이지 이동
    await router.push(pathname, { locale: newLanguage });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-pressed={isOpen}
        className={`focus:ring-primary-400 active:bg-primary-100 flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus:border-none focus:ring-2 focus:ring-offset-1 focus:outline-none ${
          isOpen
            ? "border-primary-400 bg-primary-100 text-primary-400"
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
        <div className="absolute top-full right-0 z-50 mt-3 min-w-[120px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {(["ko", "en", "zh"] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              role="option"
              aria-selected={locale === loc}
              className={`active:bg-primary-100 block w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors focus:outline-none ${
                locale === loc
                  ? "bg-primary-100 text-primary-400 font-medium"
                  : "text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
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
