import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api',
  prepareHeaders: async headers => {
    // const token = await storageService.getItem(StorageKeys.ACCESS_TOKEN);
    // if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
  fetchFn: fetch, // default
});

type User = {
  name: string;
};
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'User', 'Post', 'Upload'],
  endpoints: builder => ({
    getUser: builder.query<User, string>({
      query: id => `/users/${id}`,
      providesTags: (_, __, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'User', id }],
    }),
    // Add more endpoints
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = api;
