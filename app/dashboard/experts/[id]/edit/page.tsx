"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Select, { ActionMeta, MultiValue } from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { TextEditor } from "@/components/editor/Editor";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import TagInput from "@/components/tagInput/TagInput";

import CategorySelect from "@/app/_app-components/getCategories";
import { EXPERTS_DESIGNATION } from "@/constant/data/expert-designations";
import { BASE_URL } from "@/constant/env";
import {
  useGetExpertQuery,
  useGetExpertsQuery,
  useGetExpertTypesQuery,
  useUpdateExpertMutation,
} from "@/redux/api/expert-api";

import { Category } from "@/types/categories-types";
import { Expert } from "@/types/experts";

export default function EditExpertPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: expertData, isLoading } = useGetExpertQuery(id);
  const { data: expertTypes } = useGetExpertTypesQuery();

  const [updateExpert, { isLoading: isUpdating }] = useUpdateExpertMutation();
  logger(expertData, "expertData");
  const { refetch } = useGetExpertsQuery();

  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [expert, setExpert] = useState<Expert>({
    expert_id: 0,
    expert_name: "",
    designation: "",
    about: "",
    profile_picture: "",
    tags: [] as string[],
    category_id: 0,
    calendly_link: "",
  });

  logger(expert, "expertsssssssssss");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (expertData?.result) {
      setExpert(expertData.result);
      setCategory(
        expertData.result.category_id && expertData.result.category_name
          ? {
              id: expertData.result.category_id,
              name: expertData.result.category_name,
              icon: "",
              translations: [],
            }
          : undefined
      );
    }
  }, [expertData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Update Expert?",
      text: "You are about to update this expert's details.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("name", expert.expert_name);
      formData.append("designation", expert.designation);
      formData.append("about", expert.about);
      formData.append("type", expert?.type || "");
      formData.append("categoryId", (expert.category_id ?? 0).toString());
      formData.append("calendly_link", expert.calendly_link || "");
      (expert?.tags || []).forEach((tag) => formData.append("tags[]", tag));

      if (imageFile) {
        formData.append("profile_picture", imageFile);
      }

      logger(formData, "formData");

      toast.info("Updating expert...");
      await updateExpert({
        id: expert.expert_id,
        data: formData,
      }).unwrap();

      toast.success("Expert updated successfully!");
      await refetch();
      router.push("/dashboard/experts");
    } catch (error) {
      logger(error, "Error updating expert:");
      toast.error("Failed to update expert. Please try again.");
    }
  };

  const handleChange = (key: string, value: any) => {
    setExpert({ ...expert, [key]: value });
  };

  const selectedValues = expert.type
    ? expert.type.split(",").map((type) => ({
        value: type.trim(),
        label: type.trim(),
      }))
    : [];

  const handleTypeChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    if (!selectedOptions) {
      setExpert((prev) => ({ ...prev, type: "" }));
      return;
    }
    const values = selectedOptions.map((opt) => opt.value).join(",");
    setExpert((prev) => ({ ...prev, type: values }));
  };

  return (
    <div className='w-full max-w-7xl py-5 px-5 mx-auto bg-secondary-100 rounded-2xl'>
      <form onSubmit={handleSubmit} className='space-y-6 mt-12 max-w-2xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            placeholder='Name'
            variant='light'
            className='w-full max-w-80'
            value={expert.expert_name}
            onChange={(e) => handleChange("expert_name", e.target.value)}
          />
          <Input
            placeholder='Designation'
            variant='light'
            className='w-full max-w-80'
            value={expert.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
          />
        </div>
        <div className='w-full mt-0'>
          <Select
            isMulti
            options={expertTypes?.result.map((type) => ({
              value: type.type,
              label: type.type,
            }))}
            value={selectedValues}
            onChange={handleTypeChange}
            placeholder='Select Type'
            className='w-full z-10'
            classNamePrefix='react-select'
          />
        </div>
        <div onClick={(e) => e.preventDefault()}>
          <TextEditor
            initialValue={expert.about}
            placeholder='About'
            height={300}
            onChange={(content) => handleChange("about", content)}
          />
        </div>

        <Input
          placeholder='Appointment Link'
          variant='light'
          className='w-full '
          value={expert.calendly_link || ""}
          onChange={(e) => handleChange("calendly_link", e.target.value)}
        />

        {/* Category Selection */}
        <div onClick={(e) => e.preventDefault()}>
          <CategorySelect
            selectedCategory={category}
            onChange={(category) => {
              setCategory(category);
              handleChange("categoryId", category?.id || 0);
            }}
          />
        </div>

        {/* Tags Input */}
        <div onClick={(e) => e.preventDefault()}>
          <TagInput
            tags={expert.tags || []}
            onTagsChange={(newTags) => handleChange("tags", newTags)}
          />
        </div>

        {/* Profile Picture Upload */}
        <ImageUploader
          imageUrl={
            typeof expert.profile_picture === "string"
              ? new URL(expert.profile_picture, BASE_URL).toString()
              : ""
          }
          onFileChange={(file) => {
            setImageFile(file);
          }}
          buttonText='Upload Profile Picture'
        />

        <Button
          type='submit'
          className='w-full max-w-28 rounded-full'
          variant='brown'
          disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
