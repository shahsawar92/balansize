import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import logger from "@/lib/logger";

import { API_URL } from "@/constant/env";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: string;
  message: string;
  result: {
    accessToken: string;
    user: {
      id: number;
      name: string;
      email: string;
      user_type: string;
      first_name: string;
      last_name: string;
    };
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => {
        logger(credentials, "credentials received in the login endpoint");
        logger(API_URL, "API_URL");
        return {
          url: "/auth/login",
          method: "POST",
          body: credentials,
        };
      },
    }),
  }),
});

// Export hooks
export const { useLoginMutation } = authApi;
export default authApi;
