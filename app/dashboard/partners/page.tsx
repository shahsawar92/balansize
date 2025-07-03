"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import UnderlineLink from "@/components/links/UnderlineLink";
import Table from "@/components/table/Table";

import { BASE_URL } from "@/constant/env";
import {
  useDeletePartnerMutation,
  useGetPartnersQuery,
} from "@/redux/api/partners-api";

import { Partner } from "@/types/partners";

export default function PartnersPage() {
  const [selectedPartners, setSelectedPartners] = useState<Partner[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  logger(partners, "Partners");
  const router = useRouter();
  const {
    data: partnersData,
    error,
    isLoading,
    refetch,
  } = useGetPartnersQuery();
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
      accessor: (partner: Partner) => partner.id.toString(),
      sortable: false,
    },
    {
      header: "Logo",
      accessor: (partner: Partner) => partner.logo,
      sortable: false,
      cell: (partner: Partner) => (
        <div className='flex items-center gap-3 justify-center'>
          <Image
            width={40}
            height={40}
            src={BASE_URL + "/" + partner.logo}
            alt='Partner Logo'
            className='w-10 h-10 rounded-full'
          />
        </div>
      ),
    },

    {
      header: "Website Link",
      accessor: (partner: Partner) => partner.link,
      sortable: true,
      cell: (partner: Partner) => (
        <div className='flex items-center gap-3 justify-center'>
          <UnderlineLink
            href={partner.link ?? "#"}
            target='_blank'
            className='text-sm text-blue-400  border-none max-w-xs overflow-hidden text-ellipsis'>
            link
          </UnderlineLink>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: (partner: Partner) => partner.description,
      sortable: true,
      cell: (partner: Partner) => (
        <div className='flex items-center gap-3 text-center mx-auto justify-center w-80 text-wrap overflow-hidden'>
          <p
            className='text-sm text-main-brown line-clamp-2 px-3'
            dangerouslySetInnerHTML={{ __html: partner.description }}></p>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (partner: Partner) => partner.id.toString(),
      sortable: false,
      cell: (partner: Partner) => (
        <div className='flex items-center gap-3 justify-center'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/partners/${partner.id}/edit`);
            }}
            className='p-2 hover:bg-secondary-500 flex items-center gap-2 rounded-lg transition-colors'>
            <Edit className='w-5 h-5 text-main-brown' /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(partner);
            }}
            className='p-2 hover:bg-secondary-500 flex items-center gap-2 rounded-lg transition-colors'>
            <TrashIcon className='w-5 h-5 text-main-brown' /> Delete
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading partners...</p>;
  if (error) return <p>Error loading partners</p>;

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
        onSelectionChange={setSelectedPartners}
        itemsPerPage={10}
      />
    </div>
  );
}
