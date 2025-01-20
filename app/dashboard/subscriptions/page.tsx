"use client";

import { useState } from "react";

import logger from "@/lib/logger";

import initialPlans from "@/data/mock-plans";

import { AddPlanForm } from "@/app/dashboard/subscriptions/components/add-plan-form";

import PlanCard from "./components/plan-card";

import { Plan } from "@/types/plans";
import Text from "@/components/text/Text";

export default function Page() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  const handleAddPlan = (newPlan: Omit<Plan, "id">) => {
    const plan: Plan = {
      ...newPlan,
      id: Date.now().toString(),
    };
    setPlans([...plans, plan]);
  };

  const handleEditPlan = (plan: Plan) => {
    // Implement edit functionality
    logger(plan, "plan");
  };

  const handleDeletePlan = (id: string) => {
    logger(id, "id");
  };

  const monthlyPlans = plans.filter((plan) => plan.interval === "monthly");
  const yearlyPlans = plans.filter((plan) => plan.interval === "yearly");

  return (
    <div className='container mx-auto py-8 px-5 rounded-2xl space-y-8 bg-secondary-100'>
      <div className='grid gap-6 '>
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
            {monthlyPlans.map((plan) => (
              <PlanCard
                interval={plan.interval}
                key={plan.id}
                id={plan.id}
                title={plan.title}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                trail={plan.trail}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-lg font-medium mb-4'>Yearly</h2>
          <div className='grid md:grid-cols-3 2xl:grid-cols-4 gap-6'>
            {yearlyPlans.map((plan) => (
              <PlanCard
                interval={plan.interval}
                key={plan.id}
                id={plan.id}
                title={plan.title}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                trail={plan.trail}
              />
            ))}
          </div>
        </div>
      </div>

      <AddPlanForm onSubmit={handleAddPlan} />
    </div>
  );
}
