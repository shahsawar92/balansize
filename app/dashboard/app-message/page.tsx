"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Input from "@/components/input/Input";
import Label from "@/components/text/Label";

import {
  useGetHomeMessageQuery,
  useUpdateHomeMessageMutation,
} from "@/redux/api/app-message-api";

function Message() {
  const { data, isLoading, isError } = useGetHomeMessageQuery();
  const [updateMessage, { isLoading: isUpdating }] =
    useUpdateHomeMessageMutation();

  const [message, setMessage] = useState("");
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    if (data?.result) {
      setMessage(data.result.message);
      setId(data.result.id);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Message ID not found.");
      return;
    }

    try {
      const res = await updateMessage({ id, message }).unwrap();
      toast.success(res.message || "Message updated successfully");
      logger("Updated message:", res.result.message);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update message");
      logger("Update failed", err);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load message</p>;

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle>App Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='title'>Message</Label>
            <Input
              id='title'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Enter message'
              required
            />
          </div>

          <div className='flex justify-end pt-4'>
            <Button type='submit' variant='brown' disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Change Message"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default Message;
