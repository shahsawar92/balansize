"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import NextImage from "@/components/NextImage";

import { BASE_URL } from "@/constant/env";
import { useGetExpertQuery } from "@/redux/api/expert-api";

import { Expert } from "@/types/experts";
// import { Skeleton } from "@/components/ui/skeleton";

export default function ViewExpertPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: expertData, isLoading } = useGetExpertQuery(id);
  const [expert, setExpert] = useState<Expert>({} as Expert);

  useEffect(() => {
    if (expertData?.result) {
      setExpert(expertData.result);
    }
  }, [expertData]);

  if (isLoading) {
    return (
      <div className='w-full max-w-4xl mx-auto p-6 bg-secondary-100 rounded-2xl'>
        {/* <Skeleton className='h-10 w-3/4 mb-4' />
        <Skeleton className='h-6 w-1/2 mb-6' />
        <Skeleton className='h-64 w-full mb-4' /> */}
      </div>
    );
  }

  if (!expert) return <p className='text-center mt-10'>Expert not found</p>;

  return (
    <div className='w-full  mx-auto p-8 bg-secondary-100 rounded-3xl shadow-xl'>
      <div className='flex flex-col items-center text-center'>
        <NextImage
          useSkeleton
          width={160}
          height={160}
          src={
            expert.profile_picture
              ? `${BASE_URL}/${expert.profile_picture}`
              : "/images/placeholder.png"
          }
          alt={expert.expert_name}
          classNames={{
            image:
              "w-40 h-40 rounded-full object-cover shadow-lg mb-5 border-4 border-white",
          }}
        />

        <div className='text-center'>
          <p className='text-sm text-gray-500'>Name</p>
          <h1 className='text-3xl font-semibold text-primary-800'>
            {expert.expert_name}
          </h1>
        </div>

        <div className='mt-2'>
          <p className='text-sm text-gray-500'>Designation</p>
          <h2 className='text-lg text-primary-500 italic'>
            {expert.designation}
          </h2>
        </div>

        {(expert.tags ?? []).length > 0 && (
          <div className='mt-3 text-center'>
            <p className='text-sm text-gray-500 mb-1'>Tags</p>
            <div className='flex flex-wrap justify-center gap-2'>
              {expert.tags?.map((tag, index) => (
                <span
                  key={index}
                  className='bg-white text-primary-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm'>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {expert.type && (
          <div className='mt-4 text-sm text-primary-700'>
            <p className='text-sm text-gray-500 mb-1'>Expert Type</p>
            <span className='font-medium text-primary-600'>
              {expert.type.split(",").join(", ")}
            </span>
          </div>
        )}
      </div>

      <div className='mt-8 text-primary-800  leading-relaxed text-center space-y-4'>
        <p className='text-sm text-gray-500 mb-2'>About</p>
        <div dangerouslySetInnerHTML={{ __html: expert.about }} />
      </div>
    </div>
  );
}
