"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Input from "@/components/input/Input";
import NextImage from "@/components/NextImage";

import { BASE_URL } from "@/constant/env";
import { useGetUserQuery } from "@/redux/api/users-api";

import { User } from "@/types/users";

export default function EditUserPage() {
  const { id } = useParams();
  const { data: user, isLoading, isError } = useGetUserQuery(id as string);
  const [selectedUser, setSelectedUser] = useState<User>();

  useEffect(() => {
    if (user?.success) {
      setSelectedUser(user.result);
    }
  }, [user]);

  if (isLoading)
    return <p className='text-center text-gray-700'>Loading user data...</p>;
  if (isError || !selectedUser)
    return <p className='text-center text-red-500'>User not found.</p>;

  return (
    <div className='w-full max-w-7xl mx-auto bg-secondary-100 rounded-2xl p-6 shadow-md'>
      <div className='flex flex-col md:flex-row items-center gap-6 md:gap-12'>
        {/* Profile Image */}
        <div className='relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'>
          <NextImage
            useSkeleton
            src={
              selectedUser.profile_picture
                ? `${BASE_URL}/${selectedUser.profile_picture}`
                : "/images/placeholder.png"
            }
            alt='Profile Picture'
            width={126}
            height={126}
            className='object-cover w-full h-full'
          />
        </div>

        {/* User Information */}
        <div className='flex flex-col w-full space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              placeholder='First name'
              variant='light'
              sizeOfInput='large'
              className='w-full'
              withBorder={false}
              readOnly
              value={selectedUser.first_name}
            />
            <Input
              placeholder='Last Name'
              variant='light'
              sizeOfInput='large'
              className='w-full'
              withBorder={false}
              readOnly
              value={selectedUser.last_name}
            />
          </div>

          <Input
            placeholder='Email'
            type='email'
            variant='light'
            sizeOfInput='large'
            className='w-full'
            withBorder={false}
            readOnly
            value={selectedUser.email}
          />
        </div>
      </div>
    </div>
  );
}
