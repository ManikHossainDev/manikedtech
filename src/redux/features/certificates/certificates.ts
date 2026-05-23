import { baseApi } from "@/redux/api/baseApi";
const Certificates = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    CertificatesLock: builder.query({
      query: (id) => ({
        url: `/certificates/child/${id}/trophies`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    updateParentTips: builder.mutation({
      query: ({ id, data }) => ({
        url: `/parent-tips/child/${id}/customize`,
        method: "PUT",
        body: data,
      }),
    }),
    CreateReviews: builder.mutation({
      query: (data) => ({
        url: "/reviews/create",
        method: "POST",
        body: data,
      }),
    }),
    getReviews: builder.query({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
    }),
  }),
});

export const { 
  useCertificatesLockQuery, 
  useUpdateParentTipsMutation, 
  useCreateReviewsMutation,
  useGetReviewsQuery 
} = Certificates;
