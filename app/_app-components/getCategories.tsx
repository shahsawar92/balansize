"use client";

import { useMemo } from "react";

import CustomSelect from "@/components/select/Select";

import { useGetCategoriesQuery } from "@/redux/api/categories-api";

import { Category } from "@/types/categories-types";
interface CategorySelectProps {
  selectedCategory: Category | undefined;
  onChange: (category: Category | undefined) => void;
}

export default function CategorySelect({
  selectedCategory,
  onChange,
}: CategorySelectProps) {
  const { data: categoriesData, isLoading } = useGetCategoriesQuery();
  // const categories = categoriesData?.result || [];
  // use memo
  const categories = useMemo(
    () => categoriesData?.result || [],
    [categoriesData]
  );

  return (
    <CustomSelect
      label='Categories'
      value={selectedCategory?.name ?? ""}
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
