import { baseApi } from "@/redux/api/baseApi";

const Profile = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    GetProfile: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    UpdateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    UpdateProfileImage: builder.mutation({
      query: (data) => ({
        url: "/users/profile/picture/upload",
        method: "POSt",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `/general-info/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const { 
  useGetProfileQuery, 
  useUpdateProfileMutation,
  useUpdateProfileImageMutation, 
  useDeleteProfileMutation,
} = Profile;