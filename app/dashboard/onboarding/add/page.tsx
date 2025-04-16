"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

import {
  useGetOnboardingPartnersQuery,
  useAddOnboardingPartnerMutation,
} from "@/redux/api/onboarding-api";

export default function AddOnboardingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [addOnboarding, { isLoading }] = useAddOnboardingPartnerMutation();
  const { refetch } = useGetOnboardingPartnersQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !imageFile) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", imageFile);
    formData.append("is_active", isActive ? "1" : "0");

    try {
      const response = await addOnboarding(formData).unwrap();
      if (response.success) {
        toast.success("Onboarding added successfully!");
        refetch();
        router.push("/dashboard/onboarding");
      } else {
        toast.error("Failed to add onboarding.");
      }
    } catch (error) {
      toast.error("Error adding onboarding. Please try again.");
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
            imageUrl='/images/placeholder.png'
            onFileChange={(file) => setImageFile(file)}
            buttonText='Upload Image'
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

        <Button type='submit' variant='brown' disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Onboarding"}
        </Button>
      </form>
    </div>
  );
}
