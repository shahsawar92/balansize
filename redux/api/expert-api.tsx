import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  ExpertRequest,
  ExpertResponse,
  ExpertTypeRequest,
  ExpertTypeResponse,
  singleExpertResponse,
  SingleExpertTypeResponse,
} from "@/types/experts";

export const expertApi = createApi({
  reducerPath: "expertApi",
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
    addExpert: builder.mutation<ExpertResponse, FormData>({
      query: (credentials) => {
        logger(API_URL, "API_URL");
        return {
          url: "/experts",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getExperts: builder.query<ExpertResponse, void>({
      query: () => {
        return {
          url: "/experts",
          method: "GET",
        };
      },
    }),
    getExpert: builder.query<singleExpertResponse, string>({
      query: (id) => {
        return {
          url: `/experts/${id}`,
          method: "GET",
        };
      },
    }),
    updateExpert: builder.mutation<
      ExpertResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/experts/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteExpert: builder.mutation<ExpertResponse, number>({
      query: (id) => {
        return {
          url: `/experts/${id}`,
          method: "DELETE",
        };
      },
    }),

    getExpertTypes: builder.query<ExpertTypeResponse, void>({
      query: () => {
        return {
          url: "/expert-types",
          method: "GET",
        };
      },
    }),
    getSingleExpertType: builder.query<SingleExpertTypeResponse, string>({
      query: (id) => {
        return {
          url: `/expert-types/${id}`,
          method: "GET",
        };
      },
    }),
    addExpertType: builder.mutation<ExpertTypeResponse, ExpertTypeRequest>({
      query: (credentials) => {
        return {
          url: "/expert-types",
          method: "POST",
          body: credentials,
        };
      },
    }),

    deleteExpertType: builder.mutation<ExpertTypeResponse, number>({
      query: (id) => {
        return {
          url: `/expert-types/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useAddExpertMutation,
  useGetExpertsQuery,
  useGetExpertQuery,
  useUpdateExpertMutation,
  useDeleteExpertMutation,

  useGetExpertTypesQuery,
  useGetSingleExpertTypeQuery,
  useAddExpertTypeMutation,
  useDeleteExpertTypeMutation,
} = expertApi;
export default expertApi;
