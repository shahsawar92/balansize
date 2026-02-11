"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Select, { MultiValue } from "react-select";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import CustomSelect from "@/components/select/Select";
import { Switch } from "@/components/switch/switch";

import {
  useAddNotificationMutation,
  useGetNotificationsQuery,
} from "@/redux/api/notifications-api";
import { useGetUsersQuery } from "@/redux/api/users-api";
import logger from "@/lib/logger";

export default function AddOnboardingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isTrue, setIsTrue] = useState(true);
  const [icon, setIcon] = useState<File | null>(null);
  const [sendVia, setSendVia] = useState<{
    value: "PUSH" | "EMAIL" | "BOTH";
    label: string;
  }>({ value: "PUSH", label: "Push Notification" });
  const [sendToAll, setSendToAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleType, setScheduleType] = useState<"ONCE" | "DAILY">("ONCE");

  const [addNotification, { isLoading }] = useAddNotificationMutation();
  const { refetch } = useGetNotificationsQuery();
  const { data: usersData } = useGetUsersQuery();

  const sendViaOptions: { value: "PUSH" | "EMAIL" | "BOTH"; label: string }[] =
    [
      { value: "PUSH", label: "Push Notification" },
      { value: "EMAIL", label: "Email" },
      { value: "BOTH", label: "Both" },
    ];

  const scheduleTypeOptions = [
    { value: "ONCE", label: "Once" },
    { value: "DAILY", label: "Daily" },
  ];

  const userOptions =
    usersData?.result?.map((user) => ({
      value: String(user.id),
      label: `${user.first_name} ${user.last_name} (${user.email})`,
    })) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message || !icon) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("icon", icon);
    formData.append("isTrue", isTrue ? "1" : "0");
    formData.append("sendVia", sendVia.value);
    formData.append("sendToAll", sendToAll ? "1" : "0");

    if (!sendToAll && selectedUsers.length > 0) {
      const userIds = selectedUsers.map((user) => Number(user.value));
      formData.append("userIds", JSON.stringify(userIds));
    } else if (!sendToAll && selectedUsers.length === 0) {
      toast.error("Please select at least one user or enable 'Send to All'.");
      return;
    }

    if (scheduledAt) {
      formData.append("scheduledAt", new Date(scheduledAt).toISOString());
      formData.append("scheduleType", scheduleType);
    }
    console.log("Form Data:", {
      title,
      message,
      isTrue,
      sendVia: sendVia.value,
      sendToAll,
      selectedUsers: selectedUsers.map((user) => user.value),
      scheduledAt,
      scheduleType,
    });
    try {
      const response = await addNotification(formData).unwrap();
      logger(response, "Add Notification Response:");
      if (response.success) {
        toast.success("Notification added successfully!");
        refetch();
        router.push("/dashboard/notifications");
      } else {
        toast.error("Failed to add Notification.");
      }
    } catch (error) {
      logger(error, "Error adding Notification:");
      toast.error("Error adding Notification. Please try again.");
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Add Notification</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block font-medium mb-1'>Title</label>
          <Input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter title'
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='w-full border px-4 py-2 rounded-lg'
            placeholder='Enter message'
            rows={4}
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Icon</label>
          <ImageUploader
            imageUrl='/images/placeholder.png'
            onFileChange={(file) => setIcon(file)}
            buttonText='Upload Icon'
          />
        </div>
        <div className='w-full mt-0'>
          <label className='block font-medium mb-1'>Send Via</label>
          <Select
            options={sendViaOptions}
            value={sendVia}
            onChange={(value) => value && setSendVia(value)}
            placeholder='Select send method'
            className='w-full z-10'
            classNamePrefix='react-select'
          />
        </div>

        <div className='flex items-center gap-3'>
          <Switch checked={sendToAll} onCheckedChange={setSendToAll} />
          <label className='text-sm font-medium'>Send to All Users</label>
        </div>

        {!sendToAll && (
          <div className='w-full'>
            <label className='block font-medium mb-1'>Select Users</label>
            <Select
              isMulti
              options={userOptions}
              value={selectedUsers}
              onChange={(value) => setSelectedUsers(value)}
              placeholder='Select users'
              className='w-full z-10'
              classNamePrefix='react-select'
              isDisabled={userOptions.length === 0}
              noOptionsMessage={() => "No users available"}
            />
          </div>
        )}

        <div>
          <label className='block font-medium mb-1'>
            Schedule At (Optional)
          </label>
          <Input
            type='datetime-local'
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            placeholder='Select date and time'
          />
        </div>

        {scheduledAt && (
          <div onClick={(e) => e.stopPropagation()}>
            <CustomSelect
              label='Schedule Type'
              options={scheduleTypeOptions}
              value={scheduleType}
              onChange={(value) => setScheduleType(value as "ONCE" | "DAILY")}
              placeholder='Select schedule type'
            />
          </div>
        )}

        <div className='flex items-center gap-3'>
          <Switch checked={isTrue} onCheckedChange={setIsTrue} />
          <label className='text-sm font-medium'>Active</label>
        </div>

        <Button type='submit' variant='brown' disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Notification"}
        </Button>
      </form>
    </div>
  );
}
