"use client";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

import logger from "@/lib/logger";

import { Card, CardContent, CardTitle } from "@/components/cards/card";
import Text from "@/components/text/Text";

import {
  DashboardHomeResponse,
  useGetDashboardHomeQuery,
} from "@/redux/api/home-api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
);

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardHomeQuery();
  logger(data, "Dashboard API Response");

  const counters = (data as DashboardHomeResponse)?.result?.counters ?? {};
  const monthlyUsers = data?.result?.monthlyUsers || [];
  const articleCategories = data?.result?.articleCategories || [];

  const stats = [
    { label: "Users", value: counters.users ?? 0 },
    { label: "Subscriptions", value: counters.subscriptions ?? 0 },
    { label: "Experts", value: counters.experts ?? 0 },
    { label: "Courses", value: counters.courses ?? 0 },
  ];

  const barChartData = {
    labels: monthlyUsers.map((d: any) => d.monthname.trim()),
    datasets: [
      {
        label: "Monthly Users",
        data: monthlyUsers.map((d: any) => Number(d.count)),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const pieChartData = {
    labels: articleCategories.map((c: any) => c.categoryName),
    datasets: [
      {
        label: "Articles by Category",
        data: articleCategories.map((c: any) => Number(c.count)),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#6366f1",
        ],
      },
    ],
  };

  if (isLoading) return <div className='p-6'>Loading...</div>;
  if (isError)
    return <div className='p-6 text-red-500'>Error loading data.</div>;

  return (
    <div className='mx-auto p-6 overflow-hidden bg-secondary-100 rounded-2xl'>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
        {stats.map((stat, index) => (
          <Card
            key={index}
            className='bg-white shadow-sm rounded-lg p-4 flex flex-col items-center justify-center text-center border border-gray-200'>
            <CardTitle>
              <Text
                tagName='h2'
                size='2xl'
                weight='bold'
                variant='main'
                classNames='mb-2'>
                {stat.label}
              </Text>
            </CardTitle>
            <CardContent className='text-gray-700 flex flex-col items-center justify-center'>
              <Text size='lg' weight='bold' variant='main'>
                {stat.value}
              </Text>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-white shadow-sm rounded-lg p-6'>
          <Text
            tagName='h3'
            size='lg'
            weight='bold'
            variant='main'
            classNames='mb-4'>
            Monthly Users
          </Text>
          <Bar
            data={barChartData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>

        <div className='bg-white shadow-sm rounded-lg p-6'>
          <Text
            tagName='h3'
            size='lg'
            weight='bold'
            variant='main'
            classNames='mb-4'>
            Monthly Growth (Line)
          </Text>
          <Line
            data={barChartData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>

        <div className='bg-white shadow-sm rounded-lg p-6'>
          <Text
            tagName='h3'
            size='lg'
            weight='bold'
            variant='main'
            classNames='mb-4'>
            Articles by Category
          </Text>
          <Pie
            data={pieChartData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>

        <div className='bg-white shadow-sm rounded-lg p-6'>
          <Text
            tagName='h3'
            size='lg'
            weight='bold'
            variant='main'
            classNames='mb-4'>
            Category Distribution
          </Text>
          <Doughnut
            data={pieChartData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>
      </div>
    </div>
  );
}
