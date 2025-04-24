"use client";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import ButtonLink from "@/components/links/ButtonLink";
import Separator from "@/components/seperator/Seperator";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import {
  useDeleteArticleMutation,
  useGetArticleQuery,
  useGetArticlesQuery,
} from "@/redux/api/articles-api";

export default function BlogPost() {
  const pathname = usePathname();
  const articleId = pathname.split("/").pop();
  const { refetch } = useGetArticlesQuery();

  const router = useRouter();
  const { data, isLoading } = useGetArticleQuery(Number(articleId));
  // useDeleteArticleMutation
  const [deleteArticle] = useDeleteArticleMutation();

  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      toast.info("Deleting article, please wait...");
      const { data } = await deleteArticle(Number(articleId));

      if (data?.success) {
        Swal.fire("Deleted!", "The article has been deleted.", "success");
        await refetch();
        router.push("/dashboard/articles");
      } else {
        Swal.fire(
          "Error!",
          "Failed to delete article. Please try again.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "An error occurred while deleting the article.",
        "error"
      );
      logger(error, "Error deleting article:");
    }
  };

  logger(data, "Fetched Article Data");

  if (isLoading) return <p>Loading...</p>;
  if (!data?.data) return <p>Article not found.</p>;

  const {
    title,
    excerpt,
    content,
    min_to_read,
    feature_image,
    category,
    expert,
  } = data.data;

  return (
    <div className='min-h-screen bg-secondary-100 p-6 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left Column - Image */}
          <div className='relative'>
            <div className='relative aspect-square overflow-hidden rounded-lg'>
              <Image
                src={`${BASE_URL}/${feature_image}`}
                alt={title}
                fill
                className='object-cover'
                priority
              />
            </div>
            <div className='absolute top-0  left-0 right-0 px-2 py-2 flex gap-2 bg-slate-800/40'>
              <ButtonLink
                href={`/dashboard/articles/${articleId}/edit`}
                variant='dark'
                className='bg-background/80 backdrop-blur-sm'>
                <Edit className='w-4 h-4 mr-2 text-white' />
                Edit
              </ButtonLink>
              <Button
                variant='dark'
                sizeOfButton='sm'
                className='bg-background/80 backdrop-blur-sm'
                onClick={handleDelete}>
                <Trash2 className='w-4 h-4 mr-2' />
                Delete
              </Button>
            </div>
          </div>

          {/* Right Column - Article Content */}
          <div className='space-y-6'>
            <div>
              <Text
                variant='main'
                size='3xl'
                weight='bold'
                tagName='h1'
                classNames='mb-1'>
                {title}
              </Text>

              <Text variant='thirtery' size='sm' tagName='p'>
                {min_to_read} min read
              </Text>

              {/* Category Display */}
              {category && (
                <div className='flex items-center gap-2 mt-2'>
                  <Image
                    src={`${BASE_URL}/${category.icon}`}
                    alt={category.name}
                    width={24}
                    height={24}
                    className='rounded-full'
                  />
                  <Text variant='secondary' size='lg' tagName='p'>
                    {category.name}
                  </Text>
                </div>
              )}

              <Separator
                orientation='horizontal'
                color='muted'
                thickness='medium'
                className='bg-text-3 my-4'
              />

              <Text variant='secondary' size='lg' tagName='h4'>
                {excerpt}
              </Text>

              <div
                className='prose prose-gray max-w-none mt-4'
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            {/* Expert Section */}
            {expert && (
              <div className='flex items-center gap-4 mt-6 p-4 border rounded-lg bg-background shadow'>
                <Image
                  src={`${BASE_URL}/${expert.profile_picture}`}
                  alt={expert.name}
                  width={64}
                  height={64}
                  className='rounded-full'
                />
                <div>
                  <Text variant='main' size='lg' weight='bold'>
                    {expert.name}
                  </Text>
                  <Text variant='thirtery' size='sm'>
                    {expert.designation}
                  </Text>
                  <Text variant='secondary' size='sm' classNames='mt-2'>
                    <div dangerouslySetInnerHTML={{ __html: expert.about }} />
                  </Text>
                </div>
              </div>
            )}

            {/* Back Button */}
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
