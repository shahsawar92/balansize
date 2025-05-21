"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import {
  useGetCommunityQuery,
  useUpdateCommunityMutation,
} from "@/redux/api/community-api";

import { Community } from "@/types/community";
import { TextEditor } from "@/components/editor/Editor";

export default function EditCommunityPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const { data, isLoading } = useGetCommunityQuery(id);
  const [updateCommunity, { isLoading: isUpdating }] =
    useUpdateCommunityMutation();

  const [formData, setFormData] = useState<Community>({
    id,
    link: "",
    description: "",
    logo: "",
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        id: data.data.id,
        link: data.data.link,
        description: data.data.description,
        logo: data.data.logo,
      });
    }
  }, [data]);

  logger(data, "data");
  logger(formData, "formData");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (file: File) => {
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = new FormData();
    body.append("link", formData.link);
    body.append("description", formData.description);
    if (formData.logo instanceof File) {
      body.append("logo", formData.logo);
    }

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

        <ImageUploader
          onFileChange={handleLogoChange}
          buttonText='Upload Image'
          imageUrl={
            formData.logo instanceof File
              ? URL.createObjectURL(formData.logo)
              : `${BASE_URL}/${formData.logo}`
          }
        />
        <Button type='submit' disabled={isUpdating} variant='brown'>
          {isUpdating ? "Updating..." : "Update Community"}
        </Button>
      </form>
    </div>
  );
}
