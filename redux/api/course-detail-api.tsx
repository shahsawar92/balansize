import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  CourseById,
  CourseVideosResponse,
  DeleteCourseVideoResponse,
  SingleCourseVideoResponse,
  UpdateCourseVideoRequest,
} from "@/types/course-details";

export const courseDetailsApi = createApi({
  reducerPath: "courseDetailsApi",
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
    // Fetch all videos for a specific course
    getAllVideos: builder.query<CourseVideosResponse, string>({
      query: () => ({
        url: `/course-details/`,
        method: "GET",
      }),
    }),

    // Add a new video
    addCourseVideo: builder.mutation<SingleCourseVideoResponse, FormData>({
      query: (formData) => ({
        url: `/course-details/`,
        method: "POST",
        body: formData,
      }),
    }),

    // Fetch a single video by ID
    getCourseVideos: builder.query<CourseById, number>({
      query: (id) => ({
        url: `/course-details/course/${id}`,
        method: "GET",
      }),
    }),

    // Update an existing video
    updateCourseVideo: builder.mutation<
      SingleCourseVideoResponse,
      UpdateCourseVideoRequest
    >({
      query: ({ id, title, link }) => ({
        url: `/course-details/${id}`,
        method: "PUT",
        body: { title, link },
      }),
    }),

    // Delete a video
    deleteCourseVideo: builder.mutation<DeleteCourseVideoResponse, number>({
      query: (videoId) => ({
        url: `/course-details/${videoId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetCourseVideosQuery,
  useUpdateCourseVideoMutation,
  useDeleteCourseVideoMutation,
  useAddCourseVideoMutation,
} = courseDetailsApi;

export default courseDetailsApi;
