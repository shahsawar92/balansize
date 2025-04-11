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

import { Card, CardContent, CardTitle } from "@/components/cards/card";
import Text from "@/components/text/Text";

import { useGetDashboardHomeQuery } from "@/redux/api/home-api";

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

  const stats = [
    { label: "Users", value: data?.results?.counters?.users ?? 0 },
    {
      label: "Subscriptions",
      value: data?.results?.counters?.subscriptions ?? 0,
    },
    { label: "Experts", value: data?.results?.counters?.experts ?? 0 },
    { label: "Courses", value: data?.results?.counters?.courses ?? 0 },
    { label: "Lessons", value: data?.results?.counters?.lessons ?? 0 },
  ];

  const barChartData = {
    labels: data?.results?.monthlyUsers.map((d: any) => d.monthName) ?? [],
    datasets: [
      {
        label: "Users",
        data: data?.results?.monthlyUsers.map((d: any) => d.count) ?? [],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  if (isLoading) return <div className='p-6'>Loading...</div>;
  if (isError)
    return <div className='p-6 text-red-500'>Error loading data.</div>;

  return (
    <div className='mx-auto p-6 overflow-hidden bg-secondary-100 rounded-2xl'>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
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
        {/* You can hook live data to other charts similarly */}
        <div className='bg-white shadow-sm rounded-lg p-6'>
          <Text
            tagName='h3'
            size='lg'
            weight='bold'
            variant='main'
            classNames='mb-4'>
            Weekly Users (Static for now)
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
            Subscription Distribution (Static)
          </Text>
          <Pie
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
            Lesson Types (Static)
          </Text>
          <Doughnut
            data={barChartData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>
      </div>
    </div>
  );
}
