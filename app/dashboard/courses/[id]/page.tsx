"use client";

import { Edit, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import Button from "@/components/buttons/Button";
import { Card } from "@/components/cards/card";
import Separator from "@/components/seperator/Seperator";
import Image from "next/image";

interface Lesson {
  day: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

interface Course {
  title: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  duration: string;
  description: string;
  image: string;
  lessons: Lesson[];
}

export default function CoursePage() {
  const course: Course = {
    title: "Full-Body Reformer workout",
    instructor: {
      name: "Emily Carter",
      title: "Certified Mindfulness Coach and Meditation Trainer",
      avatar: "/images/placeholder.png",
    },
    duration: "25 min",
    description:
      "This dynamic workout uses the Pilates reformer to engage your entire body. It strengthens muscles, improves flexibility, and enhances core stability through controlled movements. Perfect for building strength and achieving balance in your fitness routine.",
    image: "/images/vid-1.png",
    lessons: [
      {
        day: 1,
        title: "Core Control and Full-Body Strength",
        duration: "9 min",
        thumbnail: "/images/vid-1.png",
        videoUrl: "/videos/video1.mp4",
      },
      {
        day: 2,
        title: "Stretch, Strengthen, and Align",
        duration: "5 min",
        thumbnail: "/images/vid-2.png",
        videoUrl: "/videos/video2.mp4",
      },
    ],
  };

  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  return (
    <div className='min-h-screen bg-[#FAF9F9] p-6'>
      <div className='max-w-6xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex justify-end gap-2'>
          <Button variant='light' sizeOfButton='sm'>
            <Edit className='w-4 h-4 mr-2' />
            Edit
          </Button>
          <Button variant='light' sizeOfButton='sm'>
            <Trash2 className='w-4 h-4 mr-2' />
            Delete
          </Button>
          <Button className='bg-black text-white hover:bg-black/90'>
            <Upload className='w-4 h-4 mr-2' />
            Upload Course
          </Button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='space-y-6 flex flex-col gap-6 justify-start items-start'>
            {/* Main Video */}
            <div className='relative w-full h-[400px] max-h-[400px] bg-black flex items-center justify-center'>
              <video
                controls
                src={activeLesson.videoUrl}
                className='w-full h-full object-contain'
              />
            </div>

            {/* Course Details */}
            <div>
              <h1 className='text-2xl font-semibold mb-1'>
                {activeLesson.title}
              </h1>
              <p className='text-sm text-gray-500'>{activeLesson.duration}</p>
            </div>

            {/* Instructor */}
            <div className='flex items-center gap-3'>
              <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                <Image
                  src={course.instructor.avatar || "/placeholder.svg"}
                  alt={course.instructor.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div>
                <h3 className='font-medium'>{course.instructor.name}</h3>
                <p className='text-sm text-gray-500'>
                  {course.instructor.title}
                </p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <p className='text-gray-600 leading-relaxed'>
              {course.description}
            </p>
          </div>
          {/* Course Info */}
          <div className='space-y-6'>
            {/* Free Lessons */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Free lessons</h2>
              <p className='text-gray-500'>Explore our free lessons</p>

              <div className='space-y-3'>
                {course.lessons.map((lesson) => (
                  <Card
                    key={lesson.day}
                    className={`p-3 flex gap-4 cursor-pointer ${
                      activeLesson.day === lesson.day
                        ? "bg-gray-100 border border-gray-400"
                        : ""
                    }`}
                    onClick={() => handleLessonClick(lesson)}>
                    <div className='relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0'>
                      <Image
                        src={lesson.thumbnail || "/placeholder.svg"}
                        alt={lesson.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-gray-500 mb-1'>
                        Day {lesson.day}
                      </p>
                      <h3 className='font-medium mb-1'>{lesson.title}</h3>
                      <p className='text-sm text-gray-500'>{lesson.duration}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
