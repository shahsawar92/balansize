"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { TextEditor } from "@/components/editor/Editor";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import CustomSelect from "@/components/select/Select";
import TagInput from "@/components/tagInput/TagInput";

import CategorySelect from "@/app/_app-components/getCategories";
import { EXPERTS_DESIGNATION } from "@/constant/data/expert-designations";
import {
  useAddExpertMutation,
  useAddExpertTypeMutation,
  useGetExpertsQuery,
  useGetExpertTypesQuery,
} from "@/redux/api/expert-api";

import { Category } from "@/types/categories-types";

export default function AddExpertPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createExpert, { isLoading }] = useAddExpertTypeMutation();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const { refetch } = useGetExpertTypesQuery();

  const [expert, setExpert] = useState({
    type: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createExpert(expert).unwrap();
      logger(response, "Expert Type Response");
      toast.info("Adding expert Type...");
      toast.success("Expert type added successfully!");
      await refetch();
      router.push("/dashboard/experts/type");
    } catch (error) {
      console.error("Error adding expert type:", error);
      toast.error("Failed to add expert type. Please try again.");
    }
  };

  return (
    <div className='w-full max-w-7xl py-5 px-5 mx-auto bg-secondary-100 rounded-2xl'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold text-main-brown'>Add Expert Type</h1>
        <Button
          variant='brown'
          className='rounded-full'
          onClick={() => router.push("/dashboard/experts/type")}>
          Back to Expert Types
        </Button>
      </div>
      <form onSubmit={handleSubmit} className='space-y-6 mt-12 max-w-2xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            placeholder='Enter Expert Type'
            variant='light'
            className='w-full max-w-80'
            value={expert.type}
            onChange={(e) => setExpert({ ...expert, type: e.target.value })}
          />
        </div>
        <Button
          type='submit'
          className=' max-w-xs text-center rounded-full'
          variant='brown'
          disabled={isLoading}>
          <div className='flex items-center justify-center'>
            {isLoading && (
              <svg
                className='animate-spin h-5 w-5 mr-3 text-white'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  strokeWidth='4'
                  stroke='currentColor'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z'
                />
              </svg>
            )}
            <span className='text-white font-semibold'>Add Expert Type</span>
          </div>
        </Button>
      </form>
    </div>
  );
}
