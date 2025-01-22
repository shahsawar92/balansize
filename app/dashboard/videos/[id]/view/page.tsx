"use client";

import { Play } from "lucide-react";
import { Card } from "@/components/cards/card";
import { mockVideos } from "@/data/mock-videos";
import { usePathname } from "next/navigation";

export default function ViewVideo() {
  const router = usePathname();
  const slug = router.split("/")[3];
  const videoData = mockVideos.find((video) => video.slug === slug);

  if (!videoData) {
    return <div className='text-center text-red-500'>Video not found</div>;
  }

  return (
    <div>
      <Card className='min-h-screen bg-secondary-100 p-10 rounded-2xl'>
        <div className='grid md:grid-cols-[400px,1fr] gap-8'>
          {/* Video Display Section */}
          <div className='space-y-6'>
            <div className='relative aspect-video bg-[#EAE9EA] rounded-2xl flex items-center justify-center'>
              {videoData.video ? (
                <video
                  src={videoData.video}
                  className='w-full h-full object-cover rounded-2xl'
                  controls
                />
              ) : (
                <div className='text-center text-gray-500'>
                  <Play className='w-12 h-12' />
                  <span>No video available</span>
                </div>
              )}
            </div>
            {/* Category */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Category
              </label>
              <p className='bg-gray-100 p-3 rounded-2xl'>
                {videoData.category || "Not specified"}
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

            {/* Description */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Description
              </label>
              <p className='bg-gray-100 p-3 rounded-2xl whitespace-pre-line'>
                {videoData.description || "No description provided"}
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className='block text-sm font-semibold mb-2'>Tags</label>
              <div className=' p-3 rounded-2xl flex flex-wrap gap-2'>
                {videoData.tags
                  ? videoData.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className='bg-secondary-200 border-[0.5px] shadow-sm border-main-brown text-text-2 px-4 py-1 rounded-full text-sm'>
                        {tag.trim()}
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
