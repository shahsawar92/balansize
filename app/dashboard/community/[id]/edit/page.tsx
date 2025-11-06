"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { TextEditor } from "@/components/editor/Editor";
import Input from "@/components/input/Input";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import {
  useAddImageToCommunityMutation,
  useDeleteCommunityImageMutation,
  useGetCommunityQuery,
  useUpdateCommunityMutation,
} from "@/redux/api/community-api";

import { Community } from "@/types/community";

export default function EditCommunityPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const { data, isLoading, refetch } = useGetCommunityQuery(id);
  const [updateCommunity, { isLoading: isUpdating }] =
    useUpdateCommunityMutation();
  const [deleteImage] = useDeleteCommunityImageMutation();
  const [addImage] = useAddImageToCommunityMutation();

  const [formData, setFormData] = useState<Community>({
    id,
    link: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    if (data?.data) {
      setFormData((prev) => ({
        ...prev,
        id: data.data.id,
        link: data.data.link,
        description: data.data.description,
        images: data.data.images || [],
      }));
    }
  }, [data?.data]);

  logger(data, "data");
  logger(formData, "formData");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = new FormData();
    body.append("link", formData.link);
    body.append("description", formData.description);

    try {
      toast.info("Updating community...");
      await updateCommunity({ id, data: body }).unwrap();
      toast.success("Community updated successfully!");
      router.push("/dashboard/community");
    } catch (err) {
      logger(err, "Update error");
      toast.error("Update failed!");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This image will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteImage({ imageId }).unwrap();
        toast.success("Image deleted!");
        // Remove from state
        setFormData((prev) => ({
          ...prev,
          images: prev.images?.filter((img) => img.id !== imageId),
        }));
      } catch (err) {
        logger(err, "Delete error");
        toast.error("Failed to delete image.");
      }
    }
  };

  const handleAddNewImage = async (file: File) => {
    if (!file) return;

    const form = new FormData();
    form.append("logo", file);

    try {
      const res = await addImage({ communityId: id, data: form }).unwrap();
      toast.success("Image added!");
      await refetch();
    } catch (err) {
      logger(err, "Upload error");
      toast.error("Failed to upload image.");
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <Text variant='main' className='mb-4 text-lg font-bold'>
        Edit Community
      </Text>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <Input name='link' value={formData.link} onChange={handleChange} />
        <TextEditor
          initialValue={formData.description}
          placeholder='Description'
          height={300}
          onChange={(content) =>
            setFormData((prev) => ({ ...prev, description: content }))
          }
        />
        <Button type='submit' disabled={isUpdating} variant='brown'>
          {isUpdating ? "Updating..." : "Update Community"}
        </Button>
      </form>
      {/* Community Images Section */}
      <div className='my-5'>
        <Text className='font-semibold text-xl mb-2'>Community Images</Text>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {formData.images?.map((img) => (
            <div key={img.id} className='relative group'>
              <Image
                src={`${BASE_URL}/${img.link}`}
                alt='Community image'
                width={200}
                height={150}
                className='w-full h-32 object-cover rounded-md border'
              />
              <button
                type='button'
                className='absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hidden group-hover:block'
                onClick={() => handleDeleteImage(img.id)}>
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Upload New Image */}
      <div className='mb-6'>
        <label className='block font-semibold mb-2'>Add New Image</label>
        <div className='relative inline-block'>
          <button
            type='button'
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all'
            onClick={() =>
              document.getElementById("hidden-file-input")?.click()
            }>
            + Upload Image
          </button>
          <input
            id='hidden-file-input'
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              handleAddNewImage(file);
              // Clear input value to allow re-uploading the same file
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}
