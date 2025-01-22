"use client";

import { Play } from "lucide-react";
import { useState } from "react";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import Input from "@/components/input/Input";
import CustomSelect from "@/components/select/Select";

export default function CreateVideo() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    category: "",
    video: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, video: e.target.files![0] }));
    }
  };

  return (
    <div>
      <Card className=' min-h-screen bg-secondary-100 p-10 rounded-2xl'>
        <form
          onSubmit={handleSubmit}
          className='grid md:grid-cols-[400px,1fr] gap-8'>
          {/* Video Upload Section */}
          <div className='space-y-6'>
            <div className='relative aspect-video bg-[#EAE9EA] rounded-2xl flex items-center justify-center'>
              {formData.video ? (
                <video
                  src={URL.createObjectURL(formData.video)}
                  className='w-full h-full object-cover rounded-2xl'
                  controls
                />
              ) : (
                <div className='text-center'>
                  <Input
                    type='file'
                    accept='video/*'
                    onChange={handleVideoUpload}
                    className='hidden'
                    id='video-upload'
                    classNames={{ container: "shadow-md " }}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      document.getElementById("video-upload")?.click()
                    }
                    className='flex flex-col items-center gap-2 text hover:text-gray-700'>
                    <Play className='w-12 h-12' />
                    <span>Upload Video</span>
                  </button>
                </div>
              )}
            </div>
            <CustomSelect
              label='Choose an option'
              value={formData.category}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              options={[
                { label: "Option 1", value: "option_1" },
                { label: "Option 2", value: "option_2" },
                { label: "Option 3", value: "option_3" },
              ]}
              placeholder='Category'
              variant='light'
              size='large'
              withBorder={true}
              classNames={{
                trigger: "w-full rounded-2xl",
                selected: "text-opacity-80",
              }}
            />
          </div>

          {/* Form Fields Section */}
          <div className='space-y-6'>
            {/* Title Input */}
            <Input
              placeholder='Title'
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              variant='light'
              sizeOfInput='large'
              className='w-full rounded-2xl '
            />

            {/* Description */}
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder='Description'
              className='w-full p-3 border border-secondary-500  rounded-2xl  focus:ring-secondary-500'
              rows={6}
            />

            {/* Tags */}
            <Input
              placeholder='Tags'
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              variant='light'
              sizeOfInput='large'
              className='w-full rounded-2xl '
            />

            {/* Submit Button */}
            <div className='flex justify-end'>
              <Button
                type='submit'
                className='bg-black text-white hover:bg-gray-800 rounded-lg px-8'>
                Save
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
