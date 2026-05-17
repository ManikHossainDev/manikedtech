import { baseApi } from "@/redux/api/baseApi";
const Child = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    GetChild: builder.query({
      query: () => ({
        url: "/child-profiles",
        method: "GET",
      }),
      providesTags: ["Child"],
    }),
    GetChildAgreements: builder.query({
      query: () => ({
        url: "/family-agreements/children-with-agreements",
        method: "GET",
      }),
      providesTags: ["Child"],
    }),
    GetParentTipsByChild: builder.query({
      query: ({ childrenId }) => ({
        url: `/parent-tips/child/${childrenId}`,
        method: "GET",
      }),
      transformResponse: (res) => res.data,
    }),
    CreateChild: builder.mutation({
      query: (data) => ({
        url: "/child-profiles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Child"],
    }),
    UpdateChild: builder.mutation({
      query: ({ data, id }) => ({
        url: `/child-profiles/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Child"],
    }),
    UpdateChildImage: builder.mutation({
      query: ({ data, id }) => ({
        url: `/child-profiles/${id}/profile-picture/upload`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Child"],
    }),
    deleteChild: builder.mutation({
      query: (id) => ({
        url: `/child-profiles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Child"],
    }),
    getSingleChild: builder.query({
      query: (id) => ({
        url: `/certificates/child/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetChildAgreementsQuery,
  useGetChildQuery,
  useCreateChildMutation,
  useUpdateChildMutation,
  useUpdateChildImageMutation,
  useDeleteChildMutation,
  useGetParentTipsByChildQuery,
  useGetSingleChildQuery,
} = Child;

