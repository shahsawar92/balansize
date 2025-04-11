"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";
import { cn } from "@/lib/utils";

import UnderlineLink from "@/components/links/UnderlineLink";
import Table from "@/components/table/Table";

import { BASE_URL } from "@/constant/env";
import {
  useDeleteExpertMutation,
  useGetExpertsQuery,
} from "@/redux/api/expert-api";

import { Expert } from "@/types/experts";

export default function ExpertsPage() {
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([]);
  const [users, setExperts] = useState<Expert[]>([]);
  logger(users, "Experts");
  const router = useRouter();
  const { data: experts, error, isLoading, refetch } = useGetExpertsQuery();
  const [deleteExpert] = useDeleteExpertMutation();

  useEffect(() => {
    if (experts) {
      setExperts(experts.result);
    }
  }, [experts]);

  logger(experts, "experts");

  const handleEdit = (user: Expert) => {
    router.push(`/dashboard/experts/${user.expert_id}/edit`);
  };

  const handleDelete = async (user: Expert) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${user.expert_name}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      toast.info(`Deleting ${user.expert_name}...`);
      try {
        const res = await deleteExpert(user.expert_id).unwrap();
        if (res.success === true) {
          refetch();
        }
        toast.success(`${user.expert_name} has been deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete expert. Please try again.");
      }
    }
  };

  const columns = [
    {
      header: "#",
      accessor: (expert: Expert) => expert.expert_id.toString(),
      sortable: false,
    },
    {
      header: "Profile Picture",
      accessor: (expert: Expert) => expert.profile_picture?.toString() ?? "",
      sortable: false,
      cell: (user: Expert) => (
        <Image
          width={40}
          height={40}
          src={BASE_URL + "/" + user.profile_picture}
          alt={user.expert_name}
          className='w-10 h-10 rounded-full'
        />
      ),
    },

    {
      header: "Name",
      accessor: (expert: Expert) => expert.expert_name,
      sortable: true,
      cell: (user: Expert) => (
        <UnderlineLink
          href={`/dashboard/experts/${user.expert_id}/view`}
          className='text-sm text-main-brown border-none'>
          {user.expert_name}
        </UnderlineLink>
      ),
    },
    {
      header: "Designation",
      accessor: (expert: Expert) => expert.designation ?? "",
      sortable: true,
      cell: (user: Expert) => (
        <span className='px-2 py-1 rounded-full text-xs max-w-sm text-wrap font-medium line-clamp-3'>
          {user.designation}
        </span>
      ),
    },
    {
      header: "Type",
      accessor: (expert: Expert) => expert.type ?? "",
      sortable: true,
      cell: (user: Expert) => (
        <span className='px-2 py-1 rounded-full text-xs max-w-sm text-wrap font-medium line-clamp-3'>
          {user.type}
        </span>
      ),
    },
    {
      header: "About",
      accessor: (expert: Expert) => expert.about ?? "",
      sortable: true,
      cell: (user: Expert) => (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs max-w-sm text-wrap font-medium line-clamp-3"
          )}>
          {typeof window === "undefined"
            ? "Loading..."
            : new DOMParser().parseFromString(user.about, "text/html")
                .documentElement.textContent}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (expert: Expert) => expert.expert_id.toString(),
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

  if (isLoading) return <p>Loading experts...</p>;
  if (error) return <p>Error loading experts</p>;

  logger(users, "users");
  return (
    <div className='max-w-7xl mx-auto'>
      <Table
        data={users.map((user) => ({ ...user, id: user.expert_id }))}
        columns={columns}
        headerButton={{
          title: "Add Expert",
          link: "/dashboard/experts/add",
        }}
        onRowClick={handleRowClick}
        selectable={false}
        onSelectionChange={setSelectedExperts}
        itemsPerPage={10}
      />
    </div>
  );
}
