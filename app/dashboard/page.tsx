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

import {
  barData,
  doughnutData,
  lineData,
  pieData,
  stats,
} from "@/data/mock-home";

import { Card, CardContent, CardTitle } from "@/components/cards/card";
import Text from "@/components/text/Text";

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
            Monthly Subscriptions
          </Text>
          <Bar
            data={barData}
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
            Weekly Users
          </Text>
          <Line
            data={lineData}
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
            Subscription Distribution
          </Text>
          <Pie
            data={pieData}
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
            Lesson Types
          </Text>
          <Doughnut
            data={doughnutData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>
      </div>
    </div>
  );
}
