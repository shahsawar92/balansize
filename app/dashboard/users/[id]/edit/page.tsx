"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import {
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/api/users-api";

import { User } from "@/types/users";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading, isError } = useGetUserQuery(id as string);
  const [updateUser] = useUpdateUserMutation();
  const { refetch } = useGetUsersQuery();

  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("Basic Plan (149/Year)");
  const [imageUrl, setImageUrl] = useState<string>("/images/placeholder.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.success) {
      const userData = data.result;
      setUser(userData);
      setSelectedPlan("Basic Plan (149/Year)");
      setImageUrl(
        userData.profile_picture
          ? `${BASE_URL}/${userData.profile_picture}`
          : "/images/placeholder.png"
      );
    }
  }, [data]);

  if (isLoading)
    return <p className='text-center text-gray-700'>Loading user data...</p>;
  if (isError || !user)
    return <p className='text-center text-red-500'>User not found.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);
      formData.append("email", user.email);
      if (user.profile_picture instanceof File) {
        formData.append("profile_picture", user.profile_picture);
      }
      refetch();
      await updateUser({ id: user.id, data: formData });
      router.push("/dashboard/users");
    } catch (error) {
      logger(error, "Update User Error");
    }
  };

  return (
    <div className='w-full max-w-4xl mx-auto bg-secondary-100 rounded-2xl p-6 shadow-md'>
      <div className='flex flex-col md:flex-row items-center gap-6'>
        {/* Profile Picture */}

        <ImageUploader
          imageUrl={imageUrl}
          onFileChange={(file) => setUser({ ...user, profile_picture: file })}
          buttonText='Upload Photo'
        />

        {/* User Form */}
        <form
          onSubmit={handleSubmit}
          className='flex flex-col w-full space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              placeholder='First Name'
              variant='light'
              className='w-full'
              withBorder={false}
              value={user.first_name}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            />
            <Input
              placeholder='Last Name'
              variant='light'
              className='w-full'
              withBorder={false}
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            />
          </div>

          <Input
            placeholder='Email'
            type='email'
            variant='light'
            className='w-full'
            withBorder={false}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          {/* Subscription Plan */}
          <div className='space-y-4'>
            <h3 className='text-sm font-medium text-gray-700'>
              Subscription Plan
            </h3>
            <div className='flex flex-wrap items-center gap-4'>
              {["Basic Plan", "Premium Plan", "Enterprise Plan"].map((plan) => (
                <div key={plan} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='subscription'
                    id={plan}
                    checked={selectedPlan === plan}
                    onChange={() => setSelectedPlan(plan)}
                  />
                  <label htmlFor={plan}>
                    <Text variant='main' size='xs' weight='semibold'>
                      {plan}
                    </Text>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='px-6 py-2 rounded-full'
              variant='brown'>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
