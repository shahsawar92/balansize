"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Table from "@/components/table/Table";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
} from "@/redux/api/notifications-api";

import { Notification } from "@/types/notifications";

export default function NotificationsPage() {
  const [selectedNotifications, setSelectedNotifications] = useState<
    Notification[]
  >([]);
  const [notifications, setnotifications] = useState<Notification[]>([]);
  logger(notifications, "notifications");
  const router = useRouter();
  const {
    data: notificationData,
    error,
    isLoading,
    refetch,
  } = useGetNotificationsQuery();
  const [deletenotification] = useDeleteNotificationMutation();
  logger(notificationData, "notificationData");
  useEffect(() => {
    if (notificationData?.result && Array.isArray(notificationData?.result)) {
      setnotifications(
        notificationData.result.filter(
          (n): n is Notification & { id: number } => n.id !== undefined
        )
      );
    }
  }, [notificationData?.result]);

  const handleDelete = async (notification: Notification) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete this notification. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      toast.info(`Deleting notification...`);
      try {
        if (!notification.id) {
          throw new Error("Notification ID is required");
        }
        const res = await deletenotification(notification.id).unwrap();
        if (res.success === true) {
          refetch();
        }
        toast.success(`notification has been deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete notification. Please try again.");
      }
    }
  };

  const columns = [
    {
      header: "#",
      accessor: (notification: Notification) =>
        notification.id?.toString() ?? "",
      sortable: false,
    },
    {
      header: "Image",
      accessor: (notification: Notification) => notification.icon,
      sortable: false,
      cell: (notification: Notification) => (
        <div className='flex items-center gap-3 justify-center'>
          <Image
            width={40}
            height={40}
            src={BASE_URL + "/" + notification.icon}
            alt='notification image'
            className='w-10 h-10 rounded-full'
          />
        </div>
      ),
    },
    {
      header: "Title",
      accessor: (notification: Notification) => notification.title,
      sortable: true,
      cell: (notification: Notification) => (
        <div className='flex items-center gap-3 justify-center'>
          <Text variant='main' className='text-sm text-main-brown border-none'>
            {notification.title}
          </Text>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: (notification: Notification) => notification.message,
      sortable: true,
      cell: (notification: Notification) => (
        <div className='flex items-center gap-3 justify-center'>
          <Text
            variant='main'
            className='text-sm text-main-brown border-none w-40 line-clamp-2'>
            {notification.message}
          </Text>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (notification: Notification) =>
        notification.isActive ? "Active" : "Inactive",
      sortable: true,
      cell: (notification: Notification) => (
        <div className='flex items-center gap-3 justify-center'>
          <Text
            variant='main'
            className='text-sm text-main-brown border-none w-40 line-clamp-2'>
            {notification.isActive ? "Active" : "Inactive"}
          </Text>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (notification: Notification) =>
        notification?.id?.toString() ?? "",
      sortable: false,
      cell: (notification: Notification) => (
        <div className='flex items-center gap-3 justify-center'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(notification);
            }}
            className='p-2 hover:bg-secondary-500 flex items-center gap-2 rounded-lg transition-colors'>
            <TrashIcon className='w-5 h-5 text-main-brown' /> Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/notifications/${notification.id}/edit`);
            }}
            className='p-2 hover:bg-secondary-500 flex items-center gap-2 rounded-lg transition-colors'>
            <Edit className='w-5 h-5 text-main-brown' /> Edit
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading notifications...</p>;
  if (error) return <p>Error loading notifications</p>;

  return (
    <div className='max-w-7xl mx-auto'>
      <Table
        data={notifications.filter(
          (n): n is Notification & { id: number } => n.id !== undefined
        )}
        columns={columns}
        isSearchable={false}
        headerButton={{
          title: "Add Notification",
          link: "/dashboard/notifications/add",
        }}
        onRowClick={(notification) => logger(notification, "click")}
        selectable={false}
        onSelectionChange={setSelectedNotifications}
        itemsPerPage={10}
      />
    </div>
  );
}
