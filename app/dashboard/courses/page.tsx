"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/cards/card";
import CustomSelect from "@/components/select/Select";
import Button from "@/components/buttons/Button";
import { useState } from "react";
import Text from "@/components/text/Text";

interface BlogPost {
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  creator_name?: string;
  creator_image?: string;
  slug: string;
  isLock: boolean;
}

export default function BlogPage() {
  const [formData, setFormData] = useState({ category: "" });
  const blogPosts: BlogPost[] = [
    {
      title: "The Connection Between Physical and Mental Health",
      excerpt: "Explore the connection between physical and mental health...",
      readTime: "4 min",
      image: "/images/vid-1.png",
      slug: "physical-mental-health",
      creator_name: "John Doe",
      creator_image: "/images/placeholder.png",
      isLock: true,
    },
    {
      title: "5 Benefits of Zumba for Weight Loss",
      excerpt: "Zumba is more than just a dance",
      readTime: "4 min",
      image: "/images/vid-2.png",
      slug: "zumba-benefits",
      creator_image: "/images/placeholder.png",
      creator_name: "Jane Doe",
      isLock: true,
    },
    {
      title: "The Core of Fitness: Why Physical Strength Matters",
      excerpt: "Explore the importance of building physical strength f...",
      readTime: "5 min",
      image: "/images/vid-3.png",
      slug: "physical-strength",
      creator_image: "/images/placeholder.png",
      creator_name: "John Doe",
      isLock: false,
    },
    {
      title: "10 Steps to Achieve Optimal Physical Fitness",
      excerpt: "Discover practical steps to improve your fitness level...",
      readTime: "6 min",
      image: "/images/vid-1.png",
      slug: "optimal-fitness",
      creator_image: "/images/placeholder.png",
      creator_name: "Jane Doe",
      isLock: true,
    },
  ];

  return (
    <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
      <div className='w-full flex justify-between items-center mb-9 '>
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
            trigger: "w-full rounded-full border ",
            selected: "text-opacity-80",
            container: "w-full max-w-72",
          }}
        />
        <Button
          type='submit'
          className='max-w-72- items-center justify-center rounded-full'
          sizeOfButton='large'
          variant='brown'>
          Upload new course
        </Button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6'>
        {blogPosts.map((post, index) => (
          <Card
            key={index}
            className='group overflow-hidden p-0 bg-transparent rounded-lg shadow-none border-none'>
            <Link
              href={`/dashboard/courses/${post.slug}`}
              className='block h-full'>
              <CardContent className='p-0 rounded-none'>
                <div className='relative h-48 w-full'>
                  {/* lock png at top left */}

                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className='object-contain'
                  />
                  {post?.isLock === true && (
                    <div className='absolute top-2 left-2  rounded-full'>
                      <Image
                        src='/images/lock.png'
                        alt='creator'
                        width={32}
                        height={32}
                        className='rounded-full opacity-100'
                      />
                    </div>
                  )}
                  <div
                    className='absolute flex items-center gap-5 bottom-3 left-0 w-3/2 mx-5 right-2 p-1 rounded-full'
                    style={{
                      backgroundImage: `linear-gradient(${["to right", "to left", "to top", "to bottom", "to top left", "to bottom right"][index % 6]}, #564137, #796E68)`,
                      opacity: 0.8,
                    }}>
                    <Image
                      src='/images/placeholder.png'
                      alt='creator'
                      width={32}
                      height={32}
                      className='rounded-full opacity-100'
                    />
                    <Text
                      variant='white'
                      size='lg'
                      weight='normal'
                      isCenterAligned={true}>
                      Creator
                    </Text>
                  </div>
                </div>
                <div className='p-1'>
                  <h3 className='font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-main-black'>
                    {post.title}
                  </h3>
                  <p className='text-sm text-muted-foreground mb-4 line-clamp-2 text-text-2'>
                    {post.excerpt}
                  </p>
                  <p className='text-xs text-muted-foreground text-text-3'>
                    {post.readTime}
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
