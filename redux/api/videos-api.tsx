import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import { SingleVideoResponse, VideoResponse } from "@/types/videos";

export const videosApi = createApi({
  reducerPath: "videosApi",
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
    addVideo: builder.mutation<VideoResponse, FormData>({
      query: (credentials) => {
        logger(API_URL, "API_URL");
        return {
          url: "/videos",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getVideos: builder.query<VideoResponse, void>({
      query: () => {
        return {
          url: "/videos",
          method: "GET",
        };
      },
    }),
    getVideo: builder.query<SingleVideoResponse, string>({
      query: (id) => {
        return {
          url: `/videos/${id}`,
          method: "GET",
        };
      },
    }),
    updateVideo: builder.mutation<
      VideoResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/videos/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteVideo: builder.mutation<VideoResponse, number>({
      query: (id) => {
        return {
          url: `/videos/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useAddVideoMutation,
  useGetVideosQuery,
  useGetVideoQuery,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = videosApi;
export default videosApi;
