import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { QueueStatus, Ticket } from "../../types/queue";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/queue`,
  credentials: "include",
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token via the auth endpoint
    const refreshResult = await fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_API_URL}/auth`,
      credentials: "include",
    })({ url: "/refresh", method: "POST" }, api, extraOptions);

    if (refreshResult.data) {
      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const queueApi = createApi({
  reducerPath: "queueApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Queue", "Ticket"],
  endpoints: (builder) => ({
    getQueueStatus: builder.query<QueueStatus, void>({
      query: () => "/status",
      providesTags: ["Queue"],
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // Import socket dynamically to avoid issues with some build setups,
        // or ensure it's imported at the top.
        const { socket } = await import("../../utils/socket");

        try {
          await cacheDataLoaded;

          socket.on("queueUpdated", (data: QueueStatus) => {
            updateCachedData((draft) => {
              Object.assign(draft, data);
            });
          });
        } catch {}
        await cacheEntryRemoved;
        socket.off("queueUpdated");
      },
    }),
    takeNumber: builder.mutation<Ticket, void>({
      query: () => ({
        url: "/take",
        method: "POST",
      }),
      invalidatesTags: ["Queue", "Ticket"],
    }),
    getMyTicket: builder.query<Ticket | null, void>({
      query: () => "/my-ticket",
      providesTags: ["Ticket"],
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        const { socket } = await import("../../utils/socket");
        try {
          await cacheDataLoaded;

          // Get user ID from auth state if possible or wait for the first socket event
          // For simplicity, we can listen for specific events if we had the ID here,
          // but better yet, let the ticket controller emit the update.
          // In a more complex app, we might store the user ID in the auth slice.
          const userId = (getState() as any).auth?.user?.id;

          if (userId) {
            socket.on(`ticketUpdated:${userId}`, (data: Ticket | null) => {
              updateCachedData(() => data);
            });
          }

          socket.on("ticketUpdated:all", () => {
            updateCachedData(() => null);
          });
        } catch {}
        await cacheEntryRemoved;
        socket.off("ticketUpdated:all");
        // Clean up individual user listener if we had the ID
      },
    }),

    // Admin endpoints
    incrementNumber: builder.mutation<QueueStatus, void>({
      query: () => ({
        url: "/increment",
        method: "PATCH",
      }),
      invalidatesTags: ["Queue", "Ticket"],
    }),
    decrementNumber: builder.mutation<QueueStatus, void>({
      query: () => ({
        url: "/decrement",
        method: "PATCH",
      }),
      invalidatesTags: ["Queue", "Ticket"],
    }),
    toggleBookings: builder.mutation<QueueStatus, void>({
      query: () => ({
        url: "/toggle-bookings",
        method: "PATCH",
      }),
      invalidatesTags: ["Queue"],
    }),
    resetQueue: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/reset",
        method: "POST",
      }),
      invalidatesTags: ["Queue", "Ticket"],
    }),
  }),
});

export const {
  useGetQueueStatusQuery,
  useTakeNumberMutation,
  useIncrementNumberMutation,
  useDecrementNumberMutation,
  useToggleBookingsMutation,
  useResetQueueMutation,
  useGetMyTicketQuery,
} = queueApi;
