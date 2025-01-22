"use client";

import { ReactNode } from "react";

import { useCurrentNavigation } from "@/hooks/useCurrentNavigation";

import DashboardHeader from "@/components/dashboard/Header";
import DashboardSidebar from "@/components/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const currentTitle = useCurrentNavigation();

  return (
    <div className='flex min-h-dvh p-5 bg-white'>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <DashboardHeader title={currentTitle} />

        {/* Main Content Area */}
        <main className='flex-1 overflow-y-auto p-4'>{children}</main>
      </div>
    </div>
  );
}
