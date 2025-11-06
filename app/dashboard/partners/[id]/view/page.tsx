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
    <div className='max-w-6xl mx-auto px-6 py-12'>
      {/* Header Section */}
      <div className='mb-12'>
        <Text className='text-center text-4xl font-bold mb-3'>
          Partner Details
        </Text>
        <div className='w-24 h-1 bg-blue-600 mx-auto rounded-full'></div>
      </div>

      {/* Premium Badge */}
      {partner.is_premium && (
        <div className='flex justify-center mb-10'>
          <div className='inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-7 w-7 animate-pulse'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
              />
            </svg>
            <Text className='font-bold text-xl tracking-wider uppercase'>
              Premium Partner
            </Text>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-7 w-7 animate-pulse'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
              />
            </svg>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className='mb-12'>
        <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Gallery</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {partner.images?.length ? (
            partner.images.map((img) => (
              <div
                key={img.id}
                className='relative overflow-hidden rounded-2xl shadow-xl border-2 border-gray-100 group hover:shadow-2xl transition-all duration-300'>
                <Image
                  src={`${BASE_URL}/${img.link}`}
                  alt='Partner'
                  width={500}
                  height={300}
                  className='w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </div>
            ))
          ) : (
            <p className='text-sm italic text-gray-500 col-span-full text-center py-8'>
              No images available
            </p>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className='mb-12 bg-gray-50 rounded-2xl p-8 shadow-lg'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-800'>About</h2>
        <div className='prose prose-lg max-w-none'>
          {SanitizeHtmlWidget({ htmlContent: partner.description })}
        </div>
      </div>

      {/* Visit Link */}
      <div className='text-center'>
        <a
          href={partner.link}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold'>
          Visit Partner Website
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
