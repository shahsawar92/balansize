"use client";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Button from "@/components/buttons/Button";
import Separator from "@/components/seperator/Seperator";
import Text from "@/components/text/Text";
import { useGetArticleQuery } from "@/redux/api/articles-api";
import path from "path";
import logger from "@/lib/logger";
import { usePathname, useRouter } from "next/navigation";

interface BlogPost {
  title: string;
  author: string;
  content: string;
  image: string;
  benefits: string[];
}

export default function BlogPost() {
  const pathname = usePathname();
  logger(pathname, "pathname");
  const artilcleId = pathname.split("/").pop();
  const { data, isLoading } = useGetArticleQuery(Number(artilcleId));

  logger(data, "data");

  const post: BlogPost = {
    title: "5 Benefits of Zumba for Weight Loss",
    author: "Anna Deer",

    content:
      "Zumba is more than just a dance; it's a high-energy workout that combines fun and fitness. Whether you're a seasoned dancer or a complete beginner, Zumba can be an effective way to shed pounds and get your heart pumping.",
    image: "/images/blog2.png",
    benefits: [
      "Burns Calories Fast: A single Zumba session can burn up to 600 calories, making it one of the most effective workouts for those aiming to lose weight.",
      "Full Body Workout: The dance movements provide a full-body group helping tone your body while improving overall strength and flexibility.",
      "Boosts Metabolism: The mix of cardio and interval training keeps your metabolism elevated long after your workout is complete.",
      "Reduces Stress: Dancing releases endorphins, reducing stress and helping you stay motivated in your fitness journey.",
    ],
  };

  return (
    <div className='min-h-screen bg-secondary-100 p-6 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left Column - Image */}
          <div className='relative'>
            <div className='relative aspect-square overflow-hidden rounded-lg'>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className='object-cover'
                priority
              />
            </div>
            <div className='absolute top-4 left-4 flex gap-2'>
              <Button
                variant='brown'
                sizeOfButton='sm'
                className='bg-background/80 backdrop-blur-sm'>
                <Edit className='w-4 h-4 mr-2' />
                Edit
              </Button>
              <Button
                variant='brown'
                sizeOfButton='sm'
                className='bg-background/80 backdrop-blur-sm'>
                <Trash2 className='w-4 h-4 mr-2' />
                Delete
              </Button>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className='space-y-6'>
            <div>
              <Text
                variant='main'
                size='3xl'
                weight='bold'
                tagName='h1'
                classNames='mb-1'>
                {post.title}
              </Text>

              <Text variant='thirtery' size='sm' tagName='p'>
                3 min read
              </Text>

              <Text
                variant='secondary'
                size='lg'
                tagName='h4'
                classNames='mt-3'>
                {post.author}
              </Text>
              <Text variant='thirtery' size='sm' tagName='p'>
                Fitness Coach
              </Text>
            </div>

            <Separator
              orientation='horizontal'
              color='muted'
              thickness='medium'
              className='bg-text-3'
            />

            <div className='prose prose-gray max-w-none'>
              <Text variant='secondary' size='sm' tagName='p' classNames='mt-3'>
                {post.content}
              </Text>

              <Text
                variant='main'
                weight='bold'
                size='lg'
                tagName='h3'
                classNames='mt-3'>
                Benefits of Zumba
              </Text>
              <h2 className='text-xl font-semibold  mt-6 mb-4'></h2>

              <ul className='space-y-4 list-none pl-0'>
                {post.benefits.map((benefit, index) => (
                  <li key={index} className='flex gap-2'>
                    <span className='font-medium text-main-brown'>•</span>
                    <Text
                      variant='secondary'
                      size='sm'
                      tagName='p'
                      classNames=''>
                      {benefit}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>

            <div className='pt-6'>
              <Link href='/dashboard/articles'>
                <Button variant='brown'>
                  <Text variant='light' size='sm' color='white' tagName='p'>
                    Back to Articles
                  </Text>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
