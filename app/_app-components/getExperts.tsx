// CategorySelect.js
"use client";

import { useMemo } from "react";

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

  return (
    <CustomSelect
      label='Select Expert'
      value={selectedExpert?.name ?? ""}
      onChange={(value) => {
        const category = categories.find((t) => t.name === value);
        onChange(category);
      }}
      options={categories.map((t) => ({ value: t.name, label: t.name }))}
      placeholder={isLoading ? "Loading..." : "Categories"}
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
