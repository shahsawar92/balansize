import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

// types
type HomeMessageResponse = {
  success: boolean;
  message: string;
  result: {
    id: number;
    message: string;
  };
};

type HomeMessageBody = {
  id: number;
  message: string;
};

export const homeMessageApi = createApi({
  reducerPath: "homeMessageApi",
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
    getHomeMessage: builder.query<HomeMessageResponse, void>({
      query: () => ({
        url: "/home-message",
        method: "GET",
      }),
    }),
    updateHomeMessage: builder.mutation<HomeMessageResponse, HomeMessageBody>({
      query: ({ id, message }) => ({
        url: `/home-message/${id}`,
        method: "POST",
        body: { message },
      }),
    }),
  }),
});

export const { useGetHomeMessageQuery, useUpdateHomeMessageMutation } =
  homeMessageApi;

export default homeMessageApi;
