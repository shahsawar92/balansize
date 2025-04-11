"use client";

import { Router, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import { TextEditor } from "@/components/editor/Editor";
import Input from "@/components/input/Input";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
import TagInput from "@/components/tagInput/TagInput";

import CategorySelect from "@/app/_app-components/getCategories";
import ExpertSelect from "@/app/_app-components/getExperts";
import {
  useAddArticleMutation,
  useGetArticlesQuery,
} from "@/redux/api/articles-api";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth-slice";

import { Category } from "@/types/categories-types";
import { Expert } from "@/types/experts";
import CustomSelect from "@/components/select/Select";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

type FormState = {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  type: string;
  category: Category;
  min_to_read: number;
  feature_image: File | null;
  expert: Expert;
};

export default function CreateBlog() {
  const role = useSelector(selectUserRole);
  logger(role, "role");
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const { refetch } = useGetArticlesQuery();

  const [formData, setFormData] = useState<FormState>({
    title: "",
    content: "",
    excerpt: "",
    type: "",
    tags: [],
    category: { id: 0, name: "", icon: "", translations: [] },
    min_to_read: 5,
    feature_image: null,
    expert: user || {
      id: 0,
      name: "",
      about: "",
      designation: "",
      profile_picture: "",
    },
  });

  const [addArticle, { isLoading }] = useAddArticleMutation();

  logger(formData, "formData");
  useEffect(() => {
    if (role === "Expert" || role === "User") {
      const udata = user;
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

    if (!formData.title || !formData.content || !formData.category?.id) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const articleData = new FormData();
      articleData.append("title", formData.title);
      articleData.append("content", formData.content);
      articleData.append("excerpt", formData.excerpt);
      articleData.append("min_to_read", formData.min_to_read.toString());
      articleData.append("expertId", formData?.expert?.expert_id.toString());
      articleData.append("type", formData.type);

      if (formData.feature_image) {
        articleData.append("feature_image", formData.feature_image);
      }

      articleData.append("categoryId", formData.category.id.toString());

      formData.tags.forEach((tag) => {
        articleData.append("tags[]", tag);
      });

      toast.info("Creating article, please wait...");
      const response = await addArticle(articleData).unwrap();

      toast.success("Article created successfully!");
      logger(response, "Article created successfully");

      await refetch();
      router.push(`/dashboard/articles`);
    } catch (error) {
      logger(error, "Error creating article:");
      toast.error("Failed to create article. Please try again.");
    }
  };

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({ ...prev, feature_image: file }));
      }
    },
    []
  );

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
            Create New Article
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
          <Input
            placeholder='Excerpt'
            value={formData.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            variant='light'
            sizeOfInput='base'
            className='w-full'
          />
          {/* imageUrl = "/images/placeholder.png", onFileChange, buttonText =
          "Upload Photo", */}
          <ImageUploader
            imageUrl={
              formData.feature_image
                ? URL.createObjectURL(formData.feature_image)
                : "/images/placeholder.png"
            }
            onFileChange={(file) => handleChange("feature_image", file)}
            buttonText='Upload Featured Image'
          />

          <div onClick={(e) => e.preventDefault()}>
            <TextEditor
              initialValue={formData.content}
              height={300}
              onChange={(content) => handleChange("content", content)}
            />
          </div>
          <div onClick={(e) => e.preventDefault()}>
            <CustomSelect
              label='Type'
              options={[
                { label: "General", value: "general" },
                { label: "Meditation", value: "meditation" },
                { label: "Recipe", value: "recipe" },
              ]}
              value={formData.type}
              onChange={(value) => handleChange("type", value)}
              variant='light'
              size='base'
              withBorder={true}
              classNames={{
                trigger: "w-full flex rounded-full border ",
                selected: "text-opacity-80",
              }}
            />
          </div>
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
