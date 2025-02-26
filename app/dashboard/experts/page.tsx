"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import logger from "@/lib/logger";
import { cn } from "@/lib/utils";

import Table from "@/components/table/Table";

import {
  useDeleteExpertMutation,
  useGetExpertsQuery,
} from "@/redux/api/expert-api";

import { Expert } from "@/types/experts";
import Image from "next/image";
import { BASE_URL } from "@/constant/env";
import { toast } from "react-toastify";

export default function ExpertsPage() {
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([]);
  const [users, setExperts] = useState<Expert[]>([]);
  const router = useRouter();
  const { data: experts, error, isLoading } = useGetExpertsQuery();
  const [deleteExpert] = useDeleteExpertMutation();
  useEffect(() => {
    if (experts) {
      setExperts(experts.result);
    }
  }, [experts]);
  logger(experts, "experts");
  const handleEdit = (user: Expert) => {
    router.push(`/dashboard/experts/${user.id}/edit`);
  };

  const handleDelete = (user: Expert) => {
    toast.error(`Deleting ${user.name}`);
    // deleteExpert(user.id);
    toast.success(`Deleted ${user.name}`);
  };

  const columns = [
    {
      header: "#",
      accessor: (expert: Expert) => expert.id.toString(),
      sortable: false,
    },
    {
      header: "Profile Picture",
      accessor: (expert: Expert) => (expert.profile_picture ? expert.profile_picture.toString() : ""),
      sortable: false,
      cell: (user: Expert | any) => (
        <Image
          width={40}
          height={40}
          src={BASE_URL + "/" + user.profile_picture}
          alt={user.name}
          className='w-10 h-10 rounded-full'
        />
      ),
    },
    {
      header: "Name",
      accessor: (expert: Expert) => expert.name,
      sortable: true,
    },
    {
      header: "Designation",
      accessor: (expert: Expert) => expert.designation,
      sortable: true,
    },
    {
      header: "About",
      accessor: (expert: Expert) => expert.designation || "",
      sortable: true,
      cell: (user: Expert) => (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs max-w-sm text-wrap font-medium"
          )}>
          {typeof window === "undefined" ? "Loading..." : user.about}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (expert: Expert) => expert.id.toString(),
      sortable: false,
      cell: (user: Expert) => (
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

  const handleRowClick = (user: Expert) => {
    logger(user, "click");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading experts</p>;
  return (
    <div className='max-w-7xl mx-auto'>
      <Table
        data={users}
        columns={columns}
        onRowClick={handleRowClick}
        selectable={false}
        onSelectionChange={setSelectedExperts}
        itemsPerPage={10}
      />
    </div>
  );
}
