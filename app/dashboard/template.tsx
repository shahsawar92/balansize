import { ReactNode } from 'react';

import DashboardLayout from './DashboardLayout';

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 