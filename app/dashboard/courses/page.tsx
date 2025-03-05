"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/buttons/Button";
import { Card, CardContent } from "@/components/cards/card";
import CustomSelect from "@/components/select/Select";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import { useGetCoursesQuery } from "@/redux/api/courses-api";

export default function CoursesPage() {
  const { data, error, isLoading } = useGetCoursesQuery();
  const [formData, setFormData] = useState({ category: "" });
  const router = useRouter();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching courses.</p>;

  const courses = data?.data || [];

  return (
    <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
      <div className='w-full flex justify-between items-center mb-9'>
        <CustomSelect
          value={formData.category}
          onChange={(value: string) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
          options={[
            { label: "Option 1", value: "option_1" },
            { label: "Option 2", value: "option_2" },
            { label: "Option 3", value: "option_3" },
          ]}
          placeholder='Categories'
          variant='light'
          size='large'
          withBorder={true}
          classNames={{
            trigger: "w-full rounded-full border",
            selected: "text-opacity-80",
            container: "w-full max-w-72",
          }}
        />
        <Button
          type='submit'
          className='max-w-72 items-center justify-center rounded-full'
          sizeOfButton='large'
          onClick={() => {
            router.push("/dashboard/courses/new");
          }}
          variant='brown'>
          Upload new course
        </Button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6'>
        {courses.map((course) => (
          <Card
            key={course.course_id}
            className='group overflow-hidden p-0 bg-transparent rounded-lg shadow-none border-none'>
            <Link
              href={`/dashboard/courses/${course.course_id}`}
              className='block h-full'>
              <CardContent className='p-0 rounded-none'>
                <div className='relative h-48 w-full'>
                  <Image
                    src={`${BASE_URL}/${course.featured_image}`}
                    alt={course.title}
                    fill
                    className='object-cover'
                  />
                  <div
                    className='absolute flex items-center gap-3 bottom-2 left-2 right-2 px-3 py-1 rounded-full'
                    style={{
                      backgroundImage: `linear-gradient(to right, #564137, #796E68)`,
                      opacity: 0.8,
                    }}>
                    <Image
                      src='/images/placeholder.png'
                      alt={course.expert.name}
                      width={24}
                      height={24}
                      className='rounded-full opacity-100'
                    />
                    <Text
                      variant='white'
                      size='sm'
                      weight='normal'
                      isCenterAligned={true}>
                      {course.expert.name}
                    </Text>
                  </div>
                </div>

                <div className='p-2 md:p-3'>
                  <h3 className='font-semibold text-sm md:text-base lg:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-main-black'>
                    {course.title}
                  </h3>
                  <p className='text-xs md:text-sm text-muted-foreground text-text-2'>
                    {course.tags.join(", ")}
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
