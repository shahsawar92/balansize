"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";

import { BASE_URL } from "@/constant/env";
import { useGetCoursesQuery } from "@/redux/api/courses-api";
import {
  useDeleteVideoMutation,
  useGetVideoQuery,
} from "@/redux/api/videos-api";

export default function ViewVideo() {
  const path = usePathname();
  const router = useRouter();
  const [deleteVideo] = useDeleteVideoMutation();
  const [isPlaying, setIsPlaying] = useState(false);
  const { refetch } = useGetCoursesQuery();

  const videoId = path.split("/")[3];
  const { data, error, isLoading } = useGetVideoQuery(videoId);

  if (isLoading) return <p>Loading video...</p>;
  if (error || !data?.data)
    return <p className='text-center text-red-500'>Video not found</p>;

  const videoData = data.data;

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteVideo(Number(videoId));
        toast.success("Video deleted successfully");
        refetch();
        router.push("/dashboard/videos");
      } else {
        toast.error("Failed to delete video");
      }
    });
  };

  return (
    <div>
      <Card className='min-h-screen bg-secondary-100 p-10 rounded-2xl'>
        {/* edit and delete buttons */}
        <div className='flex justify-between items-center pb-6'>
          <Button
            variant='light'
            className=' top-2 right-2'
            onClick={() =>
              router.push(`/dashboard/videos/${videoData.video_id}/edit`)
            }>
            Edit
          </Button>
          <Button
            variant='danger'
            className=' top-2 left-2'
            onClick={handleDelete}>
            Delete
          </Button>
        </div>
        <div className='grid md:grid-cols-[400px,1fr] gap-8'>
          {/* Video Display Section */}

          <div className='space-y-6'>
            <div className='relative aspect-video bg-[#EAE9EA] rounded-2xl flex items-center justify-center'>
              {!isPlaying ? (
                <div className='relative w-full h-full'>
                  <Image
                    width={400}
                    height={200}
                    src={BASE_URL + "/" + videoData.thumbnail}
                    alt='Thumbnail'
                    className='w-full h-full object-cover rounded-2xl'
                  />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl'>
                    <Play className='w-12 h-12 text-white' />
                  </button>
                </div>
              ) : (
                <video
                  src={BASE_URL + "/" + videoData.link}
                  className='w-full h-full object-cover rounded-2xl'
                  controls
                  autoPlay
                />
              )}
            </div>
            {/* Category */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Category
              </label>
              <p className='bg-gray-100 p-3 rounded-2xl'>
                {videoData.category?.name || "Not specified"}
              </p>
            </div>
          </div>
          {/* Details Section */}
          <div className='space-y-6'>
            {/* Title */}
            <div>
              <label className='block text-sm font-semibold mb-2'>Title</label>
              <p className='bg-gray-100 p-3 rounded-2xl'>
                {videoData.title || "Untitled"}
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className='block text-sm font-semibold mb-2'>Tags</label>
              <div className='p-3 rounded-2xl flex flex-wrap gap-2'>
                {videoData.tags.length > 0
                  ? videoData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className='bg-secondary-200 border-[0.5px] shadow-sm border-main-brown text-text-2 px-4 py-1 rounded-full text-sm'>
                        {tag}
                      </span>
                    ))
                  : "No tags"}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
