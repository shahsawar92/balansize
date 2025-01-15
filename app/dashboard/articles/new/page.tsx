"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import Input from "@/components/input/Input";
import CustomSelect from "@/components/select/Select";

export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    tags: "",
    category: "",
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  return (
    <div className='min-h-screen bg-secondary-100 p-6'>
      <Card className='max-w-4xl mx-auto p-6 bg-transparent rounded-none shadow-none border-none'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-8'>
            Add new Articles
          </h1>

          {/* Title Input */}
          <Input
            placeholder='Title'
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            variant='light'
            sizeOfInput='base'
            className='w-full'
          />

          {/* Image Upload */}
          <div className='flex gap-4 items-center'>
            <Input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='hidden'
              id='image-upload'
            />
            <Button
              type='button'
              variant='light'
              className='w-full md:w-auto'
              onClick={() => document.getElementById("image-upload")?.click()}>
              <Upload className='w-4 h-4 mr-2' />
              Upload Image
            </Button>
            {formData.image && (
              <span className='text-sm text-gray-500'>
                {formData.image.name}
              </span>
            )}
          </div>

          {/* Description */}
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder='Enter your question here...'
            className='w-full p-2 border rounded-2xl focus:ring-main-brown focus:border-main-brown'
            rows={3}
            style={{
              height: `calc(${3 * 40}px + 1rem)`,
            }}
          />

          {/* Content */}

          {/* <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            placeholder='write here...'
            className='w-full p-2 border rounded-lg focus:ring-main-brown focus:border-main-brown'
            rows={3}
            style={{
              height: `calc(${3 * 40}px + 1rem)`,
            }}
          /> */}

          {/* Tags */}
          <Input
            placeholder='Tags'
            value={formData.tags}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tags: e.target.value }))
            }
            variant='light'
            sizeOfInput='base'
            className='w-full'
          />

          {/* Categories */}
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
            placeholder='Categories'
            variant='light'
            size='base'
            withBorder={true}
            classNames={{
              trigger: "w-full rounded-full border ",
              selected: "text-opacity-80",
            }}
          />

          {/* Submit Button */}
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-black text-white hover:bg-gray-800 rounded-full px-8'>
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
