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
  useDeletePartnerMutation,
  useGetPartnersQuery,
} from "@/redux/api/partners-api";

import { Partner } from "@/types/partners";

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  logger(partners, "Partners");
  const router = useRouter();
  const { data: partnersData, refetch } = useGetPartnersQuery();
  const [deletePartner] = useDeletePartnerMutation();

  useEffect(() => {
    if (partnersData && Array.isArray(partnersData.result)) {
      setPartners(partnersData.result);
    }
  }, [partnersData]);

  const handleDelete = async (partner: Partner) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete this partner. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      toast.info(`Deleting partner...`);
      try {
        const res = await deletePartner(partner.id).unwrap();
        if (res.success === true) {
          refetch();
        }
        toast.success(`Partner has been deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete partner. Please try again.");
      }
    }
  };

  const columns = [
    {
      header: "#",
      accessor: (p: Partner) => p.id.toString(),
    },
    {
      header: "Image",
      accessor: (p: Partner) => p.images?.[0]?.link || "",
      cell: (p: Partner) => {
        const image = p.images?.[0]?.link;
        return image ? (
          <Image
            width={40}
            height={40}
            src={`${BASE_URL}/${image}`}
            alt='Partner image'
            className='w-10 h-10 rounded-full object-cover'
          />
        ) : (
          <span className='text-gray-400 italic text-xs'>No image</span>
        );
      },
    },

    {
      header: "Link",
      accessor: (p: Partner) => p.link,
      cell: (p: Partner) => (
        <Text variant='main' classNames=''>
          <a
            href={p.link}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'>
            Link
          </a>
        </Text>
      ),
    },
    {
      header: "Description",
      accessor: (p: Partner) => p.description,
      cell: (p: Partner) => (
        <Text
          variant='main'
          classNames='max-w-sm line-clamp-2 break-words px-2 text-center mx-auto whitespace-normal overflow-hidden text-ellipsis'>
          {SanitizeHtmlWidget({ htmlContent: p.description })}
        </Text>
      ),
    },
    {
      header: "Actions",
      accessor: () => "",
      cell: (p: Partner) => (
        <div className='flex gap-2'>
          <button
            onClick={() => router.push(`/dashboard/partners/${p.id}/edit`)}
            className='flex gap-2 items-center p-2 hover:bg-secondary-500 rounded-lg'>
            <Edit className='w-4 h-4 text-main-brown' /> Edit
          </button>
          <button
            onClick={() => router.push(`/dashboard/partners/${p.id}/view`)}
            className='flex gap-2 items-center p-2 hover:bg-secondary-500 rounded-lg'>
            👁️ View
          </button>
          <button
            onClick={() => handleDelete(p)}
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
        data={partners}
        columns={columns}
        isSearchable={false}
        headerButton={{
          title: "Add Partner",
          link: "/dashboard/partners/add",
        }}
        onRowClick={(partner) => logger(partner, "click")}
        selectable={false}
        // onSelectionChange={setSelectedPartners}
        itemsPerPage={10}
      />
    </div>
  );
}
