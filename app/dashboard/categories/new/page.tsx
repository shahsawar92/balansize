"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";

import {
  useAddCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/api/categories-api";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<File | null>(null);
  const { refetch } = useGetCategoriesQuery();

  //   const [translations, setTranslations] = useState<
  //     { language: string; name: string }[]
  //   >([
  //     { language: "en", name: "" },
  //     { language: "es", name: "" },
  //   ]);
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  //   const handleTranslationChange = (
  //     index: number,
  //     field: "language" | "name",
  //     value: string
  //   ) => {
  //     setTranslations((prev) =>
  //       prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
  //     );
  //   };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const translations = [{ language: "en", name: name }];

    const formData = new FormData();
    formData.append("name", name);
    if (icon) formData.append("icon", icon);

    // Append translations individually using bracket notation
    translations.forEach((t, index) => {
      formData.append(`translations[${index}][language]`, t.language);
      formData.append(`translations[${index}][name]`, t.name);
    });

    try {
      const res = await addCategory(formData).unwrap();
      res && toast.success("Category added successfully");
      await refetch();
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  return (
    <div className='p-6 max-w-md mx-auto bg-white rounded-lg shadow-md'>
      <h2 className='text-lg font-bold mb-4'>Add New Category</h2>
      <form onSubmit={handleSubmit}>
        {/* Category Name Input */}
        <div className='mb-4'>
          <label className='block text-sm font-medium'>Category Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border p-2 rounded'
            required
          />
        </div>

        {/* Category Icon Upload */}
        <div className='mb-4'>
          <label className='block text-sm font-medium'>Category Icon</label>
          <input
            type='file'
            accept='image/*'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIcon(e.target.files?.[0] || null)
            }
            className='w-full border p-2 rounded'
          />
        </div>

        {/* Translations Input */}
        {/* {translations.map((t, index) => (
          <div key={index} className='mb-4'>
            <label className='block text-sm font-medium'>
              Translation ({t.language.toUpperCase()})
            </label>
            <input
              type='text'
              value={t.name}
              onChange={(e) =>
                handleTranslationChange(index, "name", e.target.value)
              }
              className='w-full border p-2 rounded'
              placeholder={`Enter ${t.language} translation`}
            />
          </div>
        ))} */}

        {/* Submit Button */}
        <Button type='submit' variant='brown' disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Category"}
        </Button>
      </form>
    </div>
  );
}
