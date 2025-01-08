'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

import { navigationItems } from './navigation-items';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={clsx(
        'bg-secondary-100 border-r rounded-2xl border-secondary-300 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex justify-center items-center p-5">
        <UnstyledLink href="/dashboard">
          <NextImage 
            useSkeleton
            src="/images/logo.png" 
            alt="Logo" 
            width={90}
            height={68}
            className={clsx(
              'transition-all duration-300',
              isCollapsed ? 'w-8' : 'w-32'
            )} 
          />
        </UnstyledLink>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        {navigationItems.map((item) => (
          <UnstyledLink
            key={item.path}
            href={item.path}
            className={clsx(
              'flex items-center px-4 py-2 my-1 rounded-lg transition-colors',
              pathname === item.path 
                ? 'text-primary-600' 
                : 'text-gray-600 hover:bg-secondary-300 hover:text-main-brown'
            )}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3">{item.label}</span>
            )}
          </UnstyledLink>
        ))}
      </nav>
    </aside>
  );
} 