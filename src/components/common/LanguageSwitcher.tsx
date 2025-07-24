"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import iconDown from "@/assets/icon/arrow/icon-down.png";
import iconUp from "@/assets/icon/arrow/icon-up.png";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return locale === "ko" ? t("korean") : locale === "en" ? t("english") : t("chinese");
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
          {routing.locales.map((loc) => (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 text-sm transition-colors ${
                locale === loc ? "bg-primary-100 text-primary-400 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {loc === "ko" ? t("korean") : loc === "en" ? t("english") : t("chinese")}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
