import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  Article,
  ArticleResponse,
  DeleteResponse,
  singleArticleResponse,
} from "@/types/articles";

export const articleApi = createApi({
  reducerPath: "articleApi",
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
    addArticle: builder.mutation<ArticleResponse, Article | FormData>({
      query: (credentials) => ({
        url: "/articles",
        method: "POST",
        body: credentials,
        formData: credentials instanceof FormData,
      }),
    }),
    getArticles: builder.query<ArticleResponse, void>({
      query: () => ({
        url: "/articles",
        method: "GET",
      }),
    }),
    getArticle: builder.query<singleArticleResponse, number>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "GET",
      }),
    }),
    updateArticle: builder.mutation<
      ArticleResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteArticle: builder.mutation<DeleteResponse, number>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetArticlesQuery,
  useAddArticleMutation,
  useGetArticleQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi;

export default articleApi;
