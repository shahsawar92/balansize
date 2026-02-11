"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/buttons/Button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Input from "@/components/input/Input";
import CustomSelect from "@/components/select/Select";
import { Switch } from "@/components/switch/switch";

import { BASE_URL } from "@/constant/env";
import {
  useGetNotificationsQuery,
  useGetSingleNotificationQuery,
  useUpdateNotificationMutation,
} from "@/redux/api/notifications-api";
import { useGetUsersQuery } from "@/redux/api/users-api";

export default function EditOnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading: isFetching } = useGetSingleNotificationQuery(id);
  const [updateNotification, { isLoading: isUpdating }] =
    useUpdateNotificationMutation();
  const { refetch } = useGetNotificationsQuery();
  const { data: usersData } = useGetUsersQuery();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [sendVia, setSendVia] = useState<"PUSH" | "EMAIL" | "BOTH">("PUSH");
  const [sendToAll, setSendToAll] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleType, setScheduleType] = useState<"ONCE" | "DAILY">("ONCE");

  const sendViaOptions = [
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

  useEffect(() => {
    if (data?.result) {
      const {
        title,
        message,
        isActive,
        icon,
        sendVia,
        sendToAll,
        userIds,
        scheduledAt,
        scheduleType,
      } = data.result;
      setTitle(String(title));
      setDescription(message);
      setIsActive(Boolean(isActive));
      setExistingImage(icon);

      if (sendVia) setSendVia(sendVia);
      if (sendToAll !== undefined) setSendToAll(sendToAll);
      if (userIds) setSelectedUserIds(userIds);
      if (scheduledAt) {
        const date = new Date(scheduledAt);
        const formattedDate = date.toISOString().slice(0, 16);
        setScheduledAt(formattedDate);
      }
      if (scheduleType) setScheduleType(scheduleType);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!sendToAll && selectedUserIds.length === 0) {
      toast.error("Please select at least one user or enable 'Send to All'.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", description);
    formData.append("isActive", String(isActive));
    formData.append("sendVia", sendVia);
    formData.append("sendToAll", sendToAll ? "1" : "0");

    if (!sendToAll && selectedUserIds.length > 0) {
      formData.append("userIds", JSON.stringify(selectedUserIds));
    }

    if (scheduledAt) {
      formData.append("scheduledAt", new Date(scheduledAt).toISOString());
      formData.append("scheduleType", scheduleType);
    }

    if (imageFile) {
      formData.append("icon", imageFile);
    }

    try {
      const response = await updateNotification({
        id: parseInt(id),
        data: formData,
      }).unwrap();
      if (response.success) {
        toast.success("Notification updated successfully!");
        refetch();
        router.push("/dashboard/notifications");
      } else {
        toast.error("Failed to update Notification.");
      }
    } catch (error) {
      toast.error("Error updating Notification. Please try again.");
    }
  };

  if (isFetching) {
    return <p className='text-center mt-10'>Loading Notification data...</p>;
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Edit Notification</h2>
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full border px-4 py-2 rounded-lg'
            placeholder='Enter message'
            rows={4}
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Icon</label>
          <ImageUploader
            imageUrl={
              imageFile
                ? URL.createObjectURL(imageFile)
                : BASE_URL + "/" + existingImage || "/images/placeholder.png"
            }
            onFileChange={(file) => setImageFile(file)}
            buttonText='Upload New Icon'
          />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <CustomSelect
            label='Send Via'
            options={sendViaOptions}
            value={sendVia}
            onChange={(value) => setSendVia(value as "PUSH" | "EMAIL" | "BOTH")}
            placeholder='Select send method'
          />
        </div>

        <div className='flex items-center gap-3'>
          <Switch checked={sendToAll} onCheckedChange={setSendToAll} />
          <label className='text-sm font-medium'>Send to All Users</label>
        </div>

        {!sendToAll && (
          <div>
            <label className='block font-medium mb-1'>Select Users</label>
            <div className='border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2'>
              {userOptions.length > 0 ? (
                userOptions.map((user) => (
                  <div key={user.value} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      id={`user-${user.value}`}
                      checked={selectedUserIds.includes(Number(user.value))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUserIds([
                            ...selectedUserIds,
                            Number(user.value),
                          ]);
                        } else {
                          setSelectedUserIds(
                            selectedUserIds.filter(
                              (id) => id !== Number(user.value),
                            ),
                          );
                        }
                      }}
                      className='w-4 h-4'
                    />
                    <label
                      htmlFor={`user-${user.value}`}
                      className='text-sm cursor-pointer'>
                      {user.label}
                    </label>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-500'>No users available</p>
              )}
            </div>
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
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <label className='text-sm font-medium'>Active</label>
        </div>

        <Button type='submit' variant='brown' disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Notification"}
        </Button>
      </form>
    </div>
  );
}
