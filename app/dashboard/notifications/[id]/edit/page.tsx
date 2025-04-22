"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

import { BASE_URL } from "@/constant/env";
import {
  useGetNotificationsQuery,
  useGetSingleNotificationQuery,
  useUpdateNotificationMutation,
} from "@/redux/api/notifications-api";

export default function EditOnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading: isFetching } = useGetSingleNotificationQuery(id);
  const [updateNotification, { isLoading: isUpdating }] =
    useUpdateNotificationMutation();
  const { refetch } = useGetNotificationsQuery();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    if (data?.result) {
      const { title, message, isActive, icon } = data.result;
      setTitle(String(title));
      setDescription(message);
      setIsActive(Boolean(isActive));
      setExistingImage(icon);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", description);
    formData.append("isActive", String(isActive));
    if (imageFile) {
      formData.append("icon", imageFile);
    }

    try {
      const response = await updateNotification({
        id: parseInt(id),
        data: formData,
      }).unwrap();
      if (response.success) {
        toast.success("Notification updated successfully!");
        refetch();
        router.push("/dashboard/notifications");
      } else {
        toast.error("Failed to update Notification.");
      }
    } catch (error) {
      toast.error("Error updating Notification. Please try again.");
    }
  };

  if (isFetching) {
    return <p className='text-center mt-10'>Loading Notification data...</p>;
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Edit Notification</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block font-medium mb-1'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

        <div className='flex items-center gap-2'>
          <input
            id='isActive'
            type='checkbox'
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className='w-4 h-4'
          />
          <label htmlFor='isActive' className='text-sm'>
            Active
          </label>
        </div>

        <Button type='submit' variant='brown' disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Onboarding"}
        </Button>
      </form>
    </div>
  );
}
