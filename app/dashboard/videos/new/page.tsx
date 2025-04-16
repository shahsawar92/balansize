"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import CustomSelect from "@/components/select/Select";
import TagInput from "@/components/tagInput/TagInput";

import FileUploader from "@/app/_app-components/fileUploader";
import CategorySelect from "@/app/_app-components/getCategories";
import ExpertSelect from "@/app/_app-components/getExperts";
import { useGetCoursesQuery } from "@/redux/api/courses-api";
import { useAddVideoMutation } from "@/redux/api/videos-api";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth-slice";

import { Category } from "@/types/categories-types";
import { Expert } from "@/types/experts";

type FormState = {
  title: string;
  link: string;
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
  const [canAddMoreInfo, setCanAddMoreInfo] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    title: "",
    link: "",
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

    if (
      !formData.title ||
      !formData.category?.id ||
      !formData.expert.expert_id
    ) {
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
      await addVideo(articleData).unwrap();
      Swal.close();
      toast.success("Video created successfully!");

      await refetch();
      router.push(`/dashboard/videos`);
    } catch (error) {
      Swal.close();
      logger(error, "Error uploading video:");
      toast.error("Failed to upload video. Please try again.");
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
            <FileUploader
              onUploadSuccess={(url) => {
                handleChange("link", url);
                setCanAddMoreInfo(true); // Enable form fields
                toast.success("You can now fill in the video details.");
              }}
            />
            <div
              className={`space-y-6 ${!canAddMoreInfo ? "opacity-50 pointer-events-none" : ""}`}>
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
          </div>
          {/* Form Fields Section */}
          <div
            className={`space-y-6 ${!canAddMoreInfo ? "opacity-50 pointer-events-none" : ""}`}
            onClick={(e) => e.preventDefault()}>
            <Input
              placeholder='Title'
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              variant='light'
              sizeOfInput='large'
              className='w-full rounded-2xl'
              disabled={!canAddMoreInfo}
            />

            {/* Disable interactions when `canAddMoreInfo` is false */}
            <div>
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
                classNames={{
                  trigger: "w-full flex rounded-full border ",
                  selected: "text-opacity-80",
                }}
              />

              <div className='flex justify-between items-center mt-4 text-sm font-medium text-gray-700'>
                Tags
              </div>
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
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-black text-white hover:bg-gray-800 rounded-lg px-8'
              disabled={!canAddMoreInfo} // Disable the submit button until the file is uploaded
            >
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
