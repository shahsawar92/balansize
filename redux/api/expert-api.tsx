import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import { ExpertRequest, ExpertResponse } from "@/types/experts";

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
    addExpert: builder.mutation<ExpertResponse, ExpertRequest>({
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
    getExpert: builder.query<ExpertResponse, number>({
      query: (id) => {
        return {
          url: `/experts/${id}`,
          method: "GET",
        };
      },
    }),
    updateExpert: builder.mutation<
      ExpertResponse,
      { id: number; data: ExpertRequest }
    >({
      query: ({ id, data }) => ({
        url: `/experts/${id}`,
        method: "POST",
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
  }),
});

// Export hooks
export const {
  useAddExpertMutation,
  useGetExpertsQuery,
  useGetExpertQuery,
  useUpdateExpertMutation,
  useDeleteExpertMutation,
} = expertApi;
export default expertApi;
