import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../types/queue";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/auth`,
  credentials: "include",
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      { url: "/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    checkAuth: builder.query<User, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
    signup: builder.mutation<
      { user: User },
      Partial<User> & { password?: string }
    >({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation<
      { user: User },
      { email?: string; password?: string }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCheckAuthQuery,
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
