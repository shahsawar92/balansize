"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/cards/card";

import { BASE_URL } from "@/constant/env";
import { useGetArticlesQuery } from "@/redux/api/articles-api";

export default function BlogPage() {
  const { data, isLoading } = useGetArticlesQuery();

  if (isLoading) {
    return (
      <div className='text-center text-gray-500'>
        Fetching articles, please wait...
      </div>
    );
  }

  if (data?.success === false) {
    return (
      <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
        <div className='text-center text-gray-500'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
            <Card className='group h-40 mt-4 bg-transparent'>
              <Link href='/dashboard/articles/new' className='block h-full'>
                <CardContent className='flex flex-col items-center justify-center h-full p-6'>
                  <div className='w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4'>
                    <Plus className='w-8 h-8 text-primary' />
                  </div>
                  <h3 className='text-sm font-bold text-nowrap'>
                    Add New Article
                  </h3>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6'>
        <Card className='group h-40 mt-4 bg-transparent'>
          <Link href='/dashboard/articles/new' className='block h-full'>
            <CardContent className='flex flex-col items-center justify-center h-full p-6'>
              <div className='w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4'>
                <Plus className='w-8 h-8 text-primary' />
              </div>
              <h3 className='text-sm font-bold text-nowrap'>Add New Article</h3>
            </CardContent>
          </Link>
        </Card>

        {data &&
          data?.data.map((post, index) => (
            <Card
              key={index}
              className='group  overflow-hidden p-0 bg-transparent rounded-lg shadow-none border-none'>
              <Link
                href={`/dashboard/articles/${post.article_id}`}
                className='block h-full'>
                <CardContent className='p-0 rounded-none'>
                  <div className='relative h-48 w-full'>
                    <Image
                      src={
                        post.feature_image
                          ? `${BASE_URL}/${post.feature_image}`
                          : "/images/blog2.png"
                      }
                      alt={post.title}
                      fill
                      className='object-cover'
                    />
                    {/* <Image
                      width={300}
                      height={200}
                      src={`${BASE_URL}/${post.feature_image}`}
                      alt='blog'
                      className='absolute inset-0 object-cover w-full h-full'
                    /> */}
                  </div>
                  <div className='p-1'>
                    <h3 className='font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-main-black'>
                      {post.title}
                    </h3>
                    <p className='text-sm text-muted-foreground mb-4 line-clamp-2 text-text-2'>
                      {post.excerpt}
                    </p>
                    <p className='text-xs text-muted-foreground text-text-3'>
                      {post.min_to_read} min read
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
