"use client";

import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import { logout } from "@/redux/features/auth-slice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function DashboardHeader({ title }: { title: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    // confirm logout
    alert("Are you sure you want to logout?");
    // dispatch logout action
    dispatch(logout());
    router.push("/login");
  };

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
            <ArrowRightStartOnRectangleIcon
              className='w-6 h-6 text-gray-600'
              onClick={handleLogout}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
