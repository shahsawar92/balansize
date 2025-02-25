import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  CategoryRequest,
  CategoryResponse,
  SingleCategoryResponse,
} from "@/types/categories-types";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
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
    addCategory: builder.mutation<CategoryResponse, FormData>({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        body: formData,
      }),
    }),

    getCategories: builder.query<CategoryResponse, void>({
      query: () => {
        return {
          url: "/categories",
          method: "GET",
        };
      },
    }),
    getCategory: builder.query<SingleCategoryResponse, number>({
      query: (id) => {
        return {
          url: `/categories/${id}`,
          method: "GET",
        };
      },
    }),
    updateCategory: builder.mutation<
      SingleCategoryResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteCategory: builder.mutation<CategoryResponse, number>({
      query: (id) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
export default categoryApi;
