"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Table from "@/components/table/Table";
import Text from "@/components/text/Text";

import { BASE_URL } from "@/constant/env";

import { OnboardingPartner } from "@/types/onboarding";
import {
  useDeleteOnboardingPartnerMutation,
  useGetOnboardingPartnersQuery,
} from "@/redux/api/onboarding-api";
import { Edit } from "lucide-react";

export default function PartnersPage() {
  const [selectedPartners, setSelectedPartners] = useState<OnboardingPartner[]>(
    []
  );
  const [partners, setPartners] = useState<OnboardingPartner[]>([]);
  logger(partners, "Partners");
  const router = useRouter();
  const {
    data: partnersData,
    error,
    isLoading,
    refetch,
  } = useGetOnboardingPartnersQuery();
  const [deletePartner] = useDeleteOnboardingPartnerMutation();
  logger(partnersData, "partnersData");
  useEffect(() => {
    if (partnersData && Array.isArray(partnersData)) {
      setPartners(partnersData);
    }
  }, [partnersData]);

  const handleDelete = async (partner: OnboardingPartner) => {
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
      accessor: (partner: OnboardingPartner) => partner.id.toString(),
      sortable: false,
    },
    {
      header: "Image",
      accessor: (partner: OnboardingPartner) => partner.image,
      sortable: false,
      cell: (partner: OnboardingPartner) => (
        <div className='flex items-center gap-3 justify-center'>
          <Image
            width={40}
            height={40}
            src={BASE_URL + "/" + partner.image}
            alt='Partner image'
            className='w-10 h-10 rounded-full'
          />
        </div>
      ),
    },
    {
      header: "Title",
      accessor: (partner: OnboardingPartner) => partner.title,
      sortable: true,
      cell: (partner: OnboardingPartner) => (
        <div className='flex items-center gap-3 justify-center'>
          <Text variant='main' className='text-sm text-main-brown border-none'>
            {partner.title}
          </Text>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: (partner: OnboardingPartner) => partner.description,
      sortable: true,
      cell: (partner: OnboardingPartner) => (
        <div className='flex items-center gap-3 justify-center'>
          <Text
            variant='main'
            className='text-sm text-main-brown border-none w-40 line-clamp-2'>
            {partner.description}
          </Text>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (partner: OnboardingPartner) =>
        partner.isActive ? "Active" : "Inactive",
      sortable: true,
      cell: (partner: OnboardingPartner) => (
        <div className='flex items-center gap-3 justify-center'>
          <Text
            variant='main'
            className='text-sm text-main-brown border-none w-40 line-clamp-2'>
            {partner.isActive ? "Active" : "Inactive"}
          </Text>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (partner: OnboardingPartner) => partner.id.toString(),
      sortable: false,
      cell: (partner: OnboardingPartner) => (
        <div className='flex items-center gap-3 justify-center'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(partner);
            }}
            className='p-2 hover:bg-secondary-500 flex items-center gap-2 rounded-lg transition-colors'>
            <TrashIcon className='w-5 h-5 text-main-brown' /> Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/onboarding/${partner.id}/edit`);
            }}
            className='p-2 hover:bg-secondary-500 flex items-center gap-2 rounded-lg transition-colors'>
            <Edit className='w-5 h-5 text-main-brown' /> Edit
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
          link: "/dashboard/onboarding/add",
        }}
        onRowClick={(partner) => logger(partner, "click")}
        selectable={false}
        onSelectionChange={setSelectedPartners}
        itemsPerPage={10}
      />
    </div>
  );
}
