"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import Input from "@/components/input/Input";

import FileUploader from "@/app/_app-components/fileUploader";
import {
  useAddCourseVideoMutation,
  useGetCourseVideosQuery,
} from "@/redux/api/course-detail-api";
import { useGetCourseQuery, useGetCoursesQuery } from "@/redux/api/courses-api";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth-slice";

import { Expert } from "@/types/experts";

type FormState = {
  title: string;
  link: string;
  courseId: number;
};

export default function CreateVideo() {
  const role = useSelector(selectUserRole);
  const user = useSelector(selectCurrentUser);
  const { id } = useParams();
  const router = useRouter();
  const { refetch } = useGetCoursesQuery();
  const { refetch: refetchVideos } = useGetCourseVideosQuery(
    Number(Array.isArray(id) ? id[0] : id)
  );
  const [addVideo, { isLoading }] = useAddCourseVideoMutation();
  const [canAddMoreInfo, setCanAddMoreInfo] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    title: "",
    link: "",
    courseId: Number(Array.isArray(id) ? id[0] : id),
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      courseId: Number(Array.isArray(id) ? id[0] : id),
    }));
  }, [id]);

  useEffect(() => {
    if (role === "Expert" || role === "User") {
      const udata = JSON.parse(user);
      toast.info(`${udata?.name}, you are creating an video as ${role}`);
      setFormData((prev) => ({ ...prev, expert: udata as Expert }));
    }
  }, [role, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      toast.info("Please wait, video is being uploaded...");
      return;
    }

    if (!formData.title) {
      toast.error("Please add title for video!");
      return;
    }

    try {
      Swal.fire({
        title: "Uploading...",
        text: "Please wait while we are uplading the video.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const articleData = new FormData();
      articleData.append("title", formData.title);
      articleData.append("courseId", formData.courseId.toString());
      if (formData.link) articleData.append("link", formData.link);

      toast.info("Creating video, please wait...");
      const response = await addVideo(articleData).unwrap();

      Swal.close();
      toast.success("Video created successfully!");
      logger(response, "Video created successfully");

      await refetch();
      refetchVideos();
      router.push(`/dashboard/courses/${id}`);
    } catch (error) {
      Swal.close();
      logger(error, "Error uploading video:");
      toast.error("Failed to upload video. Please try again.");
    }
  };

  const handleChange = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <div>
      <Card className='min-h-screen bg-secondary-100 p-10 rounded-2xl'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {/* Video Upload Section */}
          <div className='space-y-6'>
            <FileUploader
              onUploadSuccess={(url) => {
                handleChange("link", url);
                setCanAddMoreInfo(true); // Enable form fields
                toast.success("You can now fill in the video details.");
              }}
            />
          </div>
          {/* Form Fields Section */}
          <div
            className={`space-y-6 ${!canAddMoreInfo ? "opacity-50 pointer-events-none" : ""}`}
            onClick={(e) => e.preventDefault()}>
            <Input
              placeholder='Title'
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              variant='light'
              sizeOfInput='large'
              className='w-full rounded-2xl'
              disabled={!canAddMoreInfo}
            />
          </div>
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-black text-white hover:bg-gray-800 rounded-lg px-8'
              disabled={!canAddMoreInfo} // Disable the submit button until the file is uploaded
            >
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
