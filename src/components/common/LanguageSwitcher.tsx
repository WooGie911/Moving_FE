"use client";

import { useLanguageStore } from "@/stores/languageStore";
import { useState } from "react";

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "ko", name: t("한국어") },
    { code: "en", name: t("English") },
    { code: "zh", name: t("中文") },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as "ko" | "en" | "zh");
    setIsOpen(false);
  };

  const currentLanguageName = languages.find((lang) => lang.code === language)?.name || "한국어";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        <span>{currentLanguageName}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-32 rounded-md border border-gray-300 bg-white shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                language === lang.code ? "bg-blue-50 text-blue-700" : "text-gray-700"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
