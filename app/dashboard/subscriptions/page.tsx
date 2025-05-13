"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import { Card } from "@/components/cards/card";
import Text from "@/components/text/Text";

import { AddPlanForm } from "@/app/dashboard/subscriptions/components/add-plan-form";
import {
  useAddPlanMutation,
  useDeletePlanMutation,
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "@/redux/api/plan-api";

import { Plan } from "@/types/plans";

export default function Page() {
  const { data, isLoading, error, refetch } = useGetPlansQuery();
  const plans = data?.result || [];

  const [addPlan] = useAddPlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleDeletePlan = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await deletePlan(id).unwrap();
        refetch();
        toast.success("Plan deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete plan.");
        refetch();
        logger(err, "Delete Plan Error");
      }
    }
  };

  const renderPlans = () =>
    plans.map((plan) => (
      <Card key={plan.id} className='p-4 flex flex-col justify-between'>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold text-primary'>
            {plan.plan_name}
          </h3>
          <p
            className='text-sm text-muted'
            dangerouslySetInnerHTML={{ __html: plan.content }}
          />

          <p className='text-xl font-bold text-accent'>
            ${plan.plan_price} / {plan.plan_duration}
          </p>
          <div className='text-xs text-gray-500'>
            <p>Android ID: {plan.andriod_product_id || "N/A"}</p>
            <p>iOS ID: {plan.ios_product_id || "N/A"}</p>
          </div>
        </div>
        <div className='flex justify-end gap-3 mt-4'>
          <button
            onClick={() => setEditingPlan(plan)}
            className='text-blue-600 text-sm underline hover:opacity-80 transition'>
            Edit
          </button>
          <button
            onClick={() => handleDeletePlan(plan.id)}
            className='text-red-600 text-sm underline hover:opacity-80 transition'>
            Delete
          </button>
        </div>
      </Card>
    ));

  return (
    <div className='mx-auto py-8 px-5 rounded-2xl space-y-8 bg-secondary-100'>
      <div className='grid gap-6'>
        <div>
          <Text
            variant='main'
            size='lg'
            weight='bold'
            tagName='h2'
            classNames='mb-2'>
            Monthly
          </Text>
          <div className='grid md:grid-cols-3 2xl:grid-cols-4 gap-6'>
            {isLoading ? <p>Loading...</p> : renderPlans()}
            {error && <p className='text-red-500'>Failed to load plans.</p>}
          </div>
        </div>
      </div>

      <AddPlanForm
        initialData={editingPlan}
        onCancel={() => setEditingPlan(null)}
      />
    </div>
  );
}
