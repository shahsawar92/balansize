// tagsApi.ts - API definitions for Tags

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constant/env";
import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";
import {
  TagResponse,
  SingleTagResponse,
  StringTagsResponse,
} from "@/types/tags";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
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
    addTag: builder.mutation<
      TagResponse,
      { name: string; translations: { language: string; name: string }[] }
    >({
      query: (tagData) => ({
        url: "/tags",
        method: "POST",
        body: tagData,
      }),
    }),

    getTags: builder.query<TagResponse, void>({
      query: () => ({
        url: "/tags",
        method: "GET",
      }),
    }),

    getTag: builder.query<SingleTagResponse, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "GET",
      }),
    }),

    getStringTags: builder.query<StringTagsResponse, string>({
      query: () => ({
        url: "/tags/filter",
        method: "GET",
      }),
    }),

    updateTag: builder.mutation<
      SingleTagResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteTag: builder.mutation<TagResponse, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks
export const {
  useAddTagMutation,
  useGetTagsQuery,
  useGetTagQuery,
  useUpdateTagMutation,
  useGetStringTagsQuery,
  useDeleteTagMutation,
} = tagsApi;

export default tagsApi;
