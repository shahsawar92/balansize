"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddTagMutation, useGetTagsQuery } from "@/redux/api/tags-api";
import Button from "@/components/buttons/Button";
import { toast } from "react-toastify";
import logger from "@/lib/logger";

export default function AddTagPage() {
  const [name, setName] = useState("");
  const { refetch } = useGetTagsQuery();

  const [translations, setTranslations] = useState([
    { language: "en", name: "" },
  ]);
  const router = useRouter();
  const [addTag, { isLoading }] = useAddTagMutation();

  const handleTranslationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedTranslations = [...translations];
    updatedTranslations[index] = {
      ...updatedTranslations[index],
      [field]: value,
    };
    setTranslations(updatedTranslations);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setTranslations((prev) =>
      prev.map((t) => (t.language === "en" ? { ...t, name: value } : t))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addTag({ name, translations }).unwrap();
      logger(res, "response");
      if (res.success) toast.success("Tag added successfully");
      else toast.error("Tag already exists");
      if (!res.success) return;
      refetch();
      router.push("/dashboard/tags");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className='min-h-dvh bg-secondary-100 rounded-2xl p-6 flex justify-center items-center'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-xl font-semibold text-main-black mb-4'>
          Add New Tag
        </h2>

        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Tag Name
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className='mt-1 p-2 w-full border rounded-md'
          />
        </div>

        {translations
          .filter((t) => t.language !== "en")
          .map((translation, index) => (
            <div key={index} className='mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                {`Name (${translation.language.toUpperCase()})`}
              </label>
              <input
                type='text'
                value={translation.name}
                onChange={(e) =>
                  handleTranslationChange(index, "name", e.target.value)
                }
                required
                className='mt-1 p-2 w-full border rounded-md'
              />
            </div>
          ))}

        <Button type='submit' variant='brown' disabled={isLoading}>
          {" "}
          {isLoading ? "Saving..." : "Add Tag"}
        </Button>
      </form>
    </div>
  );
}
