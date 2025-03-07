import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import { singleUserResponse, UserResponse } from "@/types/users";

export const userApi = createApi({
  reducerPath: "userApi",
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
    addUser: builder.mutation<UserResponse, FormData>({
      query: (credentials) => {
        logger(API_URL, "API_URL");
        return {
          url: "/users",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getUsers: builder.query<UserResponse, void>({
      query: () => {
        return {
          url: "/users",
          method: "GET",
        };
      },
    }),
    getUser: builder.query<singleUserResponse, string>({
      query: (id) => {
        return {
          url: `/users/${id}`,
          method: "GET",
        };
      },
    }),
    updateUser: builder.mutation<UserResponse, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteUser: builder.mutation<UserResponse, number>({
      query: (id) => {
        return {
          url: `/users/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useAddUserMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

export default userApi;
