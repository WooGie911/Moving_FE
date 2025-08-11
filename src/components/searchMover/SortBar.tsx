"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import SortDropdown from "@/components/common/dropdown/SortDropdown";
import { Option } from "@/types/dropdown";

const SortBar = () => {
  const { sort, setSort } = useSearchMoverStore();
  const t = useTranslations("mover");

  const sortOptions: Option[] = [
    { value: "review", label: t("sortByReview") },
    { value: "rating", label: t("sortByRating") },
    { value: "career", label: t("sortByCareer") },
    { value: "confirmed", label: t("sortByConfirmed") },
  ];

  const handleSortChange = (value: string | number) => {
    const stringValue = String(value);
    if (stringValue === "") {
      setSort(undefined);
    } else if (
      stringValue === "rating" ||
      stringValue === "review" ||
      stringValue === "career" ||
      stringValue === "confirmed"
    ) {
      setSort(stringValue as "review" | "rating" | "career" | "confirmed");
    }
  };

  return (
    <div role="group" aria-labelledby="sort-dropdown-label">
      <label id="sort-dropdown-label" className="sr-only">
        기사님 목록 정렬 방식 선택
      </label>
      <SortDropdown
        options={sortOptions}
        value={sort || ""}
        onChange={handleSortChange}
        placeholder={t("sortByReview")}
        aria-label="정렬 방식 선택"
        aria-describedby="sort-description"
      />
      <span id="sort-description" className="sr-only">
        선택한 기준에 따라 기사님 목록이 정렬됩니다.
        {sort ? `현재 ${sortOptions.find((option) => option.value === sort)?.label}으로 정렬되어 있습니다.` : ""}
      </span>
    </div>
  );
};

export default SortBar;
