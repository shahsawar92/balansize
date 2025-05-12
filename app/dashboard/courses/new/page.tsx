"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import { Switch } from "@/components/switch/switch";
import TagInput from "@/components/tagInput/TagInput";
import Text from "@/components/text/Text";

import CategorySelect from "@/app/_app-components/getCategories";
import ExpertSelect from "@/app/_app-components/getExperts";
import {
  useAddCourseMutation,
  useGetCoursesQuery,
} from "@/redux/api/courses-api";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth-slice";

import { Category } from "@/types/categories-types";
import { Expert } from "@/types/experts";

type FormState = {
  title: string;
  tags: string[];
  is_premium: boolean;
  category: Category;
  featured_image: File | null;
  expert: Expert;
};

export default function CreateBlog() {
  const role = useSelector(selectUserRole);
  logger(role, "role");
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const { refetch } = useGetCoursesQuery();

  const [formData, setFormData] = useState<FormState>({
    title: "",
    tags: [],
    category: { id: 0, name: "", icon: "", translations: [] },
    featured_image: null,
    is_premium: false,
    expert: user || {
      id: 0,
      name: "",
      about: "",
      designation: "",
      profile_picture: "",
    },
  });

  const [addCourse, { isLoading }] = useAddCourseMutation();

  useEffect(() => {
    if (role === "Expert" || role === "User") {
      const udata = JSON.parse(user);
      toast.info(`${udata?.name}, you are creating an article as ${role}`);
      setFormData((prev) => ({ ...prev, expert: udata as Expert }));
    }
  }, [role, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      toast.info("Please wait, article is being created...");
      return;
    }

    if (
      !formData.title ||
      !formData.category?.id ||
      !formData.expert.expert_id
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const articleData = new FormData();
      articleData.append("title", formData.title);

      articleData.append("expertId", formData?.expert?.expert_id.toString());
      articleData.append("is_premium", formData?.is_premium.toString());
      if (formData.featured_image) {
        articleData.append("featured_image", formData.featured_image);
      }

      articleData.append("categoryId", formData.category.id.toString());

      formData.tags.forEach((tag) => {
        articleData.append("tags[]", tag);
      });

      toast.info("Creating article, please wait...");
      const response = await addCourse(articleData).unwrap();

      toast.success("Article created successfully!");
      logger(response, "Article created successfully");

      await refetch();
      router.push(`/dashboard/courses`);
    } catch (error) {
      logger(error, "Error creating article:");
      toast.error("Failed to create article. Please try again.");
    }
  };

  const handleChange = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <div className='min-h-screen bg-secondary-100 p-6'>
      <Card className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-8'>
            Create New Course
          </h1>

          <Input
            placeholder='Title'
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            variant='light'
            sizeOfInput='base'
            className='w-full'
            required
          />

          <ImageUploader
            imageUrl={
              formData.featured_image
                ? URL.createObjectURL(formData.featured_image)
                : "/images/placeholder.png"
            }
            onFileChange={(file) =>
              setFormData((prev) => ({ ...prev, featured_image: file }))
            }
          />

          <div onClick={(e) => e.preventDefault()}>
            <TagInput
              tags={formData.tags}
              onTagsChange={(newTags) => handleChange("tags", newTags)}
            />
          </div>

          <div onClick={(e) => e.preventDefault()}>
            <CategorySelect
              selectedCategory={formData.category}
              onChange={(category) =>
                category && handleChange("category", category)
              }
            />
          </div>

          <div onClick={(e) => e.preventDefault()}>
            <ExpertSelect
              selectedExpert={formData.expert}
              onChange={(expert) => expert && handleChange("expert", expert)}
            />
          </div>
          <div className='flex items-center gap-4 bg-secondary-300 p-2 rounded shadow bg-opacity-50'>
            <Switch
              checked={formData.is_premium}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  is_premium: checked,
                }))
              }
            />

            <Text variant='secondary' size='sm'>
              Is Premium
            </Text>
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-main-brown text-white hover:bg-primary-700 rounded-full px-8 py-2'
              disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Article"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
