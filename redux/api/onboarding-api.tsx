import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  OnboardingResponse,
  SingleOnboardingResponse,
} from "@/types/onboarding";

export const onboardingApi = createApi({
  reducerPath: "onboardingApi",
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
    addOnboardingPartner: builder.mutation<OnboardingResponse, FormData>({
      query: (credentials) => {
        logger(API_URL, "API_URL");
        return {
          url: "/onboarding",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getOnboardingPartners: builder.query<OnboardingResponse, void>({
      query: () => {
        return {
          url: "/onboarding",
          method: "GET",
        };
      },
    }),
    getSingleOnboardingPartner: builder.query<SingleOnboardingResponse, string>(
      {
        query: (id) => {
          return {
            url: `/onboarding/${id}`,
            method: "GET",
          };
        },
      }
    ),
    updateOnboardingPartner: builder.mutation<
      OnboardingResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/onboarding/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteOnboardingPartner: builder.mutation<OnboardingResponse, number>({
      query: (id) => {
        return {
          url: `/onboarding/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useAddOnboardingPartnerMutation,
  useGetOnboardingPartnersQuery,
  useGetSingleOnboardingPartnerQuery,
  useUpdateOnboardingPartnerMutation,
  useDeleteOnboardingPartnerMutation,
} = onboardingApi;
export default onboardingApi;
