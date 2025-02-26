"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import Button from "@/components/buttons/Button";
import Input from "@/components/input/Input";
import NextImage from "@/components/NextImage";
import Text from "@/components/text/Text";
import {
  useGetExpertQuery,
  useUpdateExpertMutation,
} from "@/redux/api/expert-api";
import { Expert } from "@/types/experts";
import { BASE_URL } from "@/constant/env";
import logger from "@/lib/logger";
import CategorySelect from "@/app/_app-components/getCategories";
import { Category } from "@/types/categories-types";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [category, setCategory] = useState<Category | undefined>(undefined);

  // Fetch expert data
  const { data: expert, isLoading } = useGetExpertQuery(id);
  const [updateExpert, { isLoading: isUpdating }] = useUpdateExpertMutation();

  // State for user details
  const [user, setUser] = useState<Expert>({
    id: 0,
    name: "",
    designation: "",
    about: "",
    profile_picture: "",
    categoryId: 0,
  });

  // Update user state when expert data is fetched
  useEffect(() => {
    if (expert?.result) {
      setUser(expert.result);
    }
  }, [expert]);

  // Image Upload & Preview Handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>(
    "/images/default-profile.jpg"
  );

  useEffect(() => {
    if (expert?.result?.profile_picture) {
      setImageUrl(`${BASE_URL}/${expert.result.profile_picture}`);
    }
  }, [expert]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      setUser({ ...user, profile_picture: file });
      // Implement image upload logic here if needed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("designation", user.designation);
      formData.append("about", user.about);
      formData.append("categoryId", (user.categoryId ?? 0).toString());

      // Ensure profile_picture is a file before appending
      if (user.profile_picture instanceof File) {
        formData.append("profile_picture", user.profile_picture);
      }

      logger(formData, "formData");

      await updateExpert({ id: parseInt(id), data: formData }).unwrap();
      router.push("/dashboard/experts");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className='w-full max-w-7xl py-5 px-5 mx-auto bg-secondary-100 rounded-2xl'>
      <div className='relative'>
        {/* Profile Image */}
        <div className='absolute right-8 top-0'>
          <div
            onClick={handleImageClick}
            className='relative w-12 h-12 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'>
            <NextImage
              useSkeleton
              src={imageUrl}
              alt='Profile Picture'
              width={126}
              height={126}
              className='object-cover w-full h-full'
              classNames={{
                image: "object-cover w-full h-full",
                blur: "bg-gray-200",
              }}
            />
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleImageChange}
              accept='image/*'
              className='hidden'
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6 mt-12 max-w-2xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              placeholder='Name'
              variant='light'
              sizeOfInput='large'
              className='w-full max-w-80'
              withBorder={false}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <Input
              placeholder='Designation'
              variant='light'
              className='w-full max-w-80'
              withBorder={false}
              sizeOfInput='large'
              value={user.designation}
              onChange={(e) =>
                setUser({ ...user, designation: e.target.value })
              }
            />
          </div>

          <Input
            placeholder='About'
            type='text'
            variant='light'
            className='w-full max-w-80'
            withBorder={false}
            sizeOfInput='large'
            value={user.about}
            onChange={(e) => setUser({ ...user, about: e.target.value })}
          />

          {/* Category */}
          <div
            className='flex items-center gap-4'
            onClick={(e) => e.preventDefault()}>
            <CategorySelect
              selectedCategory={category}
              onChange={(category) => {
                setCategory(category);
                setUser({ ...user, categoryId: category?.id || 0 });
              }}
            />
          </div>

          {/* Submit Button */}
          <div className='absolute bottom-0 right-0'>
            <Button
              type='submit'
              className='w-full max-w-28 items-center justify-center rounded-full'
              sizeOfButton='large'
              variant='brown'
              disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
