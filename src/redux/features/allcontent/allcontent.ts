import { baseApi } from "@/redux/api/baseApi";
const allContent = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettingContentWithType: builder.query({
      query: (type) => ({
        url: `/admin/settings/content/${type}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    getAllFaqs: builder.query({
      query: () => ({
        url:`/admin/faqs`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const { useGetSettingContentWithTypeQuery, useGetAllFaqsQuery } = allContent;