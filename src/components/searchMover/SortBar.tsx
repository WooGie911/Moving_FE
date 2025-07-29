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
    <SortDropdown
      options={sortOptions}
      value={sort || ""}
      onChange={handleSortChange}
      placeholder={t("sortByReview")}
    />
  );
};

export default SortBar;
