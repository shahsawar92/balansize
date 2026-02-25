import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";
import {
  NotificationResponse,
  SingleNotificationResponse,
} from "@/types/notifications";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  tagTypes: ["Notification"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectCurrentToken(getState() as RootState);
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    addNotification: builder.mutation<NotificationResponse, FormData>({
      query: (credentials) => {
        logger(API_URL, "API_URL");
        return {
          url: "/notifications",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getNotifications: builder.query<NotificationResponse, void>({
      query: () => {
        return {
          url: "/notifications",
          method: "GET",
        };
      },
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),
    getSingleNotification: builder.query<SingleNotificationResponse, string>({
      query: (id) => {
        return {
          url: `/notifications/${id}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, id) => [{ type: "Notification", id }],
    }),
    updateNotification: builder.mutation<
      NotificationResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/notifications/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Notification", id: String(id) },
        { type: "Notification", id: "LIST" },
      ],
    }),
    deleteNotification: builder.mutation<NotificationResponse, number>({
      query: (id) => {
        return {
          url: `/notifications/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

// Export hooks
export const {
  useAddNotificationMutation,
  useGetNotificationsQuery,
  useGetSingleNotificationQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;
export default notificationApi;
