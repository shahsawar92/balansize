"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import { Card, CardContent } from "@/components/cards/card";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import {
  useDeleteCourseVideoMutation,
  useGetCourseVideosQuery,
} from "@/redux/api/course-detail-api";
import {
  useDeleteCourseMutation,
  useGetCourseQuery,
  useGetCoursesQuery,
} from "@/redux/api/courses-api";
import Swal from "sweetalert2";

export default function SingleCoursePage() {
  const { id } = useParams();
  const { data, error, isLoading } = useGetCourseQuery(
    Array.isArray(id) ? id[0] : id
  );
  const [deleteCourse] = useDeleteCourseMutation();
  const { refetch } = useGetCoursesQuery();
  const router = useRouter();
  const {
    data: courseVideosData,
    isLoading: isVideosLoading,
    error: videosError,
    refetch: refetchVideos,
  } = useGetCourseVideosQuery(Number(Array.isArray(id) ? id[0] : id));

  const [selectedVideo, setSelectedVideo] = useState<{
    id: number;
    title: string;
    link: string;
  } | null>(null);

  const [deleteVideo] = useDeleteCourseVideoMutation();

  const handleDeleteVideo = async (videoId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this video?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        toast.info("Deleting video...");
        await deleteVideo(videoId);
        toast.success("Video deleted successfully.");

        refetchVideos();
      } catch (error) {
        toast.error("Failed to delete video.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      toast.info("Deleting course...");
      await deleteCourse(Number(id));
      toast.success("Course deleted successfully.");
      refetch();
      router.push("/dashboard/courses");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching course details.</p>;

  const course = data?.data;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
      {/* Course Header */}
      <Card className='overflow-hidden p-0 bg-white rounded-lg shadow-lg border-none'>
        <CardContent className='p-0 rounded-none'>
          <div className='relative w-full h-64 md:h-80'>
            <Image
              src={`${BASE_URL}/${course.featured_image}`}
              alt={course.title}
              fill
              className='object-cover'
            />
            <Button
              variant='light'
              className='absolute top-2 right-2'
              onClick={() =>
                router.push(`/dashboard/courses/${course.course_id}/edit`)
              }>
              Edit
            </Button>
            <Button
              variant='danger'
              className='absolute top-2 left-2'
              onClick={handleDelete}>
              Delete
            </Button>
            <div className='absolute bottom-2 left-2 right-2 px-3 py-2 rounded-full flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-600 opacity-80'>
              <Image
                src='/images/placeholder.png'
                alt={course.expert.name}
                width={32}
                height={32}
                className='rounded-full'
              />
              <Text variant='white' size='lg' weight='normal'>
                {course.expert.name}
              </Text>
            </div>
          </div>

          <div className='p-4 md:p-6'>
            <h1 className='font-semibold text-lg md:text-xl lg:text-2xl text-main-black'>
              {course.title}
            </h1>
            {course.category && (
              <p className='text-sm md:text-base text-gray-600 mt-2'>
                Category: {course.category?.name}
              </p>
            )}
            <p className='mt-3 text-xs md:text-sm text-gray-500'>
              Tags: {course.tags.join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Video Playlist Section */}
      <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Video Player */}
        <div className='md:col-span-2'>
          {selectedVideo ? (
            <div className='relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-md'>
              {/* <iframe
                width='100%'
                height='100%'
                src={selectedVideo.link.replace("watch?v=", "embed/")}
                title={selectedVideo.title}
                allowFullScreen
                className='w-full h-full'
              /> */}

              <video
                controls
                className='w-full h-full'
                src={BASE_URL + "/" + selectedVideo.link}
              />
            </div>
          ) : (
            <div className='text-center text-gray-500 py-10 border rounded-md'>
              <p>Select a video to play</p>
            </div>
          )}
        </div>

        {/* Video Playlist */}
        <div className='bg-white p-4 rounded-lg shadow-md max-h-[500px] overflow-auto'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Course Playlist
          </h2>

          {isVideosLoading && <p>Loading videos...</p>}
          {/* {videosError && <p>Error loading videos.</p>} */}

          <div className='space-y-4'>
            {courseVideosData?.result?.details &&
            courseVideosData.result.details.length > 0 ? (
              courseVideosData.result.details.map((video) => (
                <div
                  key={video.id}
                  className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition ${
                    selectedVideo?.id === video.id
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}>
                  {/* <div
                    className='w-20 h-12 relative'
                    onClick={() => setSelectedVideo(video)}>
                    <Image
                      src='/images/video-thumbnail.png'
                      alt={video.title}
                      layout='fill'
                      className='object-cover rounded-md'
                    />
                  </div> */}
                  <div
                    className='flex-1'
                    onClick={() => setSelectedVideo(video)}>
                    <Text
                      variant='main'
                      weight='normal'
                      className='text-gray-800'>
                      {video.title}
                    </Text>
                  </div>
                  {/* Delete Icon */}
                  <button
                    className='text-red-500 hover:text-red-700 transition'
                    onClick={() => handleDeleteVideo(video.id)}>
                    🗑️
                  </button>
                </div>
              ))
            ) : (
              <p>No videos added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Video Button */}
      <Button
        variant='brown'
        className='mt-6'
        onClick={() =>
          router.push(`/dashboard/courses/${course.course_id}/add`)
        }>
        Add Video
      </Button>
    </div>
  );
}
