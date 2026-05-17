import { baseApi } from "@/redux/api/baseApi";

const modulesOne = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModulesById: builder.query({
      query: (id) => ({
        url: `/admin/modules/${id}`,
        method: "GET",
      }),
      providesTags: ["modules"],
      transformResponse: (response) => response,
    }),
  }),
});

export const { useGetModulesByIdQuery } = modulesOne;
