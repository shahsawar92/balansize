"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { TextEditor } from "@/components/editor/Editor";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import TagInput from "@/components/tagInput/TagInput";

import CategorySelect from "@/app/_app-components/getCategories";
import { EXPERTS_DESIGNATION } from "@/constant/data/expert-designations";
import {
  useAddExpertMutation,
  useGetExpertsQuery,
} from "@/redux/api/expert-api";

import { Category } from "@/types/categories-types";

export default function AddExpertPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createExpert, { isLoading }] = useAddExpertMutation();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const { refetch } = useGetExpertsQuery();

  const [expert, setExpert] = useState({
    name: "",
    designation: "",
    about: "",
    profile_picture: "",
    type: "",
    tags: [],
    categoryId: 0,
    calendly_link: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // Store the actual file

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", expert.name);
      formData.append("designation", expert.designation);
      formData.append("about", expert.about);
      formData.append("type", expert.type);
      formData.append("categoryId", (expert.categoryId ?? 0).toString());
      formData.append("calendly_link", expert.calendly_link);
      expert.tags.forEach((tag) => formData.append("tags[]", tag));

      if (imageFile) {
        formData.append("profile_picture", imageFile);
      }

      logger(formData, "formData");

      toast.info("Adding expert...");
      await createExpert(formData).unwrap();
      toast.success("Expert added successfully!");
      await refetch();
      router.push("/dashboard/experts");
    } catch (error) {
      console.error("Error adding expert:", error);
      toast.error("Failed to add expert. Please try again.");
    }
  };

  const handleChange = (key: string, value: any) => {
    setExpert({ ...expert, [key]: value });
  };

  const selectedValues = expert.type
    ? EXPERTS_DESIGNATION.filter((opt) =>
        expert.type.split(",").includes(opt.value)
      )
    : [];

  const handleTypeChange = (selectedOptions: any) => {
    const values = selectedOptions.map((opt: any) => opt.value).join(",");
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
            value={expert.name}
            onChange={(e) => setExpert({ ...expert, name: e.target.value })}
          />
          <Input
            placeholder='Designation'
            variant='light'
            className='w-full max-w-80'
            value={expert.designation}
            onChange={(e) =>
              setExpert({ ...expert, designation: e.target.value })
            }
          />
        </div>
        <div className='w-full mt-0'>
          <Select
            isMulti
            options={EXPERTS_DESIGNATION}
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
        <div className=''>
          <Input
            placeholder='Appointment Link'
            variant='light'
            className='w-full '
            value={expert.calendly_link}
            onChange={(e) =>
              setExpert({ ...expert, calendly_link: e.target.value })
            }
          />
        </div>
        {/* Category Selection */}
        <div onClick={(e) => e.preventDefault()}>
          <CategorySelect
            selectedCategory={category}
            onChange={(category) => {
              setCategory(category);
              setExpert({ ...expert, categoryId: category?.id || 0 });
            }}
          />
        </div>

        {/* tags input */}
        <div onClick={(e) => e.preventDefault()}>
          <TagInput
            tags={expert.tags}
            onTagsChange={(newTags) => handleChange("tags", newTags)}
          />
        </div>
        {/* Profile Picture Upload */}
        <ImageUploader
          imageUrl='/images/placeholder.png'
          onFileChange={(file) => {
            setImageFile(file);
          }}
          buttonText='Upload Profile Picture'
        />

        <Button
          type='submit'
          className='w-full max-w-28 rounded-full'
          variant='brown'
          disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Expert"}
        </Button>
      </form>
    </div>
  );
}
