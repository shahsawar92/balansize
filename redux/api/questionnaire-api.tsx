import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/constant/env";

import { selectCurrentToken } from "../features/auth-slice";
import { RootState } from "../store";

import { DeleteResponse, Question, QuestionResponse } from "@/types/questions";

export const questionApi = createApi({
  reducerPath: "questionApi",
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
    addQuestion: builder.mutation<QuestionResponse, Question>({
      query: (credentials) => {
        return {
          url: "/questions",
          method: "POST",
          body: credentials,
        };
      },
    }),
    getQuestions: builder.query<QuestionResponse, void>({
      query: () => {
        return {
          url: "/questions",
          method: "GET",
        };
      },
    }),
    getQuestion: builder.query<QuestionResponse, number>({
      query: (id) => {
        return {
          url: `/questions/${id}`,
          method: "GET",
        };
      },
    }),
    updateQuestion: builder.mutation<
      QuestionResponse,
      { id: number; data: Question }
    >({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteQuestion: builder.mutation<DeleteResponse, number>({
      query: (id) => {
        return {
          url: `/questions/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useGetQuestionQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
export default questionApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// import { selectCurrentToken } from "../features/auth-slice";
// import { RootState } from "../store";
// import { QuestionResponse } from "@/types/questions";

// const mockData: QuestionResponse = {
//   success: true,
//   message: "Questions fetched successfully",
//   result: [
//     {
//       id: 53,
//       is_questioner: true,
//       is_multiple: false,
//       question_texts: [
//         {
//           id: 114,
//           language: "EN",
//           question_text: "What is the capital of France?",
//           option: [
//             {
//               id: 23,
//               option_text: "Paris",
//               tags: ["capital", "Europe", "France"],
//             },
//             {
//               id: 24,
//               option_text: "London",
//               tags: ["capital", "Europe", "UK"],
//             },
//           ],
//         },
//         {
//           id: 115,
//           language: "AR",
//           question_text: "ما هي عاصمة فرنسا؟",
//           option: [
//             {
//               id: 25,
//               option_text: "باريس",
//             },
//             {
//               id: 26,
//               option_text: "لندن",
//             },
//           ],
//         },
//         {
//           id: 116,
//           language: "RU",
//           question_text: "Какова столица Франции?",
//           option: [
//             {
//               id: 27,
//               option_text: "Париж",
//             },
//             {
//               id: 28,
//               option_text: "Лондон",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 54,
//       is_questioner: true,
//       is_multiple: false,
//       question_texts: [
//         {
//           id: 117,
//           language: "EN",
//           question_text: "Which planet is known as the Red Planet?",
//           option: [
//             {
//               id: 29,
//               option_text: "Mars",
//               tags: ["planet", "space", "Mars"],
//             },
//             {
//               id: 30,
//               option_text: "Venus",
//               tags: ["planet", "space", "Venus"],
//             },
//           ],
//         },
//         {
//           id: 118,
//           language: "AR",
//           question_text: "أي كوكب يُعرف بالكوكب الأحمر؟",
//           option: [
//             {
//               id: 31,
//               option_text: "المريخ",
//             },
//             {
//               id: 32,
//               option_text: "الزهرة",
//             },
//           ],
//         },
//         {
//           id: 119,
//           language: "RU",
//           question_text: "Какая планета известна как Красная планета?",
//           option: [
//             {
//               id: 33,
//               option_text: "Марс",
//             },
//             {
//               id: 34,
//               option_text: "Венера",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 55,
//       is_questioner: true,
//       is_multiple: false,
//       question_texts: [
//         {
//           id: 120,
//           language: "EN",
//           question_text: "Who wrote 'Hamlet'?",
//           option: [
//             {
//               id: 35,
//               option_text: "William Shakespeare",
//               tags: ["literature", "playwright", "Shakespeare"],
//             },
//             {
//               id: 36,
//               option_text: "Charles Dickens",
//               tags: ["literature", "novelist", "Dickens"],
//             },
//           ],
//         },
//         {
//           id: 121,
//           language: "AR",
//           question_text: "من كتب 'هاملت'؟",
//           option: [
//             {
//               id: 37,
//               option_text: "وليام شكسبير",
//             },
//             {
//               id: 38,
//               option_text: "تشارلز ديكنز",
//             },
//           ],
//         },
//         {
//           id: 122,
//           language: "RU",
//           question_text: "Кто написал 'Гамлета'?",
//           option: [
//             {
//               id: 39,
//               option_text: "Уильям Шекспир",
//             },
//             {
//               id: 40,
//               option_text: "Чарльз Диккенс",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 154,
//       is_questioner: true,
//       is_multiple: false,
//       question_texts: [
//         {
//           id: 116,
//           language: "EN",
//           question_text: "How?",
//           option: [
//             {
//               id: 27,
//               option_text: "Option A",
//               tags: ["tag7", "tag8"],
//             },
//             {
//               id: 28,
//               option_text: "Option B",
//               tags: ["tag9", "tag10"],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// const questionApi = createApi({
//   reducerPath: "questionApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://mock-api.com", // Placeholder, won't be used
//     prepareHeaders: (headers, { getState }) => {
//       const token = selectCurrentToken(getState() as RootState);
//       if (token) {
//         headers.set("Authorization", token);
//       }
//       return headers;
//     },
//     fetchFn: async (url, options) => {
//       const path = url.toString();
//       if (path.includes("/questions")) {
//         if (options?.method === "POST") {
//           const newQuestion = JSON.parse(options?.body as string);
//           mockData.result.push(newQuestion);
//           return new Response(
//             JSON.stringify({
//               success: true,
//               message: "Question added",
//               result: newQuestion,
//             }),
//             { status: 201 }
//           );
//         }
//         if (options?.method === "PUT") {
//           const updatedQuestion = await JSON.parse(options?.body as string);
//           mockData.result = mockData.result.map((q) =>
//             q.id === updatedQuestion.id ? updatedQuestion : q
//           );
//           return new Response(
//             JSON.stringify({
//               success: true,
//               message: "Question updated",
//               result: updatedQuestion,
//             }),
//             { status: 200 }
//           );
//         }
//         return new Response(JSON.stringify(mockData), { status: 200 });
//       }
//       return new Response(null, { status: 404 });
//     },
//   }),
//   endpoints: (builder) => ({
//     getQuestions: builder.query<QuestionResponse, void>({
//       queryFn: async () => ({ data: mockData }),
//     }),
//     addQuestion: builder.mutation<QuestionResponse, any>({
//       query: (newQuestion) => ({
//         url: "/questions",
//         method: "POST",
//         body: newQuestion,
//       }),
//     }),
//     updateQuestion: builder.mutation<QuestionResponse, any>({
//       query: (updatedQuestion) => ({
//         url: "/questions",
//         method: "PUT",
//         body: updatedQuestion,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetQuestionsQuery,
//   useAddQuestionMutation,
//   useUpdateQuestionMutation,
// } = questionApi;

// export default questionApi;
