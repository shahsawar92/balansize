'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef,useState } from 'react';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import Input from '@/components/input/Input';
import NextImage from '@/components/NextImage';
import Text from '@/components/text/Text';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    plan: 'Basic Plan (149/Year)'
  });
  const [selectedPlan, setSelectedPlan] = useState('plan1');
  const [imageUrl, setImageUrl] = useState('/images/placeholder.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add your fetch user logic here using the id
    // Example:
    // const fetchUser = async () => {
    //   const response = await fetch(`/api/users/${id}`);
    //   const data = await response.json();
    //   setUser(data);
    //   setSelectedPlan(`plan${data.planId}`);
    // };
    // fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add your update logic here
      // Example:
      // await fetch(`/api/users/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ ...user, planId: selectedPlan }),
      // });
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for immediate display
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);

      // Here you can also implement your image upload logic
      // Example:
      // const formData = new FormData();
      // formData.append('image', file);
      // await fetch('/api/upload', { method: 'POST', body: formData });
    }
  };

  return (
    <div className="w-full max-w-7xl py-5 px-5 mx-auto bg-secondary-100 rounded-2xl">
      <div className="relative ">
        <div className="absolute right-8 top-0 ">
          <div 
            onClick={handleImageClick}
            className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          >
            <NextImage
              useSkeleton
              src={imageUrl}
              alt="Profile Picture"
              width={126}
              height={126}
              className="object-cover w-full h-full"
              classNames={{
                image: 'object-cover w-full h-full',
                blur: 'bg-gray-200'
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-12 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="First name"
              variant="light"
              sizeOfInput="large"
              className="w-full max-w-80"
              withBorder={false}
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              variant="light"
              className="w-full max-w-80"
              withBorder={false}
              sizeOfInput="large"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </div>
          
          <Input
            placeholder="Email"
            type="email"
            variant="light"
            className="w-full max-w-80"
            withBorder={false}
            sizeOfInput="large"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <div className="space-y-4 pb-20">
            <h3 className="text-sm font-medium text-gray-700">Subscriptions</h3>
           <div className="flex flex-wrap items-center gap-4">
                {[1, 2, 3, 4].map((plan) => (
                    <div key={`plan${plan}`} className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="subscription"
                        id={`plan${plan}`}
                        value={`plan${plan}`}
                        checked={selectedPlan === `plan${plan}`}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                    />
                    <label htmlFor={`plan${plan}`}>
                        <Text
                        variant="main"
                        size="xs"
                        weight="semibold"
                        isCenterAligned={false} // Updated since alignment should be flexible
                        isUppercase={false}
                        isItalic={false}
                        >
                        Basic Plan (149/Year)
                        </Text>
                    </label>
                    </div>
                ))}
                </div>

          </div>

          <div className="absolute bottom-0  right-0 ">
           <Button
              type="submit"
              className="w-full max-w-28 items-center justify-center rounded-full"
              sizeOfButton="large"
              variant="brown"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}