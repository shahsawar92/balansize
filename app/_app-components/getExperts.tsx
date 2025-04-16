// CategorySelect.js
"use client";

import { useMemo } from "react";

import logger from "@/lib/logger";

import CustomSelect from "@/components/select/Select";

import { useGetExpertsQuery } from "@/redux/api/expert-api";

import { Expert } from "@/types/experts";

interface CategorySelectProps {
  selectedExpert: Expert | undefined;
  onChange: (category: Expert | undefined) => void;
}

export default function ExpertSelect({
  selectedExpert,
  onChange,
}: CategorySelectProps) {
  const { data: categoriesData, isLoading } = useGetExpertsQuery();
  // const categories = categoriesData?.result || [];
  // use memo
  const categories = useMemo(
    () => categoriesData?.result || [],
    [categoriesData]
  );

  logger(selectedExpert, "selectedExpert");

  return (
    <CustomSelect
      label='Select Expert'
      value={selectedExpert?.expert_name ?? ""}
      onChange={(value) => {
        const category = categories.find((t) => t.expert_name === value);
        onChange(category);
      }}
      options={categories.map((t) => ({
        value: t.expert_name,
        label: t.expert_name,
      }))}
      placeholder={isLoading ? "Loading..." : "Experts"}
      variant='light'
      size='base'
      withBorder={true}
      classNames={{
        trigger: "w-full flex rounded-full border ",
        selected: "text-opacity-80",
      }}
    />
  );
}
