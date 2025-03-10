"use client";

import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/cards/card";

import { BASE_URL } from "@/constant/env";
import { useGetTagsQuery, useDeleteTagMutation } from "@/redux/api/tags-api";

export default function TagsPage() {
  const { data, isLoading, refetch } = useGetTagsQuery();
  const [deleteTag] = useDeleteTagMutation();

  if (isLoading) return <p>Loading...</p>;

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This tag will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          toast.info("Deleting tag...");
          await deleteTag(id).unwrap();
          toast.success("Tag deleted successfully!");
          refetch();
        } catch (error) {
          toast.error("Failed to delete tag. Please try again.");
        }
      }
    });
  };

  return (
    <div className='min-h-dvh bg-secondary-100 rounded-2xl p-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6'>
        {/* Add New Tag Card */}
        <Card className='flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 text-center'>
          <CardContent className='flex flex-col items-center justify-center'>
            <Link
              href='/dashboard/tags/new'
              className='flex flex-col items-center'>
              <div className='w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4'>
                <Plus className='w-8 h-8 text-primary' />
              </div>
              <h3 className='text-sm font-semibold text-main-black'>
                Add New Tag
              </h3>
            </Link>
          </CardContent>
        </Card>

        {/* Tags List */}
        {data?.result?.map((tag) => (
          <Card
            key={tag.id}
            className='relative flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 text-center'>
            <button
              onClick={() => handleDelete(tag.id)}
              className='absolute top-2 right-2 text-red-500 hover:text-red-700'>
              <Trash2 className='w-5 h-5' />
            </button>
            <CardContent className='flex flex-col items-center justify-center'>
              <h3 className='text-sm font-semibold text-main-black'>
                {tag.translations.find((t) => t.language === "en")?.name ||
                  tag.name}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
