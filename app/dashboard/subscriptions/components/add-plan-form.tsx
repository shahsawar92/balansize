"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Spinner from "@/components/spinner/spinner";

import {
  useAddPlanMutation,
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "@/redux/api/plan-api";

import Button from "../../../../components/buttons/Button";
import Input from "../../../../components/input/Input";
import Label from "../../../../components/text/Label";

import { Plan } from "@/types/plans";
import { TextEditor } from "@/components/editor/Editor";
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
  const [planName, setPlanName] = useState(initialData?.plan_name || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [duration, setDuration] = useState(initialData?.plan_duration || "");
  const [price, setPrice] = useState(initialData?.plan_price || "");
  const [androidProductId, setAndroidProductId] = useState(
    initialData?.andriod_product_id || ""
  );
  const [iosProductId, setIosProductId] = useState(
    initialData?.ios_product_id || ""
  );

  useEffect(() => {
    if (initialData) {
      setPlanName(initialData.plan_name || "");
      setContent(initialData.content || "");
      setDuration(initialData.plan_duration || "");
      setPrice(initialData.plan_price || "");
      setAndroidProductId(initialData.andriod_product_id || "");
      setIosProductId(initialData.ios_product_id || "");

      // Safely set ID if initialData has one
      if ("id" in initialData) {
        setPlanId((initialData as any).id); // 👈 type cast to access id
      }
    } else {
      setPlanId(null); // new plan
      setPlanName("");
      setContent("");
      setDuration("");
      setPrice("");
      setAndroidProductId("");
      setIosProductId("");
    }
  }, [initialData]);

  const resetForm = () => {
    setPlanName("");
    setContent("");
    setDuration("");
    setPrice("");
    setAndroidProductId("");
    setIosProductId("");
    setPlanId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const plan: Plan = {
      plan_name: planName,
      content,
      plan_duration: duration,
      plan_price: price,
      andriod_product_id: androidProductId,
      ios_product_id: iosProductId,
    };

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
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder='Enter plan name'
              required
            />
          </div>

          <div>
            <Label htmlFor='content'>Content</Label>

            <TextEditor
              initialValue={content}
              onChange={(value) => setContent(value)}
              placeholder='Enter Content'
              height={300}
            />
          </div>

          <div>
            <Label htmlFor='plan_duration'>Plan Duration</Label>
            <Input
              id='plan_duration'
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder='e.g. month'
              required
            />
          </div>

          <div>
            <Label htmlFor='plan_price'>Plan Price</Label>
            <Input
              id='plan_price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='$15'
              required
            />
          </div>

          <div>
            <Label htmlFor='android_product_id'>Android Product ID</Label>
            <Input
              id='android_product_id'
              value={androidProductId}
              onChange={(e) => setAndroidProductId(e.target.value)}
              placeholder='Enter Android product ID'
            />
          </div>

          <div>
            <Label htmlFor='ios_product_id'>iOS Product ID</Label>
            <Input
              id='ios_product_id'
              value={iosProductId}
              onChange={(e) => setIosProductId(e.target.value)}
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
