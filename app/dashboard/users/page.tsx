"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

import logger from "@/lib/logger";
import { cn } from "@/lib/utils";

import { mockUsers } from "@/data/mock-users";

import Table from "@/components/table/Table";

import { Column, User } from "@/types/user";

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const router = useRouter();

  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/${user.id}/edit`);
  };

  const handleDelete = (user: User) => {
    logger(user, "delete");
    // Add your delete logic here
  };

  const columns = [
    {
      header: "#",
      accessor: "id",
      sortable: false,
      cell: (user: User) => (
        <span className='text-sm text-gray-600'>
          {mockUsers.indexOf(user) + 1}
        </span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      sortable: true,
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      header: "Plan",
      accessor: "role",
      sortable: true,
      cell: (user: User) => (
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium")}>
          {user.plan}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      sortable: false,
      cell: (user: User) => (
        <div className='flex items-center gap-3'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
            className='p-2 hover:bg-gray-100 hover:bg-secondary-500 rounded-lg flex items-center gap-2 transition-colors'>
            <PencilSquareIcon className='w-5 h-5 text-main-brown' /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user);
            }}
            className='p-2 hover:bg-secondary-500 flex items-center gap-2 rounded-lg transition-colors'>
            <TrashIcon className='w-5 h-5 text-main-brown ' />
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (user: User) => {
    logger(user, "click");
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <Table
        data={mockUsers}
        columns={columns as Column<User>[]}
        onRowClick={handleRowClick}
        selectable={false}
        onSelectionChange={setSelectedUsers}
        itemsPerPage={10}
      />
    </div>
  );
}
