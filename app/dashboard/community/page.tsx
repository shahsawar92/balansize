"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import SanitizeHtmlWidget from "@/components/html-parser/sanitieHtml";
import Table from "@/components/table/Table";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";
import {
  useDeleteCommunityMutation,
  useGetCommunitiesQuery,
} from "@/redux/api/community-api";

import { Community } from "@/types/community";

export default function CommunitiesPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const { data, error, isLoading, refetch } = useGetCommunitiesQuery();
  const [deleteCommunity] = useDeleteCommunityMutation();
  logger(data, "data");
  useEffect(() => {
    if (data?.result?.length) {
      setCommunities(data?.result);
    }
  }, [data]);

  const handleDelete = async (community: Community) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the community.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      toast.info("Deleting community...");
      try {
        await deleteCommunity(community.id).unwrap();
        refetch();
        toast.success("Community deleted!");
      } catch {
        toast.error("Failed to delete. Try again.");
      }
    }
  };

  const columns = [
    {
      header: "#",
      accessor: (c: Community) => c.id.toString(),
    },
    {
      header: "Image",
      accessor: (c: Community) => c.logo.toString(),
      cell: (c: Community) => (
        <Image
          width={40}
          height={40}
          src={BASE_URL + "/" + c.logo}
          alt='Community image'
          className='w-10 h-10 rounded-full object-cover'
        />
      ),
    },
    {
      header: "Name",
      accessor: (c: Community) => c.link,
      cell: (c: Community) => (
        <Text variant='main' className='text-sm text-main-brown'>
          {c.link}
        </Text>
      ),
    },
    {
      header: "description",
      accessor: (c: Community) => c.description,
      cell: (c: Community) => (
        <Text
          variant='main'
          className='text-sm text-main-brown max-w-sm text-center'>
          {SanitizeHtmlWidget({ htmlContent: c.description })}
        </Text>
      ),
    },
    {
      header: "Actions",
      accessor: () => "",
      cell: (c: Community) => (
        <div className='flex gap-2'>
          <button
            onClick={() => router.push(`/dashboard/community/${c.id}/edit`)}
            className='p-2 hover:bg-secondary-500 rounded-lg flex gap-2 items-center'>
            <Edit className='w-4 h-4 text-main-brown' /> Edit
          </button>
          <button
            onClick={() => handleDelete(c)}
            className='p-2 hover:bg-secondary-500 rounded-lg flex gap-2 items-center'>
            <TrashIcon className='w-4 h-4 text-main-brown' /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className='max-w-7xl mx-auto'>
      <Table
        data={communities}
        columns={columns}
        isSearchable={false}
        headerButton={{
          title: "Add Community",
          link: "/dashboard/community/add",
        }}
        selectable={false}
        itemsPerPage={10}
      />
    </div>
  );
}
