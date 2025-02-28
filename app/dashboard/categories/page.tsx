"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/cards/card";

import { BASE_URL } from "@/constant/env";
import { useGetCategoriesQuery } from "@/redux/api/categories-api";

export default function CategoriesPage() {
  const { data, isLoading, refetch } = useGetCategoriesQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='min-h-dvh bg-secondary-100 rounded-2xl p-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6'>
        {/* Add New Category Card */}
        <Card className='flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 text-center'>
          <CardContent className='flex flex-col items-center justify-center'>
            <Link
              href='/dashboard/categories/new'
              className='flex flex-col items-center'>
              <div className='w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4'>
                <Plus className='w-8 h-8 text-primary' />
              </div>
              <h3 className='text-sm font-semibold text-main-black'>
                Add New Category
              </h3>
            </Link>
          </CardContent>
        </Card>

        {/* Categories List */}
        {data?.result?.map((category) => (
          <Card
            key={category.id}
            className='flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 text-center'>
            <CardContent className='flex flex-col items-center justify-center'>
              <div className='relative w-16 h-16 mb-4'>
                <Image
                  src={
                    category.icon
                      ? `${BASE_URL}/${category.icon}`
                      : "/images/placeholder.png"
                  }
                  alt={category.name}
                  fill
                  className='object-contain rounded-lg'
                />
              </div>
              <h3 className='text-sm font-semibold text-main-black'>
                {category.name}
              </h3>
              <Link
                href={`/dashboard/categories/${category.id}`}
                className='text-xs text-primary mt-2'>
                Manage
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
