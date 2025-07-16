"use client";
import { SearchInput } from "@/components/common/input/SearchInput";
import { FormProvider, useForm } from "react-hook-form";
import React from "react";
import { SmallFilterSection } from "./SmallFilterSection";
import { PcFillterSection } from "./PcFillterSection";

export const FilterAndSearchSection = () => {
  const methods = useForm();
  return (
    <>
      {/* 하단 인풋 영역 */}
      <div className="flex w-full flex-col gap-4 md:gap-7 lg:gap-6">
        <FormProvider {...methods}>
          <SearchInput name="search" placeholder="어떤 고객님을 찾고 계세요?" />
        </FormProvider>
        <div className="lg:hidden">
          <SmallFilterSection />
        </div>
        <div className="hidden w-full lg:block">
          <PcFillterSection />
        </div>
      </div>
    </>
  );
};
