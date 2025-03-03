import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  CourseResponse,
  SingleCourseResponse,
} from "@/types/courses";

export const courseApi = createApi({
  reducerPath: "courseApi",
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
    addCourse: builder.mutation<CourseResponse, FormData>({
      query: (credentials) => {
        logger(API_URL, "API_URL");
        return {
          url: "/courses",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getCourses: builder.query<CourseResponse, void>({
      query: () => {
        return {
          url: "/courses",
          method: "GET",
        };
      },
    }),
    getCourse: builder.query<SingleCourseResponse, string>({
      query: (id) => {
        return {
          url: `/courses/${id}`,
          method: "GET",
        };
      },
    }),
    updateCourse: builder.mutation<
      CourseResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCourse: builder.mutation<CourseResponse, number>({
      query: (id) => {
        return {
          url: `/courses/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useAddCourseMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
export default courseApi;
