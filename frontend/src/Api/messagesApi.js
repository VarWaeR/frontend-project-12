import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/messages',
    prepareHeaders: (headers) => {
      const data = JSON.parse(localStorage.getItem('userId'));

      headers.set('Authorization', `Bearer ${data.token}`);

      return headers;
    },
  }),
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '',
      providesTags: ['Messages'],
    }),
    addMessage: builder.mutation({
      query: (message) => ({
        method: 'POST',
        body: message,
      }),
    }),
    updateMessage: builder.mutation({
      query: (message) => ({
        method: 'PATCH',
        body: message,
      }),
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: id,
        method: 'DELETE',
      }),
    }),
  }),

});

const {
  useGetMessagesQuery,
  useAddMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;

export {
  useGetMessagesQuery as useGetMessages,
  useAddMessageMutation as useAddMessage,
  useUpdateMessageMutation as useUpdateMessage,
  useDeleteMessageMutation as useDeleteMessage,
};