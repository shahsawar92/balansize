"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

import { useAddPartnerMutation, useGetPartnersQuery } from "@/redux/api/partners-api";

export default function AddPartnerPage() {
  const router = useRouter();
  const [link, setlink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addPartner, { isLoading }] = useAddPartnerMutation();
 const {
refetch,
  } = useGetPartnersQuery();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!link || !imageFile) {
      toast.error("Please provide a link and upload a logo.");
      return;
    }

    const formData = new FormData();
    formData.append("link", link);
    formData.append("logo", imageFile);

    try {
      const response = await addPartner(formData).unwrap();
      if (response.success) {
        toast.success("Partner added successfully!");
        refetch();
        router.push("/dashboard/partners");
      } else {
        toast.error("Failed to add partner.");
      }
    } catch (error) {
      toast.error("Error adding partner. Please try again.");
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Add Partner</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block font-medium mb-1'>link</label>
          <input
            type='text'
            value={link}
            onChange={(e) => setlink(e.target.value)}
            className='w-full border px-4 py-2 rounded-lg'
            placeholder='Enter partner link'
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Logo</label>
          <ImageUploader
            imageUrl='/images/placeholder.png'
            onFileChange={(file) => setImageFile(file)}
            buttonText='Upload Logo'
          />
        </div>

        <Button type='submit' variant='brown' disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Partner"}
        </Button>
      </form>
    </div>
  );
}
