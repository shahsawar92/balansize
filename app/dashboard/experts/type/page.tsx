"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Table from "@/components/table/Table";

import {
  useDeleteExpertTypeMutation,
  useGetExpertTypesQuery,
} from "@/redux/api/expert-api";

import { Expert, ExpertType } from "@/types/experts";

export default function ExpertsPage() {
  const [selectedExperts, setSelectedExperts] = useState<ExpertType[]>([]);
  const [users, setExperts] = useState<ExpertType[]>([]);
  logger(users, "Experts");
  const router = useRouter();
  const { data: experts, error, isLoading, refetch } = useGetExpertTypesQuery();
  const [deleteExpert] = useDeleteExpertTypeMutation();

  useEffect(() => {
    if (experts) {
      setExperts(experts.result);
    }
  }, [experts]);

  logger(experts, "experts types");

  const handleDelete = async (user: ExpertType) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${user.type}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      toast.info(`Deleting ${user.type}...`);
      try {
        const res = await deleteExpert(user.id).unwrap();
        if (res.success === true) {
          refetch();
        }
        toast.success(`${user.type} has been deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete expert type. Please try again.");
      }
    }
  };

  const columns = [
    {
      header: "#",
      accessor: (expert: ExpertType) => expert.id.toString(),
      sortable: false,
    },

    {
      header: "Type",
      accessor: (expert: ExpertType) => expert.type ?? "",
      sortable: true,
      cell: (user: ExpertType) => (
        <span className='px-2 py-1 rounded-full text-xs max-w-sm text-wrap font-medium line-clamp-3'>
          {user.type}
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: (expert: ExpertType) => expert.id.toString(),
      sortable: false,
      cell: (user: ExpertType) => (
        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user as unknown as ExpertType);
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
        data={users.map((user) => ({ ...user, id: user.id }))}
        columns={columns}
        headerButton={{
          title: "Add Expert Type",
          link: "/dashboard/experts/type/add",
        }}
        selectable={false}
        isSearchable={false}
        onSelectionChange={setSelectedExperts}
        itemsPerPage={10}
      />
    </div>
  );
}
