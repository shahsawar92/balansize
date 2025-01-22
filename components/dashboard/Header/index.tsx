"use client";

import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function DashboardHeader({ title }: { title: string }) {
  return (
    <header className='bg-white '>
      <div className='px-4 py-3 flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-gray-800'>{title}</h1>

        <div className='flex items-center space-x-1 md:space-x-4'>
          <button className='p-2 hover:bg-gray-100 rounded-full'>
            <BellIcon className='w-6 h-6 text-gray-600' />
          </button>
          <button className='p-2 hover:bg-gray-100 rounded-full'>
            <Cog6ToothIcon className='w-6 h-6 text-gray-600' />
          </button>

          <button className='p-2 hover:bg-gray-100 rounded-full'>
            <ArrowRightStartOnRectangleIcon className='w-6 h-6 text-gray-600' />
          </button>
        </div>
      </div>
    </header>
  );
}
