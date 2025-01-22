"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { mockUsers, plans } from "@/data/mock-users";

import Input from "@/components/input/Input";
import NextImage from "@/components/NextImage";
import Text from "@/components/text/Text";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState(
    mockUsers.find((u) => u.id === id) || {
      firstName: "",
      lastName: "",
      email: "",
      profilePicture: "/images/avatars/avatar-1.png",
      plan: "Basic Plan (149/Year)",
    }
  );

  return (
    <div className='w-full max-w-7xl py-5 px-5 mx-auto bg-secondary-100 rounded-2xl'>
      <div className='relative '>
        <div className='absolute right-8 top-0 '>
          <div className='relative w-12 h-12 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'>
            <NextImage
              useSkeleton
              src={user.profilePicture}
              alt='Profile Picture'
              width={126}
              height={126}
              className='object-cover w-full h-full'
              classNames={{
                image: "object-cover w-full h-full",
                blur: "bg-gray-200",
              }}
            />
          </div>
        </div>

        <div className='space-y-6 mt-12 max-w-2xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              placeholder='First name'
              variant='light'
              sizeOfInput='large'
              className='w-full max-w-80'
              withBorder={false}
              readOnly
              value={user.firstName}
            />
            <Input
              placeholder='Last Name'
              variant='light'
              className='w-full max-w-80'
              withBorder={false}
              sizeOfInput='large'
              readOnly
              value={user.lastName}
            />
          </div>

          <Input
            placeholder='Email'
            type='email'
            variant='light'
            className='w-full max-w-80'
            withBorder={false}
            sizeOfInput='large'
            readOnly
            value={user.email}
          />

          <div className='space-y-4 pb-20'>
            <h3 className='text-sm font-medium text-gray-700'>Subscriptions</h3>
            <div className='flex flex-wrap items-center gap-4'>
              {plans.map((plan) => (
                <div key={`plan${plan}`} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='subscription'
                    readOnly
                    id={`plan${plan}`}
                    value={`plan${plan}`}
                    checked={user.plan === plan.name}
                  />
                  <label htmlFor={`plan${plan}`}>
                    <Text
                      variant='main'
                      size='xs'
                      weight='semibold'
                      isCenterAligned={false}
                      isUppercase={false}
                      isItalic={false}>
                      {plan.name}
                    </Text>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
