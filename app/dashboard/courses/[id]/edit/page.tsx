"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import TagInput from "@/components/tagInput/TagInput";

import CategorySelect from "@/app/_app-components/getCategories";
import ExpertSelect from "@/app/_app-components/getExperts";
import { BASE_URL } from "@/constant/env";
import {
  useGetCourseQuery,
  useGetCoursesQuery,
  useUpdateCourseMutation,
} from "@/redux/api/courses-api";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth-slice";

import { Category } from "@/types/categories-types";
import { Expert } from "@/types/experts";
import { Switch } from "@/components/switch/switch";
import Text from "@/components/text/Text";

type FormState = {
  title: string;
  tags: string[];
  category: Category;
  is_premium: boolean;
  featured_image: File | string | null;
  expert: Expert;
};

export default function CreateBlog() {
  const role = useSelector(selectUserRole);
  logger(role, "role");
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const [addCourse, { isLoading: courseLoading }] = useUpdateCourseMutation();
  const { id } = useParams();
  const { data, isLoading } = useGetCourseQuery(Array.isArray(id) ? id[0] : id);
  const { refetch } = useGetCoursesQuery();
  logger(data, "data");
  useEffect(() => {
    if (data?.data) {
      const { featured_image, expert, ...restData } = data.data;
      const mappedExpert: Expert = {
        expert_id: expert.id,
        expert_name: expert.name,
        about: "",
        designation: "",
        profile_picture: "",
        ...expert,
      };
      setFormData((prev) => ({
        ...prev,
        ...restData,
        expert: mappedExpert,
        featured_image: featured_image,
      }));
    }
  }, [data]);

  const [formData, setFormData] = useState<FormState>({
    title: "",
    tags: [],
    is_premium: false,
    category: { id: 0, name: "", icon: "", translations: [] },
    featured_image: null,
    expert: user
      ? {
          expert_id: user.id ?? 0,
          expert_name: user.name ?? "",
          about: user.about ?? "",
          designation: user.designation ?? "",
          profile_picture: user.profile_picture ?? "",
        }
      : {
          expert_id: 0,
          expert_name: "",
          about: "",
          designation: "",
          profile_picture: "",
        },
  });

  logger(formData, "formData");
  useEffect(() => {
    if (role === "Expert" || role === "User") {
      toast.info(`${user?.name}, you are creating an article as ${role}`);
      setFormData((prev) => ({ ...prev, expert: user }));
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
      !formData.expert?.expert_id
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const articleData = new FormData();
      articleData.append("title", formData.title);
      articleData.append(
        "expertId",
        (formData.expert.expert_id ?? 0).toString()
      );
      articleData.append("categoryId", formData.category.id.toString());
      articleData.append("is_premium", formData.is_premium.toString());
      if (formData.featured_image) {
        articleData.append("featured_image", formData.featured_image);
      }

      formData.tags.forEach((tag) => {
        articleData.append("tags[]", tag);
      });

      toast.info("Creating article, please wait...");
      const response = await addCourse({
        id: parseInt(Array.isArray(id) ? id[0] : id),
        data: articleData,
      });

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
              formData.featured_image instanceof File
                ? URL.createObjectURL(formData.featured_image)
                : BASE_URL + "/" + formData.featured_image ||
                  "/images/placeholder.png"
            }
            onFileChange={(file) =>
              setFormData((prev) => ({ ...prev, featured_image: file }))
            }
            buttonText='Upload Featured Image'
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
