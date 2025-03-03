"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/cards/card";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import { useGetCourseQuery } from "@/redux/api/courses-api";

export default function SingleCoursePage() {
  const { id } = useParams();
  const { data, error, isLoading } = useGetCourseQuery(Array.isArray(id) ? id[0] : id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching course details.</p>;

  const course = data?.data;

  if (!course) return <p>Course not found.</p>;

  return (
    <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
      <Card className='overflow-hidden p-0 bg-transparent rounded-lg shadow-none border-none'>
        <CardContent className='p-0 rounded-none'>
          <div className='relative w-full h-64 md:h-80'>
            <Image
              src={`${BASE_URL}/${course.featured_image}`}
              alt={course.title}
              fill
              className='object-cover'
            />
            <div
              className='absolute bottom-2 left-2 right-2 px-3 py-2 rounded-full flex items-center gap-3'
              style={{
                backgroundImage: `linear-gradient(to right, #564137, #796E68)`,
                opacity: 0.8,
              }}>
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
              <p className='text-sm md:text-base text-muted-foreground mt-2'>
                Category: {course.category}
              </p>
            )}
            <p className='mt-3 text-xs md:text-sm text-muted-foreground'>
              Tags: {course.tags.join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
