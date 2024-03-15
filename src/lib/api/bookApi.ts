import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Book from '../types/Book';
import { ENTRYPOINT } from '@/config/entrypoint';

export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery({ baseUrl: ENTRYPOINT }),
    endpoints: builder => ({
        getAll: builder.query<any, number>({
            query: (page) => {
                return `/books?page=${page}`
            }
        }),
        delete: builder.mutation<any, string>({
            query: (id) => {
                return {
                    url: `${id}`,
                    method: 'DELETE'
                }
            }
        }),
        create: builder.mutation<any, Book>({
            query: (book) => {
                return {
                    url: `/books`,
                    method: 'POST',
                    body: book,
                }
            }
        }),
        update: builder.mutation<any, Book>({
            query: (book) => {
                return {
                    url: `${book['@id']}`,
                    method: 'PUT',
                    body: book,
                }
            }
        }),
    })
});

export const { useLazyGetAllQuery, useDeleteMutation, useCreateMutation, useUpdateMutation } = bookApi;