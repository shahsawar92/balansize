"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import logger from "@/lib/logger";
import { cn } from "@/lib/utils";

import UnderlineLink from "@/components/links/UnderlineLink";
import Table from "@/components/table/Table";

import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/api/users-api";

import { Column } from "@/types/user";
import { User } from "@/types/users";

export default function UsersPage() {
  const { data, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (data?.success) {
      setUsers(data.result);
    }
  }, [data]);

  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/${user.id}/edit`);
  };

  const handleDelete = async (user: User) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteUser(user.id);
          setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        }
      });
    } catch (error) {
      logger(error, "Delete Error");
    }
  };

  const columns = [
    {
      header: "#",
      accessor: "id",
      sortable: false,
      cell: (user: User) => (
        <span className='text-sm text-gray-600'>{user.id}</span>
      ),
    },
    {
      header: "Name",
      accessor: "first_name",
      sortable: true,
      cell: (user: User) => (
        <UnderlineLink
          href={`/dashboard/users/${user.id}`}
          className='text-sm text-main-brown border-none'>
          {user.first_name + " " + user.last_name}
        </UnderlineLink>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      header: "Role",
      accessor: "user_type",
      sortable: true,
      cell: (user: User) => (
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium")}>
          {user.user_type}
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
            onClick={() => handleEdit(user)}
            className='px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors'>
            <PencilSquareIcon className='w-5 h-5 text-main-brown' /> Edit
          </button>
          <button
            onClick={() => handleDelete(user)}
            className='px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg flex transition-colors'>
            <TrashIcon className='w-5 h-5 ' /> Delete
          </button>
        </div>
      ),
    },
  ];
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users?.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  return (
    <div className='mx-auto'>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <Table
          data={filteredUsers}
          columns={columns as Column<User>[]}
          selectable={false}
          itemsPerPage={10}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
    </div>
  );
}
