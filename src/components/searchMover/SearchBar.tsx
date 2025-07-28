"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import Image from "next/image";
import searchIcon from "@/assets/icon/etc/icon-search-lg.png";

const SearchBar = () => {
  const { search, setSearch } = useSearchMoverStore();
  const [input, setInput] = useState(search || "");
  const t = useTranslations("mover");

  useEffect(() => {
    setInput(search || "");
  }, [search]);

  const handleSearch = () => {
    setSearch(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative mb-[22px] h-14 w-full max-w-[327px] md:mb-[26px] md:max-w-[601px] lg:mb-[38px] lg:h-16 lg:max-w-[819px]">
      <div className="absolute top-1/2 left-[16px] -translate-y-1/2 lg:left-6">
        <Image src={searchIcon} alt="검색" className="h-6 w-6 lg:h-[36px] lg:w-[36px]" />
      </div>
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        className="focus:ring-primary-400 bg-bg-secondary text-md lg:text-2lg placeholder:text-md lg:placeholder:text-2lg placeholder:text-gray-450 h-full w-full rounded-2xl pl-[46px] focus:border-transparent focus:ring-2 focus:outline-none lg:pl-17"
      />
    </div>
  );
};

export default SearchBar;
