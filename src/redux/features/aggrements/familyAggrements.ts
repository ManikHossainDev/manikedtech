import { baseApi } from "@/redux/api/baseApi";

const familyAgreements = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET family agreement templates/defaults
    getFamilyAgreementTemplates: builder.query({
      query: () => ({
        url: `family-agreements/templates`,
        method: "GET",
      }),
      transformResponse: (res) => res.data,
    }),

    // GET family agreements by step
    getFamilyAgreementsByChildren: builder.query({
      query: ({ childrenId, step }) => ({
        url: `family-agreements/child/${childrenId}`,
        method: "GET",
        params: { step },
      }),
      transformResponse: (res) => res.data,
    }),

    // CREATE family agreement
    createFamilyAgreement: builder.mutation({
      query: (body) => ({
        url: "family-agreements",
        method: "POST",
        body,
      }),
    }),

    // delete agreement
    deleteAgreement: builder.mutation({
      query: (id) => ({
        url: `/family-agreements/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetFamilyAgreementTemplatesQuery,
  useGetFamilyAgreementsByChildrenQuery,
  useCreateFamilyAgreementMutation,
  useDeleteAgreementMutation,
} = familyAgreements;
