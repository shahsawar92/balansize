"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

import { BASE_URL } from "@/constant/env";
import {
  useGetPartnerQuery,
  useUpdatePartnerMutation,
} from "@/redux/api/partners-api";
import logger from "@/lib/logger";

export default function EditOnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading: isFetching } = useGetPartnerQuery(id);
  logger(data, "Onboarding Data");
  const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();

  const [link, setlink] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    if (data?.data) {
      const { link, description, logo } = data.data;
      setlink(link);
      setDescription(description);
      setExistingImage(logo);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!link || !description) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("link", link);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await updatePartner({
        id: parseInt(id),
        data: formData,
      }).unwrap();
      if (response.success) {
        toast.success("Partners updated successfully!");
        router.push("/dashboard/partners");
      } else {
        toast.error("Failed to update partner.");
      }
    } catch (error) {
      toast.error("Error updating Partner. Please try again.");
    }
  };

  if (isFetching) {
    return <p className='text-center mt-10'>Loading onboarding data...</p>;
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Edit Onboarding</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block font-medium mb-1'>Title</label>
          <input
            type='text'
            value={link}
            onChange={(e) => setlink(e.target.value)}
            className='w-full border px-4 py-2 rounded-lg'
            placeholder='Enter title'
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full border px-4 py-2 rounded-lg'
            placeholder='Enter description'
            rows={4}
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Image</label>
          <ImageUploader
            imageUrl={
              imageFile
                ? URL.createObjectURL(imageFile)
                : BASE_URL + "/" + existingImage || "/images/placeholder.png"
            }
            onFileChange={(file) => setImageFile(file)}
            buttonText='Upload New Image'
          />
        </div>

        <Button type='submit' variant='brown' disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Partner"}
        </Button>
      </form>
    </div>
  );
}
