
import { baseApi } from "@/redux/api/baseApi";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    getSingleUser: builder.query({
      query: () => ({
        url: `/users/self/in`,
        method: "GET",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resendPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resitPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data,
      }),
    }),
    verifyAccount: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-email`,
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-reset-otp`,
        method: "POST",
        body: data,
      }),
    }),
    GoogleLogin: builder.mutation({
      query: (data) => {
        console.log("Google login data:", data);
        return {
          url: `/auth/google`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgetPasswordMutation,
  useResendPasswordMutation,
  useResitPasswordMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useVerifyAccountMutation,
  useGetSingleUserQuery,
  useGoogleLoginMutation, 
} = authApi;
