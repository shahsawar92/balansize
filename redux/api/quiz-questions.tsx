import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import {
  QuizQuestionRequest,
  QuizQuestionResponse,
} from "@/types/quiz-questions";

export const quizQuestionApi = createApi({
  reducerPath: "quizQuestionApi",
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
    addQuizQuestion: builder.mutation<
      QuizQuestionResponse,
      QuizQuestionRequest
    >({
      query: (credentials) => {
        logger(API_URL, "API_URL");
        return {
          url: "/quiz/question",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getQuizQuestions: builder.query<QuizQuestionResponse, void>({
      query: () => {
        return {
          url: "/quiz/question",
          method: "GET",
        };
      },
    }),
    getQuizQuestion: builder.query<QuizQuestionResponse, string>({
      query: (id) => {
        return {
          url: `/quiz/question/${id}`,
          method: "GET",
        };
      },
    }),
    updateQuizQuestion: builder.mutation<
      QuizQuestionResponse,
      { id: number; data: QuizQuestionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/quiz/question/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteQuizQuestion: builder.mutation<QuizQuestionResponse, number>({
      query: (id) => {
        return {
          url: `/quiz/question/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useAddQuizQuestionMutation,
  useGetQuizQuestionsQuery,
  useGetQuizQuestionQuery,
  useUpdateQuizQuestionMutation,
  useDeleteQuizQuestionMutation,
} = quizQuestionApi;
export default quizQuestionApi;
