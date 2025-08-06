import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  CommunityListResponse,
  SingleCommunityResponse,
} from "@/types/community";

export const communityApi = createApi({
  reducerPath: "communityApi",
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
    addCommunity: builder.mutation<CommunityListResponse, FormData>({
      query: (data) => ({
        url: "/community",
        method: "POST",
        body: data,
      }),
    }),
    addImageToCommunity: builder.mutation<
      CommunityListResponse,
      { communityId: number; data: FormData }
    >({
      query: ({ communityId, data }) => ({
        url: `/community/add/image/${communityId}`,
        method: "POST",
        body: data,
      }),
    }),
    getCommunities: builder.query<CommunityListResponse, void>({
      query: () => ({
        url: "/community",
        method: "GET",
      }),
    }),
    getCommunity: builder.query<SingleCommunityResponse, number>({
      query: (id) => ({
        url: `/community/${id}`,
        method: "GET",
      }),
    }),
    updateCommunity: builder.mutation<
      CommunityListResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/community/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCommunity: builder.mutation<
      {
        status: string;
        message: string;
      },
      number
    >({
      query: (id) => ({
        url: `/community/${id}`,
        method: "DELETE",
      }),
    }),
    deleteCommunityImage: builder.mutation<
      { status: string; message: string },
      { imageId: number }
    >({
      query: ({ imageId }) => ({
        url: `/community/image/remove/${imageId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddCommunityMutation,
  useGetCommunitiesQuery,
  useGetCommunityQuery,
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
  useDeleteCommunityImageMutation,
  useAddImageToCommunityMutation,
} = communityApi;

export default communityApi;
