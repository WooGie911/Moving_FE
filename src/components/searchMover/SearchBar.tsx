"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import Image from "next/image";
import searchIcon from "@/assets/icon/etc/icon-search-lg.svg";

const SearchBar = () => {
  const { search, setSearch } = useSearchMoverStore();
  const [input, setInput] = useState(search || "");
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const t = useTranslations("mover");

  useEffect(() => {
    setInput(search || "");
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setSearch(value);
      }, 100);
    },
    [setSearch],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative mb-[22px] h-14 w-full max-w-[327px] md:mb-[26px] md:max-w-[601px] lg:mb-[38px] lg:h-16 lg:max-w-[819px]"
      role="search"
      aria-label="기사님 검색"
    >
      <div className="absolute top-1/2 left-[16px] -translate-y-1/2 lg:left-6" aria-hidden="true">
        <Image src={searchIcon} alt="" className="h-6 w-6 lg:h-[36px] lg:w-[36px]" role="presentation" />
      </div>
      <label htmlFor="mover-search-input" className="sr-only">
        기사님 이름이나 지역을 검색해보세요
      </label>
      <input
        id="mover-search-input"
        type="text"
        placeholder={t("searchPlaceholder")}
        value={input}
        onChange={handleInputChange}
        className="focus:ring-primary-400 bg-bg-secondary text-md lg:text-2lg placeholder:text-md lg:placeholder:text-2lg placeholder:text-gray-450 h-full w-full rounded-2xl pl-[46px] focus:border-transparent focus:ring-2 focus:outline-none lg:pl-17"
        aria-label="기사님 검색"
        aria-describedby="search-description"
        role="searchbox"
        autoComplete="off"
      />
      <span id="search-description" className="sr-only">
        입력하시면 실시간으로 기사님을 검색합니다. 기사님 이름이나 지역명으로 검색 가능합니다.
      </span>
    </div>
  );
};

export default SearchBar;
