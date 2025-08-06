"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import SanitizeHtmlWidget from "@/components/html-parser/sanitieHtml";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import { useGetCommunitiesQuery } from "@/redux/api/community-api";

import { Community } from "@/types/community";

export default function ViewCommunityPage() {
  const { id } = useParams();
  const { data } = useGetCommunitiesQuery();
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    if (data?.result?.length) {
      const found = data.result.find(
        (c): c is Community => c.id === Number(id)
      );
      setCommunity(found || null);
    }
  }, [data, id]);

  if (!community) return <div className='p-6 text-center'>Loading...</div>;

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      {/* Title */}

      {/* Visit Button */}

      {/* Images Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
        {community.images?.length ? (
          community.images.map((img) => (
            <div
              key={img.id}
              className='overflow-hidden rounded-lg shadow-md border group'>
              <Image
                src={`${BASE_URL}/${img.link}`}
                alt='Community'
                width={500}
                height={300}
                className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105'
              />
            </div>
          ))
        ) : (
          <p className='text-sm italic text-gray-500 col-span-full text-center'>
            No images available
          </p>
        )}
      </div>

      {/* Description */}
      <div className='prose max-w-none'>
        {SanitizeHtmlWidget({ htmlContent: community.description })}
      </div>
      <div className='text-center mt-8'>
        <a
          href={community.link}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition'>
          Visit Community
        </a>
      </div>
    </div>
  );
}
