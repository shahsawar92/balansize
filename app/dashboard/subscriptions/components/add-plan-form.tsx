"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { TextEditor } from "@/components/editor/Editor";
import Spinner from "@/components/spinner/spinner";
import { Switch } from "@/components/switch/switch";
import Text from "@/components/text/Text";

import {
  useAddPlanMutation,
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "@/redux/api/plan-api";

import Button from "../../../../components/buttons/Button";
import Input from "../../../../components/input/Input";
import Label from "../../../../components/text/Label";

import { Plan } from "@/types/plans";
type AddPlanFormProps = {
  initialData?: Plan | null;
  onCancel?: () => void;
};

export const AddPlanForm: React.FC<AddPlanFormProps> = ({
  initialData,
  onCancel,
}) => {
  const [addPlan, { isLoading, error }] = useAddPlanMutation();
  const { refetch } = useGetPlansQuery();

  const [planId, setPlanId] = useState<number | null>(null);
  const [update] = useUpdatePlanMutation();
  const [plan, setPlan] = useState<Plan>({
    plan_name: initialData?.plan_name || "",
    content: initialData?.content || "",
    plan_duration: initialData?.plan_duration || "",
    plan_price: initialData?.plan_price || "",
    is_active: initialData?.is_active || true,
    trial: initialData?.trial || 0,
    andriod_product_id: initialData?.andriod_product_id || "",
    ios_product_id: initialData?.ios_product_id || "",
  });

  useEffect(() => {
    if (initialData) {
      setPlan({
        plan_name: initialData.plan_name,
        content: initialData.content,
        plan_duration: initialData.plan_duration,
        plan_price: initialData.plan_price,
        is_active: initialData.is_active,
        trial: initialData.trial,
        andriod_product_id: initialData.andriod_product_id,
        ios_product_id: initialData.ios_product_id,
      });

      // Safely set ID if initialData has one
      if ("id" in initialData && typeof initialData.id === "number") {
        setPlanId(initialData.id);
      }
    }
  }, [initialData]);

  const resetForm = () => {
    setPlan({
      plan_name: "",
      content: "",
      plan_duration: "",
      plan_price: "",
      is_active: true,
      trial: 0,
      andriod_product_id: "",
      ios_product_id: "",
    });
    setPlanId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (planId !== null) {
        await update({ id: planId, ...plan }).unwrap();
        refetch();
        resetForm();
        toast.success("Plan updated successfully!");
      } else {
        // Add case
        await addPlan(plan).unwrap();
        refetch();
        resetForm();
        toast.success("Plan added successfully!");
      }

      if (onCancel) onCancel();
    } catch (err) {
      toast.error("Failed to submit plan.");
      console.error("Plan submission error:", err);
    }
  };

  {
    isLoading && <p className='text-sm text-gray-500'>Submitting...</p>;
  }
  {
    error && <p className='text-sm text-red-500'>Error: Failed to submit</p>;
  }

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Plan" : "Add Plan"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='plan_name'>Plan Name</Label>
            <Input
              id='plan_name'
              value={plan.plan_name}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, plan_name: e.target.value }))
              }
              placeholder='Enter plan name'
              required
            />
          </div>

          <div>
            <Label htmlFor='content'>Content</Label>

            <TextEditor
              initialValue={plan.content}
              onChange={(value) =>
                setPlan((prev) => ({ ...prev, content: value }))
              }
              placeholder='Enter Content'
              height={300}
            />
          </div>

          <div>
            <Label htmlFor='plan_duration'>Plan Duration</Label>
            <Input
              id='plan_duration'
              value={plan.plan_duration}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, plan_duration: e.target.value }))
              }
              placeholder='e.g. month'
              required
            />
          </div>

          <div>
            <Label htmlFor='plan_price'>Plan Price</Label>
            <Input
              id='plan_price'
              value={plan.plan_price}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, plan_price: e.target.value }))
              }
              placeholder='$15'
              required
            />
          </div>
          <div className='flex justify-between items-center gap-4'>
            <div className='flex items-center gap-4 bg-secondary-300 p-2 rounded shadow bg-opacity-50'>
              <Switch
                checked={plan.is_active}
                onCheckedChange={(checked) =>
                  setPlan((prev) => ({
                    ...prev,
                    is_active: checked,
                  }))
                }
              />

              <Text variant='secondary' size='sm'>
                Is Active
              </Text>
            </div>
          </div>
          <div>
            <Label htmlFor='plan_price'>Plan Trial</Label>
            <Input
              id='plan_price'
              value={plan.trial}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, trial: Number(e.target.value) }))
              }
              placeholder='07'
              required
              type='number'
            />
          </div>

          <div>
            <Label htmlFor='android_product_id'>Android Product ID</Label>
            <Input
              id='android_product_id'
              value={plan.andriod_product_id}
              onChange={(e) =>
                setPlan((prev) => ({
                  ...prev,
                  andriod_product_id: e.target.value,
                }))
              }
              placeholder='Enter Android product ID'
            />
          </div>

          <div>
            <Label htmlFor='ios_product_id'>iOS Product ID</Label>
            <Input
              id='ios_product_id'
              value={plan.ios_product_id}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, ios_product_id: e.target.value }))
              }
              placeholder='Enter iOS product ID'
            />
          </div>

          <div className='flex justify-end pt-4 gap-2'>
            {onCancel && (
              <Button type='button' variant='light' onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <Spinner />
                  {initialData ? "Updating..." : "Saving..."}
                </span>
              ) : initialData ? (
                "Update Plan"
              ) : (
                "Save Plan"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
