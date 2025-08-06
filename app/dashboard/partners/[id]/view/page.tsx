"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import SanitizeHtmlWidget from "@/components/html-parser/sanitieHtml";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import { useGetPartnersQuery } from "@/redux/api/partners-api";

import { Partner } from "@/types/partners";

export default function ViewPartnerPage() {
  const { id } = useParams();
  const { data } = useGetPartnersQuery();
  const [partner, setPartner] = useState<Partner | null>(null);

  useEffect(() => {
    if (data?.result?.length) {
      const found = data.result.find((p): p is Partner => p.id === Number(id));
      setPartner(found || null);
    }
  }, [data, id]);

  if (!partner) return <div className='p-6 text-center'>Loading...</div>;

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      {/* Title */}
      <Text className='text-center mb-8'>Partner Details</Text>

      {/* Images Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
        {partner.images?.length ? (
          partner.images.map((img) => (
            <div
              key={img.id}
              className='overflow-hidden rounded-lg shadow-md border group'>
              <Image
                src={`${BASE_URL}/${img.link}`}
                alt='Partner'
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
      <div className='prose max-w-none mb-8'>
        {SanitizeHtmlWidget({ htmlContent: partner.description })}
      </div>

      {/* Visit Link */}
      <div className='text-center'>
        <a
          href={partner.link}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition'>
          Visit Partner Website
        </a>
      </div>
    </div>
  );
}
