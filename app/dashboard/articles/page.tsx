"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/cards/card";

interface BlogPost {
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  slug: string;
}

export default function BlogPage() {
  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      title: "The Connection Between Physical and Mental Health",
      excerpt: "Explore the connection between physical and mental health...",
      readTime: "4 min read",
      image: "/images/blog1.png",
      slug: "physical-mental-health",
    },
    {
      title: "5 Benefits of Zumba for Weight Loss",
      excerpt: "Zumba is more than just a dance",
      readTime: "4 min read",
      image: "/images/blog2.png",
      slug: "zumba-benefits",
    },
    {
      title: "The Core of Fitness: Why Physical Strength Matters",
      excerpt: "Explore the importance of building physical strength f...",
      readTime: "5 min read",
      image: "/images/blog3.png",
      slug: "physical-strength",
    },
    {
      title: "10 Steps to Achieve Optimal Physical Fitness",
      excerpt: "Discover practical steps to improve your fitness level...",
      readTime: "6 min read",
      image: "/images/blog4.png",
      slug: "optimal-fitness",
    },
  ];

  return (
    <div className='min-h-screen bg-secondary-100 rounded-2xl p-6 md:p-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6'>
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

        {blogPosts.map((post, index) => (
          <Card
            key={index}
            className='group  overflow-hidden p-0 bg-transparent rounded-lg shadow-none border-none'>
            <Link
              href={`/dashboard/articles/${post.slug}`}
              className='block h-full'>
              <CardContent className='p-0 rounded-none'>
                <div className='relative h-48 w-full'>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className='object-contain'
                  />
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
