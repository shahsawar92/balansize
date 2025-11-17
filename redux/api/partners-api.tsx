import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import { PartnerResponse, SinglePartnerResponse } from "@/types/partners";

type bodyTypes = {
  link: string;
  description: string;
  is_premium: string;
};

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
  tagTypes: ["Partner", "Partners"],
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
      invalidatesTags: ["Partners"],
    }),
    addImageToPartner: builder.mutation<
      PartnerResponse,
      { partnerId: number; data: FormData }
    >({
      query: ({ partnerId, data }) => ({
        url: `/partners/add/image/${partnerId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { partnerId }) => [
        { type: "Partner", id: partnerId },
        "Partners",
      ],
    }),
    getPartners: builder.query<PartnerResponse, void>({
      query: () => {
        return {
          url: "/partners",
          method: "GET",
        };
      },
      providesTags: ["Partners"],
    }),
    getPartner: builder.query<SinglePartnerResponse, string>({
      query: (id) => {
        return {
          url: `/partners/${id}`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => [
        { type: "Partner", id: Number(id) },
      ],
    }),
    updatePartner: builder.mutation<
      PartnerResponse,
      { id: number; data: bodyTypes }
    >({
      query: ({ id, data }) => {
        return {
          url: `/partners/${id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Partner", id },
        "Partners",
      ],
    }),
    deleteImageFromPartner: builder.mutation<
      { status: string; message: string },
      { imageId: number }
    >({
      query: ({ imageId }) => ({
        url: `/partners/image/remove/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Partners"],
    }),
    deletePartner: builder.mutation<PartnerResponse, number>({
      query: (id) => {
        return {
          url: `/partners/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Partners"],
    }),
  }),
});

// Export hooks
export const {
  useAddPartnerMutation,
  useGetPartnersQuery,
  useGetPartnerQuery,
  useUpdatePartnerMutation,
  useAddImageToPartnerMutation,
  useDeleteImageFromPartnerMutation,
  useDeletePartnerMutation,
} = partnerApi;
export default partnerApi;
