import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import { PartnerResponse, SinglePartnerResponse } from "@/types/partners";

export const partnerApi = createApi({
  reducerPath: "partnerApi",
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
    addPartner: builder.mutation<PartnerResponse, FormData>({
      query: (credentials) => {
        logger(API_URL, "API_URL");
        return {
          url: "/partners",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getPartners: builder.query<PartnerResponse, void>({
      query: () => {
        return {
          url: "/partners",
          method: "GET",
        };
      },
    }),
    getPartner: builder.query<SinglePartnerResponse, string>({
      query: (id) => {
        return {
          url: `/partners/${id}`,
          method: "GET",
        };
      },
    }),
    updatePartner: builder.mutation<
      PartnerResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/partners/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deletePartner: builder.mutation<PartnerResponse, number>({
      query: (id) => {
        return {
          url: `/partners/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useAddPartnerMutation,
  useGetPartnersQuery,
  useGetPartnerQuery,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnerApi;
export default partnerApi;
