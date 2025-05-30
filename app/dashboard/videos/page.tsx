"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/buttons/Button";
import { Card, CardContent } from "@/components/cards/card";
import CustomSelect from "@/components/select/Select";

import { BASE_URL } from "@/constant/env";
import { useGetVideosQuery } from "@/redux/api/videos-api";
import { LockKeyhole } from "lucide-react";
import logger from "@/lib/logger";

export default function BlogPage() {
  const [formData, setFormData] = useState({ category: "" });
  const { data, error, isLoading } = useGetVideosQuery();

  if (isLoading) return <p>Loading videos...</p>;
  if (error) return <p>Error loading videos.</p>;

  logger(data, "data");
  return (
    <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
      <div className='w-full flex flex-col md:flex-row gap-3 justify-end items-center mb-9 '>
        <Button
          className='max-w-72- items-center justify-center rounded-full'
          sizeOfButton='large'
          variant='brown'>
          <Link href='/dashboard/videos/new'>Add new video</Link>
        </Button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6'>
        {data?.data.map((video) => (
          <Card
            key={video.video_id}
            className='group overflow-hidden p-0 bg-transparent rounded-lg shadow-none border-none'>
            <Link
              href={`/dashboard/videos/${video.video_id}/view`}
              className='block h-full'>
              <CardContent className='p-0 rounded-none'>
                <div className='relative h-48 w-full'>
                  <Image
                    src={`${BASE_URL}/${video.thumbnail}`}
                    alt={video.title}
                    fill
                    className='object-cover'
                  />
                  {video.is_premium && (
                    <div className='absolute top-2 right-2 text-white bg-black/50 rounded-full p-1'>
                      <LockKeyhole size={24} />
                    </div>
                  )}
                </div>
                <div className='p-1'>
                  <h3 className='font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-main-black'>
                    {video.title}
                  </h3>
                  <p className='text-sm text-muted-foreground mb-4 line-clamp-2 text-text-2'>
                    {video.type}
                  </p>
                  <p className='text-xs text-muted-foreground text-text-3'>
                    {video.category.name}
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
