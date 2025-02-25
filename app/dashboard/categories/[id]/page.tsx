"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import Input from "@/components/input/Input";
import Label from "@/components/text/Label";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import {
  useDeleteCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/api/categories-api";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetCategoryQuery(Number(id));
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string | File | null>(null);

  useEffect(() => {
    if (data) {
      setName(data.result?.name);
      setIcon(data.result?.icon || null);
    }
  }, [data]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const translations = [
      {
        language: "en",
        name: name,
      },
    ];
    const formData = new FormData();
    formData.append("name", name);
    if (icon) formData.append("icon", icon);
    translations.forEach((value, key) => {
      formData.append(`translations[${key}][language]`, value.language);
      formData.append(`translations[${key}][name]`, value.name);
    });

    try {
      await updateCategory({ id: Number(id), data: formData }).unwrap();
      router.push("/dashboard/categories");
    } catch (error) {
      logger(error, "Failed to update category:");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(Number(id)).unwrap();
        router.push("/dashboard/categories");
      } catch (error) {
        logger(error, "Failed to delete category");
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='p-6 max-w-md mx-auto bg-white rounded-lg shadow-md'>
      <Text
        variant='light'
        size='lg'
        weight='normal'
        className='text-lg font-bold mb-4'>
        Edit Category
      </Text>
      <form onSubmit={handleUpdate}>
        <div className='mb-4'>
          <Label htmlFor='name' className='block text-sm font-medium'>
            Category Name
          </Label>
          <Input
            sizeOfInput='base'
            variant='light'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          {/* display icon */}
          <Label htmlFor='name' className='block text-sm font-medium'>
            Category Icon
          </Label>
          <Image
            src={
              icon instanceof File
                ? URL.createObjectURL(icon)
                : icon
                  ? `${BASE_URL}/${icon}`
                  : "/images/placeholder.png"
            }
            width={64}
            height={64}
            alt={name}
            className='w-16 h-16 rounded-full object-cover mb-4'
          />
        </div>
        <div className='mb-4'>
          <Label htmlFor='name' className='block text-sm font-medium'>
            Change Icon
          </Label>{" "}
          <input
            type='file'
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
          />
        </div>

        <Button
          type='submit'
          variant='brown'
          sizeOfButton='base'
          isLoading={isUpdating}
          disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </Button>

        <Button
          type='button'
          variant='danger'
          sizeOfButton='base'
          isLoading={isDeleting}
          onClick={handleDelete}
          disabled={isDeleting}
          className='ml-4'>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </div>
  );
}
