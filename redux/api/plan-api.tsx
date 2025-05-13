import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  DeleteResponse,
  Plan,
  PlanResponse,
  SinglePlanResponse,
} from "@/types/plans";

export const planApi = createApi({
  reducerPath: "planApi",
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
    addPlan: builder.mutation<PlanResponse, Plan>({
      query: (data) => ({
        url: "/subscription",
        method: "POST",
        body: data,
      }),
    }),
    getPlans: builder.query<PlanResponse, void>({
      query: () => ({
        url: "/subscription",
        method: "GET",
      }),
    }),
    getPlan: builder.query<SinglePlanResponse, number>({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "GET",
      }),
    }),
    updatePlan: builder.mutation<PlanResponse, { id: number } & Plan>({
      query: ({ id, ...body }) => ({
        url: `/subscription/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deletePlan: builder.mutation<DeleteResponse, number>({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddPlanMutation,
  useGetPlansQuery,
  useGetPlanQuery,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = planApi;

export default planApi;
