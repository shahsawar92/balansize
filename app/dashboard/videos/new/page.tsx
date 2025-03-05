"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useAddVideoMutation } from "@/redux/api/videos-api";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth-slice";

import { Category } from "@/types/categories-types";
import { Expert } from "@/types/experts";
import Swal from "sweetalert2";

type FormState = {
  title: string;
  link: File | null;
  type: string;
  category: Category;
  thumbnail: File | null;
  tags: string[];
  expert: Expert;
};

export default function CreateVideo() {
  const role = useSelector(selectUserRole);
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const { refetch } = useGetCoursesQuery();
  const [addVideo, { isLoading }] = useAddVideoMutation();

  const [formData, setFormData] = useState<FormState>({
    title: "",
    link: null,
    type: "",
    tags: [],
    category: { id: 0, name: "", icon: "", translations: [] },
    thumbnail: null,
    expert: user || {
      id: 0,
      name: "",
      about: "",
      designation: "",
      profile_picture: "",
    },
  });

  useEffect(() => {
    if (role === "Expert" || role === "User") {
      const udata = JSON.parse(user);
      toast.info(`${udata?.name}, you are creating an video as ${role}`);
      setFormData((prev) => ({ ...prev, expert: udata as Expert }));
    }
  }, [role, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      toast.info("Please wait, video is being uploaded...");
      return;
    }

    if (!formData.title || !formData.category?.id) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      Swal.fire({
        title: "Uploading...",
        text: "Please wait while we are uplading the video.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const articleData = new FormData();
      articleData.append("title", formData.title);
      articleData.append("type", formData.type);
      if (formData.link) articleData.append("link", formData.link);
      if (formData.thumbnail)
        articleData.append("thumbnail", formData.thumbnail);
      articleData.append("categoryId", formData.category.id.toString());
      formData.tags.forEach((tag) => {
        articleData.append("tags[]", tag);
      });
      articleData.append("expertId", formData?.expert?.expert_id.toString());

      toast.info("Creating video, please wait...");
      const response = await addVideo(articleData).unwrap();

      Swal.close();
      toast.success("Video created successfully!");
      logger(response, "Video created successfully");

      await refetch();
      router.push(`/dashboard/videos`);
    } catch (error) {
      logger(error, "Error uploading video:");
      toast.error("Failed to upload video. Please try again.");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error("Video size must be 15MB or less!");
        return;
      }
      setFormData((prev) => ({ ...prev, link: file }));
    }
  };

  const handleChange = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const videoPreview = useMemo(() => {
    return formData.link ? URL.createObjectURL(formData.link) : null;
  }, [formData.link]);

    useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  return (
    <div>
      <Card className='min-h-screen bg-secondary-100 p-10 rounded-2xl'>
        <form
          onSubmit={handleSubmit}
          className='grid lg:grid-cols-[400px,1fr] gap-8'>
          {/* Video Upload Section */}
          <div className='space-y-6'>
            <div className='relative aspect-video bg-[#EAE9EA] rounded-2xl flex items-center justify-center'>
              {videoPreview ? (
                <video
                  src={videoPreview}
                  className='w-full h-full object-cover rounded-2xl'
                  controls
                />
              ) : (
                <div className='text-center'>
                  <Input
                    type='file'
                    accept='video/*'
                    onChange={handleVideoUpload}
                    className='hidden'
                    id='video-upload'
                    classNames={{ container: "shadow-md" }}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      document.getElementById("video-upload")?.click()
                    }
                    className='flex flex-col items-center gap-2 text hover:text-gray-700'>
                    <Play className='w-12 h-12' />
                    <span>Upload Video</span>
                  </button>
                </div>
              )}
            </div>

            <ImageUploader
              imageUrl={
                formData.thumbnail
                  ? URL.createObjectURL(formData.thumbnail)
                  : "/images/placeholder.png"
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
            <div className='space-y-6' onClick={(e) => e.preventDefault()}>
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
              />

              <TagInput
                tags={formData.tags}
                onTagsChange={(newTags) => handleChange("tags", newTags)}
              />

              <CategorySelect
                selectedCategory={formData.category}
                onChange={(category) =>
                  category && handleChange("category", category)
                }
              />

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
