"use client";

import { Play } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import CustomSelect from "@/components/select/Select";
import TagInput from "@/components/tagInput/TagInput";

import CategorySelect from "@/app/_app-components/getCategories";
import ExpertSelect from "@/app/_app-components/getExperts";
import { useGetCoursesQuery } from "@/redux/api/courses-api";
import {
  useGetVideoQuery,
  useUpdateVideoMutation,
} from "@/redux/api/videos-api";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth-slice";

import { Category } from "@/types/categories-types";
import { Expert } from "@/types/experts";
import FileUploader from "@/app/_app-components/fileUploader";
import { BASE_URL } from "@/constant/env";

type FormState = {
  title: string;
  link: string;
  type: string;
  category: Category;
  thumbnail: File | string;
  tags: string[];
  expert: Expert;
};

export default function EditVideo() {
  const role = useSelector(selectUserRole);
  const user = useSelector(selectCurrentUser);
  const { id } = useParams();
  const { data: videoData, isLoading: videoLoading } = useGetVideoQuery(
    Array.isArray(id) ? id[0] : id
  );
  const router = useRouter();
  const { refetch } = useGetCoursesQuery();
  const [updateVideo, { isLoading }] = useUpdateVideoMutation();
  logger(videoData, "videoDataaaaaaaa");
  const [formData, setFormData] = useState<FormState>({
    title: "",
    link: "", // Initially, a string (URL) from API
    type: "",
    tags: [],
    category: { id: 0, name: "", icon: "", translations: [] },
    thumbnail: "", // Initially, a string (URL) from API
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

  useEffect(() => {
    if (videoData?.data) {
      const localData = videoData.data;
      setFormData({
        title: localData.title,
        link: localData.link, // URL from API
        type: localData.type,
        tags: localData.tags || [],
        category: {
          id: localData.category.id,
          name: localData.category.name,
          icon: "",
          translations: [],
        },
        thumbnail: localData.thumbnail,
        expert: {
          expert_id: localData.expert.id,
          expert_name: localData.expert.name,
          about: "",
          designation: "",
          profile_picture: "",
        },
      });
    }
  }, [videoData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      toast.info("Please wait, updating video...");
      return;
    }

    if (!formData.title || !formData.category?.id) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const videoFormData = new FormData();
      videoFormData.append("title", formData.title);
      videoFormData.append("type", formData.type);
      videoFormData.append("categoryId", formData.category.id.toString());
      videoFormData.append("expertId", formData.expert.expert_id.toString());
      formData.tags.forEach((tag) => {
        videoFormData.append("tags[]", tag);
      });

      // if (formData.link instanceof File) {
      //   videoFormData.append("link", formData.link);
      // } else {
      //   videoFormData.append("link_url", formData.link);
      // }

      if (formData.thumbnail instanceof File) {
        videoFormData.append("thumbnail", formData.thumbnail);
      } else {
        videoFormData.append("thumbnail_url", formData.thumbnail);
      }

      toast.info("Updating video, please wait...");
      await updateVideo({
        id: Number(Array.isArray(id) ? id[0] : id),
        data: videoFormData,
      });

      toast.success("Video updated successfully!");
      refetch();
      router.push(`/dashboard/videos`);
    } catch (error) {
      logger(error, "Error updating video:");
      toast.error("Failed to update video. Please try again.");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "link" | "thumbnail"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleChange = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <div>
      <Card className='min-h-screen bg-secondary-100 p-10 rounded-2xl'>
        <form
          onSubmit={handleSubmit}
          className='grid lg:grid-cols-[400px,1fr] gap-8'>
          {/* Video Upload Section */}
          <div className='space-y-6'>
            <div className='relative aspect-video bg-[#EAE9EA] rounded-2xl flex items-center justify-center'>
              <FileUploader
                onUploadSuccess={(url) => {
                  handleChange("link", url);
                  toast.success("You can now fill in the video details.");
                }}
              />
            </div>

            <ImageUploader
              imageUrl={
                typeof formData.thumbnail === "string"
                  ? BASE_URL+ "/"+ formData.thumbnail
                  : URL.createObjectURL(formData.thumbnail)
              }
              onFileChange={(file) =>
                setFormData((prev) => ({ ...prev, thumbnail: file }))
              }
              buttonText='Upload Thumbnail'
            />
          </div>

          {/* Form Fields Section */}
          <div className='space-y-6'>
            <Input
              placeholder='Title'
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              variant='light'
              sizeOfInput='large'
              className='w-full rounded-2xl'
            />
            <div onClick={(e) => e.preventDefault()}>
              <CustomSelect
                label='Choose Type'
                value={formData.type}
                onChange={(value) => handleChange("type", value)}
                options={[
                  { label: "general", value: "general" },
                  { label: "meditation", value: "meditation" },
                  { label: "recipe", value: "recipe" },
                ]}
                placeholder='Type'
                variant='light'
                size='base'
                withBorder={true}
                classNames={{
                  trigger: "w-full flex rounded-full border ",
                  selected: "text-opacity-80",
                }}
              />
            </div>

            <TagInput
              tags={formData.tags}
              onTagsChange={(newTags) => handleChange("tags", newTags)}
            />
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
                className='bg-black text-white hover:bg-gray-800 rounded-lg px-8'>
                Save
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
