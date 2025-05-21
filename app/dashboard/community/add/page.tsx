"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import { TextEditor } from "@/components/editor/Editor";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

import {
  useAddCommunityMutation,
  useGetCommunitiesQuery,
} from "@/redux/api/community-api";

export default function AddCommunityPage() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [addCommunity, { isLoading }] = useAddCommunityMutation();
  const { refetch } = useGetCommunitiesQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!link || !imageFile) {
      toast.error("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("link", link);
    formData.append("description", description);
    formData.append("logo", imageFile);

    try {
      const response = await addCommunity(formData).unwrap();
      if (response.success) {
        toast.success("Community added!");
        refetch();
        router.push("/dashboard/community");
      } else {
        toast.error("Failed to add.");
      }
    } catch {
      toast.error("Server error. Try again.");
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Add Community</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block font-medium mb-1'>Link</label>
          <input
            type='text'
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className='w-full border px-4 py-2 rounded-lg'
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

        <div className=''>
          <label htmlFor='isActive'>Description</label>

          <TextEditor
            initialValue={description}
            placeholder='Description'
            height={200}
            onChange={(content) => setDescription(content)}
          />
        </div>

        <Button type='submit' variant='brown' disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Community"}
        </Button>
      </form>
    </div>
  );
}
