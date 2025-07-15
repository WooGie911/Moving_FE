"use client";

import React from "react";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import SortDropdown from "@/components/common/dropdown/SortDropdown";
import { SORT_OPTIONS } from "@/lib/utils/regionMapping";

const SortBar = () => {
  const { sort, setSort } = useSearchMoverStore();

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
    <SortDropdown options={SORT_OPTIONS} value={sort || ""} onChange={handleSortChange} placeholder="리뷰 많은 순" />
  );
};

export default SortBar;
