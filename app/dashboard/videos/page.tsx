"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/cards/card";
import CustomSelect from "@/components/select/Select";
import Button from "@/components/buttons/Button";
import { useState } from "react";
import { mockVideos } from "@/data/mock-videos";

export default function BlogPage() {
  const [formData, setFormData] = useState({ category: "" });
  // Sample blog posts data

  return (
    <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
      <div className='w-full flex justify-between items-center mb-9 '>
        <CustomSelect
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
          size='large'
          withBorder={true}
          classNames={{
            trigger: "w-full rounded-full border ",
            selected: "text-opacity-80",
            container: "w-full max-w-72",
          }}
        />
        <Button
          className='max-w-72- items-center justify-center rounded-full'
          sizeOfButton='large'
          variant='brown'>
          <Link href='/dashboard/videos/new'>Add new video</Link>
        </Button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6'>
        {mockVideos.map((post, index) => (
          <Card
            key={index}
            className='group  overflow-hidden p-0 bg-transparent rounded-lg shadow-none border-none'>
            <Link
              href={`/dashboard/videos/${post.slug}/view`}
              className='block h-full'>
              <CardContent className='p-0 rounded-none'>
                <div className='relative h-48 w-full'>
                  <Image
                    src={post.video}
                    alt={post.title}
                    fill
                    className='object-contain'
                  />
                </div>
                <div className='p-1'>
                  <h3 className='font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-main-black'>
                    {post.title}
                  </h3>
                  <p className='text-sm text-muted-foreground mb-4 line-clamp-2 text-text-2'>
                    {post.description}
                  </p>
                  <p className='text-xs text-muted-foreground text-text-3'>
                    {post.category}
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
