import { baseApi } from "@/redux/api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentStatus: builder.query({
      query: () => ({
        url: `/payment/status`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    verifyPaymentSession: builder.query({
      query: ({ sessionId }) => ({
        url: `/payment/verify-session/${sessionId}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    createPaymentLink: builder.mutation({
      query: ({ reqBody }) => ({
        url: `/payment/create-checkout-session`,
        method: "POST",
        body: reqBody,
      }),
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useGetPaymentStatusQuery,
  useCreatePaymentLinkMutation,
  useVerifyPaymentSessionQuery,
} = paymentApi;
