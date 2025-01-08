"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Button from "../../../../components/buttons/Button";
import Input from "../../../../components/input/Input";
import Label from "../../../../components/text/Label";
import { Switch } from "@/components/switch/switch";
import { Feature, Plan } from "@/types/plans";

type AddPlanFormProps = {
  onSubmit: (plan: Omit<Plan, "id">) => void;
};

export const AddPlanForm: React.FC<AddPlanFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [trial, setTrial] = useState("");
  const [isYearly, setIsYearly] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([{ id: "1", text: "" }]);

  const handleAddFeature = () => {
    const newFeature = { id: Date.now().toString(), text: "" };
    setFeatures((prev) => [...prev, newFeature]);
  };

  const handleRemoveFeature = (id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFeatureChange = (id: string, value: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, text: value } : f))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = {
      title,
      price: parseFloat(price),
      interval: isYearly ? "yearly" : "monthly",
      trial,
      description,
      features: features.filter((f) => f.text.trim() !== ""),
    };
    onSubmit(plan);
  };

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle>Add Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter plan title'
              required
            />
          </div>

          <div>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter plan description'
              required
            />
          </div>

          <div>
            <Label htmlFor='trial'>Trial Period</Label>
            <Input
              id='trial'
              value={trial}
              onChange={(e) => setTrial(e.target.value)}
              placeholder='e.g. 3 days free trial'
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='price'>Price</Label>
            <div className='flex items-center gap-2'>
              <span>Monthly</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span>Yearly</span>
            </div>
          </div>

          <Input
            id='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='0.00'
            type='number'
            required
          />

          <div className='space-y-2'>
            <Label>Features</Label>
            {features.map((feature) => (
              <div key={feature.id} className='flex gap-2'>
                <Input
                  value={feature.text}
                  onChange={(e) =>
                    handleFeatureChange(feature.id, e.target.value)
                  }
                  placeholder='Type feature...'
                />
                <Button
                  type='button'
                  variant='light'
                  sizeOfButton='base'
                  onClick={() => handleRemoveFeature(feature.id)}>
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ))}
            <Button
              type='button'
              variant='light'
              sizeOfButton='base'
              onClick={handleAddFeature}>
              <Plus className='h-4 w-4 mr-2' />
              Add Feature
            </Button>
          </div>

          <div className='flex justify-end pt-4'>
            <Button type='submit'>Save Plan</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
