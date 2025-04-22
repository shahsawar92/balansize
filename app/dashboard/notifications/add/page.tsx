"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import {
  useAddNotificationMutation,
  useGetNotificationsQuery,
} from "@/redux/api/notifications-api";

export default function AddOnboardingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isTrue, setIsTrue] = useState(true);
  const [icon, setIcon] = useState<File | null>(null);

  const [addNotification, { isLoading }] = useAddNotificationMutation();
  const { refetch } = useGetNotificationsQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message || !icon) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("icon", icon);
    formData.append("isTrue", isTrue ? "1" : "0");

    try {
      const response = await addNotification(formData).unwrap();
      if (response.success) {
        toast.success("Notification added successfully!");
        refetch();
        router.push("/dashboard/notifications");
      } else {
        toast.error("Failed to add Notification.");
      }
    } catch (error) {
      toast.error("Error adding Notification. Please try again.");
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Add Onboarding</h2>
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='w-full border px-4 py-2 rounded-lg'
            placeholder='Enter description'
            rows={4}
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Image</label>
          <ImageUploader
            imageUrl='/images/placeholder.png'
            onFileChange={(file) => setIcon(file)}
            buttonText='Upload Image'
          />
        </div>

        <div className='flex items-center gap-2'>
          <input
            id='isActive'
            type='checkbox'
            checked={isTrue}
            onChange={(e) => setIsTrue(e.target.checked)}
            className='w-4 h-4'
          />
          <label htmlFor='isActive' className='text-sm'>
            Active
          </label>
        </div>

        <Button type='submit' variant='brown' disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Notification"}
        </Button>
      </form>
    </div>
  );
}
