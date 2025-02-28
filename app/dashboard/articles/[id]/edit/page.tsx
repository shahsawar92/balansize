"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import { TextEditor } from "@/components/editor/Editor";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
import CustomSelect from "@/components/select/Select";
import TagInput from "@/components/tagInput/TagInput";

import CategorySelect from "@/app/_app-components/getCategories";
import ExpertSelect from "@/app/_app-components/getExperts";
import { BASE_URL } from "@/constant/env";
import {
  useAddArticleMutation,
  useGetArticleQuery,
  useGetArticlesQuery,
  useUpdateArticleMutation,
  // useUpdateArticleMutation,
} from "@/redux/api/articles-api";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth-slice";

import { Expert } from "@/types/articles";
import { Category } from "@/types/categories-types";

export default function CreateBlog() {
  const role = useSelector(selectUserRole);
  const user = useSelector(selectCurrentUser);
  const { id } = useParams();

  const { data: article } = useGetArticleQuery(Number(id));

  logger(article, "Article Data");
  const [updateArticle, { isLoading }] = useUpdateArticleMutation();
  const { refetch } = useGetArticlesQuery();
  const router = useRouter();
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    excerpt: string;
    type: string;
    tags: string[];
    category: Category;
    min_to_read: number;
    feature_image: string | null;
    expert: Expert;
  }>({
    title: "",
    content: "",
    excerpt: "",
    type: "",
    tags: [],
    category: {
      id: 0,
      name: "",
      icon: "",
      translations: [],
    },
    min_to_read: 5,
    feature_image: null,
    expert: user || {
      id: 0,
      expert_name: "",
      about: "",
      designation: "",
      profile_picture: "",
    },
  });

  useEffect(() => {
    if (article?.data) {
      const {
        title,
        excerpt,
        content,
        type,
        min_to_read,
        feature_image,
        category,
        tags,
        expert,
      } = article.data;

      setFormData((prev) => ({
        ...prev,
        title,
        excerpt,
        content,
        type,
        tags: Array.isArray(tags) ? tags.map((tag) => String(tag)) : [],
        min_to_read,
        feature_image,
        category,
        expert,
      }));
    }
  }, [article]);

  logger(formData, "formData");
  useEffect(() => {
    if (role === "Expert" || role === "User") {
      const udata = JSON.parse(user);
      toast.info(`${udata?.name}, you are creating an article as ${role}`);
      setFormData((prev) => ({
        ...prev,
        expert: { ...udata, id: udata.id },
      }));
    }
  }, [role, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

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
      articleData.append("expertId", formData?.expert?.id.toString());
      articleData.append("type", formData.type);

      if (formData.feature_image) {
        articleData.append("feature_image", formData.feature_image);
      }

      articleData.append("categoryId", formData.category.id.toString());

      (formData?.tags || []).forEach((tag) => {
        articleData.append("tags[]", tag);
      });

      const response = await updateArticle({
        id: Number(id),
        data: articleData,
      }).unwrap();

      toast.success("Article updated successfully!");
      logger(response, "Article updated successfully");
 
      await refetch();
      router.push("/dashboard/articles");
    } catch (error) {
      toast.error("Failed to update article. Please try again.");
      logger(error, "Error updating article:");
    }
  };

  interface FormData {
    title: string;
    content: string;
    excerpt: string;
    type: string;
    tags: string[];
    category: Category;
    min_to_read: number;
    feature_image: File | string | null;
    expert: Expert;
  }

  type FormDataField = keyof FormData;

  const handleChange = useCallback(
    <K extends FormDataField>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  logger(formData.feature_image, "featured image");

  return (
    <div className='min-h-screen bg-secondary-100 p-6'>
      {isLoading && <LoadingOverlay />}

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

          <ImageUploader
            imageUrl={(BASE_URL + "/" + formData.feature_image) as string}
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
              selectedExpert={{
                expert_id: formData.expert.id,
                expert_name: formData.expert.name,
                about: formData.expert.about,
                designation: formData.expert.designation,
                profile_picture: formData.expert.profile_picture,
              }}
              onChange={
                (expert) =>
                  expert &&
                  logger(
                    {
                      ...expert,

                      id: expert.expert_id,
                      name: expert.expert_name,
                      about: expert.about,
                      designation: expert.designation,
                      profile_picture: expert.profile_picture,
                    },
                    "selected expert"
                  )
                // handleChange("expert", {
                //   expert_id: expert.id,
                //   name: expert.expert_name,
                //   about: expert.about,
                //   designation: expert.designation,
                //   profile_picture: expert.profile_picture,
                // })
              }
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
