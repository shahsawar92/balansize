"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { BASE_URL } from "@/constant/env";
import { useGetExpertQuery } from "@/redux/api/expert-api";

import { Expert } from "@/types/experts";
import { NextFontManifestPlugin } from "next/dist/build/webpack/plugins/next-font-manifest-plugin";
import NextImage from "@/components/NextImage";
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
    <div className='w-full max-w-7xl mx-auto p-6 bg-secondary-100 rounded-2xl shadow-lg'>
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
            image: "w-40 h-40 rounded-full object-cover shadow-md mb-4",
          }}
        />
        <h1 className='text-2xl font-bold text-primary-700'>
          {expert.expert_name}
        </h1>
        <h2 className='text-lg text-primary-500 mt-1'>{expert.designation}</h2>
      </div>
      <div className='mt-6 text-justify text-primary-800'>
        <div dangerouslySetInnerHTML={{ __html: expert.about }} />
      </div>
    </div>
  );
}
