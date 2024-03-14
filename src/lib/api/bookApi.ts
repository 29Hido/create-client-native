import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Book from '../types/Book';

const BASE_URL = `http://localhost:80/books`

export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: builder => ({
        getAll: builder.query<any, number>({
            query: (page) => {
                return `?page=${page}`
            }
        }),
        delete: builder.mutation<any, number>({
            query: (id) => {
                return {
                    url: `/${id}`,
                    method: 'DELETE'
                }
            }
        }),
        create: builder.mutation<any, Book>({
            query: (book) => {
                return {
                    url: ``,
                    method: 'POST',
                    body: book,
                }
            }
        }),
        update: builder.mutation<any, Book>({
            query: (book) => {
                return {
                    url: `/${book.id}`,
                    method: 'PUT',
                    body: book,
                }
            }
        }),
    })
});

export const { useLazyGetAllQuery, useDeleteMutation, useCreateMutation, useUpdateMutation } = bookApi;