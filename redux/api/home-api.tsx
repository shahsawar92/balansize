import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

// Response type for home dashboard
export type DashboardHomeResponse = {
  result: {
    counters: {
      users: number;
      subscriptions: number;
      experts: number;
      courses: number;
      lessons: number;
    };
    monthlyUsers: {
      month: string; // e.g., "2"
      monthname: string; // e.g., "February "
      count: string; // e.g., "5" — returned as string in the API
    }[];
    articleCategories: {
      categoryId: number;
      categoryName: string;
      count: string; // also a string in the API
    }[];
  };
};

export const homeApi = createApi({
  reducerPath: "homeApi",
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
    getDashboardHome: builder.query<DashboardHomeResponse, void>({
      query: () => ({
        url: "/homes/dashboard",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardHomeQuery } = homeApi;

export default homeApi;
