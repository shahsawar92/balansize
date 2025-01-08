import {
  BookOpenIcon,
  CalendarDaysIcon,
  PuzzlePieceIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"; // Heroicons
import { Brain, Dumbbell, HeartPulse, Leaf, User } from "lucide-react"; // Lucide icons
import React from "react";

import { Card, CardContent } from "@/components/cards/card";

const Dashboard = () => {
  // Define the features with their respective icons and labels
  const features = [
    { label: "Mental Health", icon: <Brain size={32} /> },
    { label: "Nutritions", icon: <Leaf size={32} /> },
    { label: "Self Care", icon: <HeartPulse size={32} /> },
    { label: "Fitness", icon: <Dumbbell size={32} /> },
    { label: "Experts", icon: <User size={32} /> },
    {
      label: "Cycle Calendar",
      icon: <CalendarDaysIcon className='w-8 h-8' />,
      comingSoon: true,
    },
    {
      label: "Library",
      icon: <BookOpenIcon className='w-8 h-8' />,
      comingSoon: true,
    },
    {
      label: "Events",
      icon: <CalendarDaysIcon className='w-8 h-8' />,
      comingSoon: true,
    },
    {
      label: "Partners",
      icon: <UsersIcon className='w-8 h-8' />,
      comingSoon: true,
    },
    {
      label: "Hobbies",
      icon: <PuzzlePieceIcon className='w-8 h-8' />,
      comingSoon: true,
    },
  ];

  return (
    <div className='min-h-dvh bg-secondary-100 rounded-2xl flex flex-wrap items-start p-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 w-full'>
        {features.map((feature, index) => (
          <Card
            key={index}
            className='flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 text-center '>
            <CardContent className='flex flex-col items-center justify-center'>
              <div className='text-main-black mb-4 '>{feature.icon}</div>
              <h3 className='text-sm font-semibold text-main-black'>
                {feature.label}
              </h3>
              {feature.comingSoon && (
                <p className='text-xs text-text-3 mt-2'>Coming Soon</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
