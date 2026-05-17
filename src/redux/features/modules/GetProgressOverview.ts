import { baseApi } from "@/redux/api/baseApi";

const GetProgressOverview = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgressById: builder.query({
      query: (id) => ({
        url: `/progress?childProfileId=${id}`,
        method: "GET",
      }),
      providesTags: ["progress"],
      transformResponse: (response) => response,
    }),
    updateCheckPoints: builder.mutation({
      query: ({ updatesBody }) => ({
        url: `/progress/checkpoint`,
        method: "POST",
        body: updatesBody,
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const { useGetProgressByIdQuery, useUpdateCheckPointsMutation } = GetProgressOverview;
